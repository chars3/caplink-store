import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '@nestjs/passport';

//controller responsável pelo carrinho de compras
@Controller('cart')
@UseGuards(AuthGuard('jwt')) //todos os endpoints requerem autenticação
export class CartController {
  constructor(private readonly cartService: CartService) { }

  //retorna carrinho do usuário autenticado
  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  //adiciona item ao carrinho
  @Post()
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, addToCartDto.productId, addToCartDto.quantity);
  }

  //remove item do carrinho
  @Delete(':itemId')
  removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user.userId, itemId);
  }
}
