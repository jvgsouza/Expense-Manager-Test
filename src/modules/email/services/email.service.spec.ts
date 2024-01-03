import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

const emailServiceMock = {
  sendEmail: jest.fn().mockReturnValue(undefined),
};

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: process.env.USER,
            pass: process.env.PASS,
          },
        },
      })],
      providers: [
        { provide: EmailService, useValue: emailServiceMock },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it(`should send email`, async () => {
      const result = await service.sendEmail("jvsgsouza@gmail.com", "Teste");

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith("jvsgsouza@gmail.com", "Teste");
      expect(result).toBeUndefined();
    });
  });
});
