import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

//service responsável pela lógica de usuários
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  //cria novo usuário com senha hasheada
  async create(createUserDto: CreateUserDto) {
    //gera hash da senha com salt de 10 rounds
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  //retorna todos os usuários
  findAll() {
    return this.prisma.user.findMany();
  }

  //busca usuário por id
  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  //busca usuário por email (usado na autenticação)
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  //atualiza dados do usuário
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  //desativa usuário (soft delete)
  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
