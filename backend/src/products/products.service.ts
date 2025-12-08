import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import csv from 'csv-parser';
import { Readable } from 'stream';

//service responsável pela lógica de produtos
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  //cria novo produto vinculado ao vendedor
  create(createProductDto: CreateProductDto, sellerId: string) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: parseFloat(createProductDto.price.toString()), //garante que preço seja float
        imageUrl: createProductDto.imageUrl,
        seller: { connect: { id: sellerId } },
      },
    });
  }

  //busca produtos com paginação, filtros e busca
  async findAll(params: { skip?: number; take?: number; search?: string; sellerId?: string }) {
    const { skip, take, search, sellerId } = params;
    //monta filtros de busca
    const where = {
      AND: [
        sellerId ? { sellerId } : {},
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } }, //busca case-insensitive no nome
            { description: { contains: search, mode: 'insensitive' as const } }, //busca case-insensitive na descrição
          ],
        } : {},
        { seller: { isActive: true } }, //mostra apenas produtos de vendedores ativos
      ],
    };

    //executa busca e contagem em transação para consistência
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        include: { seller: { select: { name: true } } }, //inclui nome do vendedor
        orderBy: { published: 'desc' }, //ordena por data de publicação
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  //busca produto por id incluindo dados do vendedor
  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { seller: { select: { name: true } } },
    });
  }

  //atualiza produto existente
  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        price: updateProductDto.price ? parseFloat(updateProductDto.price.toString()) : undefined,
      },
    });
  }

  //remove produto permanentemente
  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  //importa produtos em lote via arquivo csv
  async uploadCsv(sellerId: string, buffer: Buffer) {
    const BATCH_SIZE = 1000;
    const batch: any[] = [];
    const stream = Readable.from(buffer).pipe(csv());
    let totalProcessed = 0;

    //processa csv em lotes para melhor performance
    for await (const data of stream) {
      batch.push({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        sellerId,
      });

      //insere lote quando atinge o tamanho máximo
      if (batch.length >= BATCH_SIZE) {
        await this.prisma.product.createMany({ data: batch });
        totalProcessed += batch.length;
        batch.length = 0; //limpa array mantendo referência
      }
    }

    //insere itens restantes
    if (batch.length > 0) {
      await this.prisma.product.createMany({ data: batch });
      totalProcessed += batch.length;
    }

    return { message: `${totalProcessed} products imported successfully` };
  }
}
