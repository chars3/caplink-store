import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

//controller responsável pelos favoritos
@Controller('favorites')
@UseGuards(AuthGuard('jwt')) //todos os endpoints requerem autenticação
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  //adiciona ou remove produto dos favoritos
  @Post(':productId')
  toggle(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.toggleFavorite(req.user.userId, productId);
  }

  //lista todos os favoritos do usuário
  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.userId);
  }
}
