import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

//service responsável pela lógica de pedidos
@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  //realiza checkout do carrinho criando um pedido
  async checkout(userId: string) {
    //busca carrinho do usuário com itens e produtos
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    //calcula total do pedido
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    //cria pedido com snapshot dos itens e preços
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'COMPLETED',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, //salva preço atual como snapshot
          })),
        },
      },
    });

    //limpa carrinho após checkout
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  //lista pedidos do usuário com paginação
  async findAll(userId: string, params: { skip?: number; take?: number } = {}) {
    const { skip, take } = params;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data, total };
  }

  //busca pedido específico por id
  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  }

  //retorna estatísticas do dashboard do vendedor
  async getSellerStats(sellerId: string) {
    //conta total de produtos cadastrados
    const totalProducts = await this.prisma.product.count({
      where: { sellerId },
    });

    //busca todos os itens vendidos do vendedor
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        product: { sellerId },
      },
      include: { product: true },
    });

    let totalSold = 0;
    let totalRevenue = 0;
    const productSales: Record<string, number> = {};

    //calcula totais e vendas por produto
    for (const item of orderItems) {
      totalSold += item.quantity;
      totalRevenue += item.price * item.quantity; //usa preço do snapshot

      if (!productSales[item.productId]) {
        productSales[item.productId] = 0;
      }
      productSales[item.productId] += item.quantity;
    }

    //identifica produto mais vendido
    let bestSellingProductId: string | null = null;
    let maxSales = 0;
    for (const [productId, sales] of Object.entries(productSales)) {
      if (sales > maxSales) {
        maxSales = sales;
        bestSellingProductId = productId;
      }
    }

    //busca dados do produto mais vendido
    let bestSellingProduct: any = null;
    if (bestSellingProductId) {
      bestSellingProduct = await this.prisma.product.findUnique({
        where: { id: bestSellingProductId },
      });
    }

    return {
      totalProducts,
      totalSold,
      totalRevenue,
      bestSellingProduct,
    };
  }

  //lista vendas do vendedor com paginação e busca
  async getSellerSales(sellerId: string, params: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = params;

    const where = {
      product: {
        sellerId,
        ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.orderItem.findMany({
        where,
        skip,
        take,
        include: {
          product: true,
          order: { select: { createdAt: true } },
        },
        orderBy: { order: { createdAt: 'desc' } },
      }),
      this.prisma.orderItem.count({ where }),
    ]);

    return { data, total };
  }

  //métodos não utilizados mas mantidos por compatibilidade
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
