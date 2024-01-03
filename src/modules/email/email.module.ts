import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    },
  })],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
