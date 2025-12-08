import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

//controller responsável pela autenticação de usuários
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //endpoint para login de usuário
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //valida as credenciais do usuário
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      //retorna erro 401 se credenciais inválidas
      throw new UnauthorizedException('credenciais inválidas');
    }
    //retorna token jwt se credenciais válidas
    return this.authService.login(user);
  }

  //endpoint para registro de novo usuário
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
