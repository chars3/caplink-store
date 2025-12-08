import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

//dto para query de produtos com paginação
export class QueryProductDto {
  //número da página (padrão: 1)
  @Type(() => Number)
  @IsInt({ message: 'page deve ser um número inteiro' })
  @Min(1, { message: 'page deve ser no mínimo 1' })
  page: number = 1;

  //quantidade de itens por página (padrão: 10)
  @Type(() => Number)
  @IsInt({ message: 'limit deve ser um número inteiro' })
  @Min(1, { message: 'limit deve ser no mínimo 1' })
  limit: number = 10;

  //termo de busca (opcional)
  @IsOptional()
  @IsString({ message: 'search deve ser uma string' })
  search?: string;

  //filtrar por id do vendedor (opcional)
  @IsOptional()
  @IsString({ message: 'sellerId deve ser uma string' })
  sellerId?: string;
}
