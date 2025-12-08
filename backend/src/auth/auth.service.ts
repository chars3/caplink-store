import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

//service responsável pela lógica de autenticação
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  //valida email e senha do usuário
  async validateUser(email: string, pass: string): Promise<any> {
    //busca usuário pelo email
    const user = await this.usersService.findByEmail(email);
    //verifica se usuário existe, está ativo e senha está correta
    if (user && user.isActive && (await bcrypt.compare(pass, user.password))) {
      //remove senha do objeto retornado por segurança
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //gera token jwt para usuário autenticado
  async login(user: any) {
    //payload do token contém id, email e role do usuário
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    };
  }

  //registra novo usuário e retorna token jwt
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}
