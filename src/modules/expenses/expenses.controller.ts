import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './services/expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { AuthService } from '../auth/services/auth.service';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() createExpenseDto: CreateExpenseDto) {
    const user = this.authService.getTokenData(req);
    return this.expensesService.create(user.id, createExpenseDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const user = this.authService.getTokenData(req);
    return this.expensesService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
    const user = this.authService.getTokenData(req);
    return this.expensesService.findOne(user.id, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Req() req: Request, @Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    const user = this.authService.getTokenData(req);
    return this.expensesService.update(user.id, +id, updateExpenseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = this.authService.getTokenData(req);
    return this.expensesService.remove(user.id, +id);
  }
}
