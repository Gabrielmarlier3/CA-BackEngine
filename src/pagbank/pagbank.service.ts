import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountUserService } from '../account-user/account-user.service';
import { MenuService } from '../menu/menu.service';
import { splitPhoneNumber } from '../shared/helpers/splitNumber';
import { HttpService } from '@nestjs/axios';
import { getFormattedExpirationDate } from '../shared/helpers/getFormattedExpirationDate';
import { InjectModel } from '@nestjs/sequelize';
import { PagBankModel } from './pagbank.model';
import { PaymentMethod } from './dto/PaymentOrderCredit';
import { AccountUserModel } from '../account-user/account-user.model';
import { CreateOrderResponse } from './Interface/createOrderResponse';
import { PaymentOrderResponse } from './Interface/paymentOrderResponse';

@Injectable()
export class PagbankService {
  constructor(
    @InjectModel(PagBankModel) private pagBankModel: typeof PagBankModel,
    private accountUserService: AccountUserService,
    private menuService: MenuService,
    private httpService: HttpService,
  ) {}

  private readonly logger = new Logger(PagbankService.name)

  async generateUniqueIdentifier(): Promise<string> {
    const lastItem = await this.pagBankModel.findOne({
      order: [['id', 'DESC']]
    });

    let nextId = 1;

    if (lastItem) {
      const lastIdentifier = lastItem.identifier;
      const numericPart = parseInt(lastIdentifier.split('-')[1], 10);
      nextId = numericPart + 1;
    }

    const paddedId = nextId.toString().padStart(8, '0');
    return `ORD-${paddedId}`;
  }

  //this method need trigger when the user close the shopping cart, then in that response will have the code that we need to use in payingOrder
  //first we need send the food identifier like { EX-0001, EX-0010 } and the quantities { 2 , 1 }, so will have 2 EX-0001 and 1 EX-0010
  //for pix payment method, just this function will resolve
  async createOrder(foodIdentifiers: string[], quantities: number[], cpfCnpj: string): Promise<CreateOrderResponse> {
    const account = await this.accountUserService.getAccountUserByCpfCnpj(cpfCnpj)

    if(!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < foodIdentifiers.length; i++) {
      const foodDetails = await this.menuService.getMealInformation(foodIdentifiers[i]);

      if (!foodDetails) {
        throw new HttpException(`Meal with identifier ${foodIdentifiers[i]} not found`, HttpStatus.NOT_FOUND);
      }

      const itemTotal = foodDetails.price * quantities[i];

      items.push({
        reference_id: foodDetails.identifier,
        name: foodDetails.name,
        quantity: quantities[i],
        unit_amount: foodDetails.price,
        item_total: itemTotal
      });

      totalAmount += itemTotal;
    }
    const uniqueIdentifier = await this.generateUniqueIdentifier()

    const url = `/order`
    const body = {
      reference_id: uniqueIdentifier,
      customer: {
        name: account.name,
        email: account.email,
        tax_id: account.cpfCnpj,
        phones: splitPhoneNumber(account.telephoneNumber),
      },
      items: items,
      shipping:{
      street: account.address.street,
      number: account.address.number,
      complement:  account.address.complement,
      city:  account.address.city,
      region_code: account.address.region_code,
      country: account.address.country ,
      postal_code: account.address.postal_code
      },
      qr_codes: {
        amount: totalAmount,
        //will expire 1 hour later
        expiration_date: getFormattedExpirationDate()
      }
    }

    try {
      const { data } = await this.httpService.axiosRef.post<CreateOrderResponse>(url, body);

      await this.pagBankModel.create({
        pagbankId: data.id,
        totalAmount: totalAmount,
        foodIdentifiers: foodIdentifiers,
        identifier: uniqueIdentifier
      })
      //here will send to front end the order id, need come back to pay
      return data as CreateOrderResponse;

    }catch (error) {
      this.logger.error(error)
      return undefined
    }
  }

  //need test, but teoricamente working
  async paymentOrderCreditCard(orderId: string, payment: PaymentMethod, useSaveCard: boolean): Promise<PaymentOrderResponse> {
    const { installments, soft_descriptor, card } = payment;

    const order = await this.pagBankModel.findOne({

      where: { pagbankId: orderId },
      include: [{
        model: AccountUserModel,
        as: 'user'
      }]
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const url = `/orders/${orderId}/pay`;
    const body = {
      charges: [{
        reference_id: order.identifier,
        description: `payment of ${order.orderInfo.foodIdentifiers}`,
        amount: {
          value: order.orderInfo.totalAmount,
          currency: 'BRL'
        },
        payment_method: useSaveCard ? {
          type: "CREDIT_CARD",
          installments: 1,
          capture: true,
          soft_descriptor: "chame aki",
          card: {
            id: order.user.card.pagBankToken,
            exp_month: order.user.card.expMonth,
            exp_year: order.user.card.expYear
          }
        } : {
          type: "CREDIT_CARD",
          installments,
          capture: true,
          soft_descriptor,
          card
        }
      }]
    };


    try {
      const { data } = await this.httpService.axiosRef.post<PaymentOrderResponse>(url, body);

      // Function tha can save the card for future use
      if (card.store) {
        const charge = data.charges[0];
        await this.accountUserService.savePagBankToken(
          order.user.cpfCnpj,
          charge.payment_method.card.id,
          charge.payment_method.card.last_digits,
          Number(charge.payment_method.card.exp_month),
          Number(charge.payment_method.card.exp_year)
        );
      }


      return data;

    } catch (error) {
      this.logger.error('Error processing payment:', error);
      throw new Error('Payment processing failed');
    }
  }
}

