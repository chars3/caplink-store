import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

//service responsável pela lógica de favoritos
@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) { }

  //adiciona ou remove produto dos favoritos (toggle)
  async toggleFavorite(userId: string, productId: string) {
    //verifica se produto já está nos favoritos
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    //se já existe, remove dos favoritos
    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { message: 'Removed from favorites' };
    } else {
      //caso contrário, adiciona aos favoritos
      try {
        await this.prisma.favorite.create({
          data: {
            userId,
            productId,
          },
        });
        return { message: 'Added to favorites' };
      } catch (error) {
        //trata erro de produto não encontrado
        if (error.code === 'P2003') {
          throw new NotFoundException('Product not found');
        }
        throw error;
      }
    }
  }

  //retorna todos os favoritos do usuário com dados dos produtos
  findAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
  }
}
