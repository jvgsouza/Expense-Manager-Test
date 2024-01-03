import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.USER,
      subject: 'Despesa cadastrada',
      html: `<h3 style="color: red">${mensagem}</h3>`,
    });
  }
}
