import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { EmailService } from 'src/modules/email/services/email.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { CreateUserResponseDto } from 'src/modules/users/dto/create-user-response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const fakeExpenseResponse = [
  {
    id: 1,
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 1
  },
  {
    id: 1,
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 1
  }
];

const fakeDecimalExpense = {
  id: 1,
  description: "Testes",
  date: new Date(),
  value:  new Prisma.Decimal(100),
  userId: 1
};

const fakeWrongExpense = [
  {
    id: 1,
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 5
  }
];

const fakeCreateExpense = [
  {
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 1
  } as CreateExpenseDto
];

const fakeUserList = [
  {
    id: 1,
    email: "joaovsgodoi@gmail.com",
    password: "$2b$08$.4R3so7FhR1JlxD4BAhUL.VVgKS4t3MII0sH40R9D4eALE/eppwq."
  }
];

const fakePayloadResponse = {
  id: 1,
  email: "joaovsgodoi@gmail.com"
} as CreateUserResponseDto;

const prismaMock = {
  expense: {
    create: jest.fn().mockReturnValue(fakeExpenseResponse[0]),
    findMany: jest.fn().mockResolvedValue(fakeExpenseResponse),
    findUnique: jest.fn().mockResolvedValue(fakeExpenseResponse[0]),
    update: jest.fn().mockResolvedValue(fakeExpenseResponse[0]),
    delete: jest.fn().mockResolvedValue(fakeExpenseResponse[0]), 
  },
};

const emailServiceMock = {
  sendEmail: jest.fn(),
};

const userServiceMock = {
  findOne: jest.fn().mockResolvedValue(fakeUserList[0])
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UsersService, useValue: userServiceMock },
        { provide: EmailService, useValue: emailServiceMock },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it(`should create a new expense`, async () => {
      const response = await service.create(fakePayloadResponse.id, fakeCreateExpense[0]);

      expect(response).toEqual(fakeExpenseResponse[0]);
      expect(prismaService.expense.create).toHaveBeenCalledTimes(1);
      expect(prismaService.expense.create).toHaveBeenCalledWith({
        data: fakeCreateExpense[0],
      });
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.findOne).toHaveBeenCalledWith(fakePayloadResponse.id);
      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendEmail).toHaveBeenCalledWith(fakePayloadResponse.email, "Despesa cadastrada com sucesso!");
    });

    it(`should return BadRequestException when user tries to create expense for another`, async () => {
      try {
        await service.create(fakePayloadResponse.id, fakeWrongExpense[0]);
      } catch (error) {
        expect(error).toEqual(new BadRequestException());
      }

      expect(prismaService.expense.create).toHaveBeenCalledTimes(0);
      expect(usersService.findOne).toHaveBeenCalledTimes(0);
      expect(emailService.sendEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe('findAll', () => {
    it(`should return an array of expense`, async () => {
      const response = await service.findAll(fakePayloadResponse.id);

      expect(response).toEqual(fakeExpenseResponse);
      expect(prismaService.expense.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.expense.findMany).toHaveBeenCalledWith({
        "where": {"userId": fakePayloadResponse.id}
      });
    });
  });

  describe('findOne', () => {
    it(`should return a single expense`, async () => {
      const response = await service.findOne(fakePayloadResponse.id, fakeExpenseResponse[0].id);

      expect(response).toEqual(fakeExpenseResponse[0]);
      expect(prismaService.expense.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.expense.findUnique).toHaveBeenCalledWith({
        "where": {id: fakeExpenseResponse[0].id, userId: fakePayloadResponse.id}
      });
    });
  });

  describe('update', () => {
    it(`should update a expense`, async () => {
      const response = await service.update(fakePayloadResponse.id, fakeExpenseResponse[0].id, fakeExpenseResponse[0]);

      expect(response).toEqual(fakeExpenseResponse[0]);
      expect(prismaService.expense.update).toHaveBeenCalledTimes(1);
      expect(prismaService.expense.update).toHaveBeenCalledWith({
        where: {id: fakeExpenseResponse[0].id, userId: fakePayloadResponse.id},
        data: fakeExpenseResponse[0],
      });
      expect(prismaService.expense.findUnique).toHaveBeenCalledTimes(1);
    });

    it(`should return BadRequestException when user tries to update expense for another`, async () => {
      try {
        await service.update(fakePayloadResponse.id, fakeWrongExpense[0].id, fakeWrongExpense[0]);
      } catch (error) {
        expect(error).toEqual(new BadRequestException());
      }

      expect(prismaService.expense.update).toHaveBeenCalledTimes(0);
    });

    it(`should return NotFoundException when user tries to update expense for another`, async () => {
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(undefined);

      try {
        await service.update(fakePayloadResponse.id, fakeExpenseResponse[0].id, fakeExpenseResponse[0]);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }

      expect(prismaService.expense.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('remove', () => {
    it(`should remove a expense`, async () => {
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(fakeDecimalExpense);

      const response = await service.remove(fakePayloadResponse.id, fakeExpenseResponse[0].id);

      expect(response).toEqual(fakeExpenseResponse[0]);
      expect(prismaService.expense.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.expense.delete).toHaveBeenCalledWith({
        where: {id: fakeExpenseResponse[0].id, userId: fakePayloadResponse.id}
      });
      expect(prismaService.expense.findUnique).toHaveBeenCalledTimes(1);
    });

    it(`should return NotFoundException when user tries to remove expense for another`, async () => {
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(undefined);

      try {
        await service.remove(fakePayloadResponse.id, fakeExpenseResponse[0].id);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }

      expect(prismaService.expense.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('getDataAndSendMail', () => {
    it(`should get expense data and send email`, async () => {
      const response = await service.getDataAndSendMail(fakePayloadResponse.id);

      expect(response).toBeUndefined();
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.findOne).toHaveBeenCalledWith(fakePayloadResponse.id);
      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendEmail).toHaveBeenCalledWith(fakePayloadResponse.email, "Despesa cadastrada com sucesso!");
    });
  });
});
