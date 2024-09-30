import { Test, TestingModule } from '@nestjs/testing';
import { AccountAuthController } from './account-auth.controller';
import { AccountAuthService } from './account-auth.service';

describe('AccountAuthController', () => {
  let controller: AccountAuthController;
  let service: AccountAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAuthController],
      providers: [
        {
          provide: AccountAuthService,
          useValue: {
            login: jest.fn(),
            sendRecoveryCode: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountAuthController>(AccountAuthController);
    service = module.get<AccountAuthService>(AccountAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return true when login', async () => {
    const login = {
      email: 'teste@gmail.com',
      password: '123456',
    };

    (service.login as jest.Mock).mockResolvedValue(true);
    const result = await controller.loginAccount(login);

    expect(result).toBe(true);
    expect(service.login).toHaveBeenCalledWith(login.email, login.password);
  });

  it('should return false when login with non-existent account', async () => {
    const login = {
      email: 'teste@gmail.com',
      password: '123456',
    };

    jest.spyOn(service, 'login').mockResolvedValue(false);
    const result = await controller.loginAccount(login);

    expect(result).toBe(false);
    expect(service.login).toHaveBeenCalledWith(login.email, login.password);
  });

  it('should send recovery code', async () => {
    const sendCode = {
      email: 'teste@gmail.com',
    };

    jest.spyOn(service, 'sendRecoveryCode').mockResolvedValue(undefined);
    const result = await controller.sendCode(sendCode);

    expect(result).toBeUndefined();
    expect(service.sendRecoveryCode).toHaveBeenCalledWith(sendCode.email);
  });

  it('should fail to send recovery code', async () => {
    const sendCode = {
      email: 'teste@gmail.com',
    };

    jest.spyOn(service, 'sendRecoveryCode').mockRejectedValue(new Error('Account not Found'));

    try {
      await controller.sendCode(sendCode);
    } catch (error) {
      expect(error.message).toBe('Account not Found');
    }

    expect(service.sendRecoveryCode).toHaveBeenCalledWith(sendCode.email);
  });
});
