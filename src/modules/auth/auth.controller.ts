import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignInDto } from './dto/sign-In-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
