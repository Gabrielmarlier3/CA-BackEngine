import { Test, TestingModule } from '@nestjs/testing';
import { AccountUserService } from './account-user.service';
import { getModelToken } from '@nestjs/sequelize';
import { AccountUserModel } from './account-user.model';
import { Logger } from '@nestjs/common';
import { AccountAuthService } from '../account-auth/account-auth.service'; // Import the AccountAuthService

describe('AccountUserService', () => {
  let service: AccountUserService;
  let model: typeof AccountUserModel;
  let accountAuthService: AccountAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountUserService,
        {
          provide: getModelToken(AccountUserModel),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: AccountAuthService, // Provide the AccountAuthService
          useValue: {
            createPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountUserService>(AccountUserService);
    model = module.get<typeof AccountUserModel>(getModelToken(AccountUserModel));
    accountAuthService = module.get<AccountAuthService>(AccountAuthService); // Get the AccountAuthService
  });

  it('should return account user when found', async () => {
    const cpfCnpj = '12345678901';
    const accountUser = { id: 1, cpfCnpj: cpfCnpj };
    jest.spyOn(model, 'findOne').mockResolvedValue(accountUser as any);

    const result = await service.getAccountUserByCpfCnpj(cpfCnpj);
    expect(result).toEqual(accountUser);
  });

});