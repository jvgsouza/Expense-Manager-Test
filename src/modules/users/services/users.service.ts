import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    const userResponse = new CreateUserResponseDto();
    userResponse.id = user.id;
    userResponse.email = user.email;

    return userResponse;
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
