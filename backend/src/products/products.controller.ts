import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

//controller responsável pelos endpoints de produtos
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //cria novo produto (requer autenticação)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    //extrai sellerId do token jwt para segurança
    const sellerId = req.user.userId;
    return this.productsService.create(createProductDto, sellerId);
  }

  //lista produtos com paginação e filtros
  @Get()
  findAll(@Query() query: QueryProductDto) {
    //calcula skip baseado na página e limit
    return this.productsService.findAll({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      search: query.search,
      sellerId: query.sellerId,
    });
  }

  //busca produto por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  //atualiza produto (requer autenticação)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  //remove produto (requer autenticação)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  //upload de produtos via csv (requer autenticação)
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.productsService.uploadCsv(req.user.userId, file.buffer);
  }
}
