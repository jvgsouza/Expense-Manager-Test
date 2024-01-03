import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './services/expenses.service';
import { AuthService } from '../auth/services/auth.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateUserResponseDto } from '../users/dto/create-user-response.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

const fakeExpenseResponse = [
  {
    id: 1,
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 2
  },
  {
    id: 1,
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 2
  }
];

const fakeCreateExpense = [
  {
    description: "Testes",
    date: new Date(),
    value: 100,
    userId: 2
  } as CreateExpenseDto
];

const fakePayloadResponse = {
  id: 1,
  email: "joaovsgodoi@gmail.com"
} as CreateUserResponseDto;

const mockRequest = {
  headers: {
    authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp2c2dzb3V6YUBnbWFpbC5jb20iLCJpZCI"
  }
} as Request;

const expensesServiceMock = {
  create: jest.fn().mockReturnValue(fakeExpenseResponse[0]),
  findAll: jest.fn().mockResolvedValue(fakeExpenseResponse),
  findOne: jest.fn().mockResolvedValue(fakeExpenseResponse[0]),
  update: jest.fn().mockResolvedValue(fakeExpenseResponse[0]),
  remove: jest.fn().mockReturnValue(fakeExpenseResponse[0]),
};

const authServiceMock = {
  getTokenData: jest.fn().mockReturnValue(fakePayloadResponse),
};

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let expensesService: ExpensesService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        JwtService
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get<ExpensesService>(ExpensesService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it(`should create a new expense`, async () => {
      const result = await controller.create(mockRequest, fakeCreateExpense[0]);

      expect(result).toEqual(fakeExpenseResponse[0]);
      expect(expensesService.create).toHaveBeenCalledTimes(1);
      expect(expensesService.create).toHaveBeenCalledWith(fakePayloadResponse.id, fakeCreateExpense[0]);
      expect(authService.getTokenData).toHaveBeenCalledTimes(1);
      expect(authService.getTokenData).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('findAll', () => {
    it(`should return expense list`, async () => {
      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(fakeExpenseResponse);
      expect(expensesService.findAll).toHaveBeenCalledTimes(1);
      expect(expensesService.findAll).toHaveBeenCalledWith(fakePayloadResponse.id);
      expect(authService.getTokenData).toHaveBeenCalledTimes(1);
      expect(authService.getTokenData).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('findOne', () => {
    it(`should return just one expense`, async () => {
      const result = await controller.findOne(mockRequest, String(fakeExpenseResponse[0].id));

      expect(result).toEqual(fakeExpenseResponse[0]);
      expect(expensesService.findOne).toHaveBeenCalledTimes(1);
      expect(expensesService.findOne).toHaveBeenCalledWith(fakePayloadResponse.id, fakeExpenseResponse[0].id);
      expect(authService.getTokenData).toHaveBeenCalledTimes(1);
      expect(authService.getTokenData).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('update', () => {
    it(`should update expense`, async () => {
      const result = await controller.update(mockRequest, String(fakeExpenseResponse[0].id), fakeCreateExpense[0]);

      expect(result).toEqual(fakeExpenseResponse[0]);
      expect(expensesService.update).toHaveBeenCalledTimes(1);
      expect(expensesService.update).toHaveBeenCalledWith(fakePayloadResponse.id, fakeExpenseResponse[0].id, fakeCreateExpense[0]);
      expect(authService.getTokenData).toHaveBeenCalledTimes(1);
      expect(authService.getTokenData).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('remove', () => {
    it(`should remove expense`, async () => {
      const result = await controller.remove(mockRequest, String(fakeExpenseResponse[0].id));

      expect(result).toEqual(fakeExpenseResponse[0]);
      expect(expensesService.remove).toHaveBeenCalledTimes(1);
      expect(expensesService.remove).toHaveBeenCalledWith(fakePayloadResponse.id, fakeExpenseResponse[0].id);
      expect(authService.getTokenData).toHaveBeenCalledTimes(1);
      expect(authService.getTokenData).toHaveBeenCalledWith(mockRequest);
    });
  });
});
