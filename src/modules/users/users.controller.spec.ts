import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

const fakeCreateUser = [
  {
    email: "joaovsgodoi@gmail.com",
    password: "123456"
  } as CreateUserDto,
];

const fakeCreateUserResponse = [
  {
    id: 1,
    email: "joaovsgodoi@gmail.com"
  } as CreateUserResponseDto
];

const userServiceMock = {
  create: jest.fn().mockReturnValue(fakeCreateUserResponse[0]),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: userServiceMock }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it(`should create a new user`, async () => {
      const result = await controller.create(fakeCreateUser[0]);

      expect(result).toEqual(fakeCreateUserResponse[0]);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(fakeCreateUser[0]);
    });
  });
});
