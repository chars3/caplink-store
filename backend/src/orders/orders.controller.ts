import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';

//controller responsável pelos pedidos
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  //realiza checkout do carrinho do usuário
  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  checkout(@Request() req) {
    return this.ordersService.checkout(req.user.userId);
  }

  //retorna estatísticas do dashboard do vendedor
  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard')
  getDashboardStats(@Request() req) {
    return this.ordersService.getSellerStats(req.user.userId);
  }

  //retorna vendas do vendedor com paginação
  @UseGuards(AuthGuard('jwt'))
  @Get('seller/sales')
  getSellerSales(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    return this.ordersService.getSellerSales(req.user.userId, {
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      search,
    });
  }

  //lista pedidos do usuário com paginação
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    return this.ordersService.findAll(req.user.userId, {
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }

  //busca pedido por id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
