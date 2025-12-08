import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

//service responsável pela lógica do carrinho de compras
@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  //busca carrinho do usuário ou cria se não existir
  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    //cria carrinho vazio se usuário não tiver um
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  //adiciona produto ao carrinho ou incrementa quantidade se já existir
  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);

    const existingItem = cart.items.find((item) => item.productId === productId);

    //se produto já está no carrinho, incrementa quantidade
    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      //caso contrário, cria novo item no carrinho
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  //remove item específico do carrinho
  async removeFromCart(userId: string, cartItemId: string) {
    //verifica se item pertence ao usuário
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === cartItemId);
    if (!item) throw new Error('Item not found in cart');

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  //remove todos os itens do carrinho
  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
