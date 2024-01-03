import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { EmailService } from 'src/modules/email/services/email.service';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private usersService: UsersService
  ) { }

  async create(userId: number, createExpenseDto: CreateExpenseDto) {
    if(userId !== createExpenseDto.userId){
      return new BadRequestException("User can only create expense for themselves");
    }

    const expense = await this.prismaService.expense.create({
      data: createExpenseDto,
    });

    this.getDataAndSendMail(expense.userId);

    return expense;
  }

  findAll(userId: number) {
    return this.prismaService.expense.findMany({
      where: { userId }
    });
  }

  findOne(userId: number, id: number) {
    return this.prismaService.expense.findUnique({
      where: { id, userId },
    });
  }

  async update(userId: number, id: number, updateExpenseDto: UpdateExpenseDto) {
    if(userId !== updateExpenseDto.userId){
      return new BadRequestException("User can only update expense for themselves");
    }

    const expense = await this.findOne(updateExpenseDto.userId, id);
    if(!expense){
      return new NotFoundException("Expense not found");
    }

    return this.prismaService.expense.update({
      where: { id, userId },
      data: updateExpenseDto,
    });
  }

  async remove(userId: number, id: number) {
    const expense = await this.findOne(userId, id);
    if(!expense){
      return new NotFoundException("Expense not found");
    }

    return this.prismaService.expense.delete({
      where: { id, userId },
    });
  }

  async getDataAndSendMail(userId: number){
    const user = await this.usersService.findOne(userId);
    this.emailService.sendEmail(user.email, "Despesa cadastrada com sucesso!");
  }
}
