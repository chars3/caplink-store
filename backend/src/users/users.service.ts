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
    //verifica se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      //se usuário existe mas está desativado (só SELLER), reativa a conta
      if (!existingUser.isActive && existingUser.role === 'SELLER') {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: createUserDto.name,
            password: hashedPassword,
            role: createUserDto.role,
            isActive: true,
          },
        });
      }
      //se usuário está ativo, retorna erro
      throw new Error('Email já cadastrado');
    }

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

  //remove usuário (hard delete para CLIENT, soft delete para SELLER)
  async remove(id: string) {
    //busca usuário para verificar role
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.role === 'SELLER') {
      //vendedor: soft delete (preserva produtos e histórico de vendas)
      return this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      //cliente: hard delete (remove tudo)
      //primeiro remove dados relacionados
      await this.prisma.favorite.deleteMany({ where: { userId: id } });
      await this.prisma.cartItem.deleteMany({
        where: { cart: { userId: id } }
      });
      await this.prisma.cart.deleteMany({ where: { userId: id } });

      //depois remove o usuário
      return this.prisma.user.delete({
        where: { id },
      });
    }
  }
}
