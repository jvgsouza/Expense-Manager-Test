import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ClassValidatorModule } from './modules/class-validator/class-validator.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ExpensesModule,
    PrismaModule,
    UsersModule,
    ClassValidatorModule,
    AuthModule,
    EmailModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
