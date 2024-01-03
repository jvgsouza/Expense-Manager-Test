import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';

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

const fakeUserList = [
  {
    id: 1,
    email: "joaovsgodoi@gmail.com",
    password: "$2b$08$.4R3so7FhR1JlxD4BAhUL.VVgKS4t3MII0sH40R9D4eALE/eppwq."
  }
];

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeCreateUserResponse[0]),
    findUnique: jest.fn().mockResolvedValue(fakeUserList[0])
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it(`should create a new user`, async () => {
      const response = await service.create(fakeCreateUser[0]);

      expect(response).toEqual(fakeCreateUserResponse[0]);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: fakeCreateUser[0],
      });
    });
  });

  describe('findOne', () => {
    it(`should return a single user`, async () => {
      const result = await service.findOne(fakeUserList[0].id);

      expect(result).toEqual(fakeUserList[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: fakeUserList[0].id },
      });
    });

    it(`should return nothing when user is not found`, async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

      const result = await service.findOne(99);

      expect(result).toBeUndefined();
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 99 },
      });
    });
  });

  describe('findByEmail', () => {
    it(`should return a single user by email`, async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUserList[0]);

      const result = await service.findByEmail(fakeUserList[0].email);

      expect(result).toEqual(fakeUserList[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: fakeUserList[0].email },
      });
    });

    it(`should return nothing when user by email is not found`, async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

      const result = await service.findByEmail(fakeUserList[0].email);

      expect(result).toBeUndefined();
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: fakeUserList[0].email },
      });
    });
  });
});
