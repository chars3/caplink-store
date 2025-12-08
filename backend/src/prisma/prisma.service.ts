import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

//service responsável pela conexão com o banco de dados via prisma
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  //conecta ao banco quando o módulo é inicializado
  async onModuleInit() {
    await this.$connect();
  }

  //desconecta do banco quando o módulo é destruído
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
