import { IsNotEmpty, IsUUID } from 'class-validator';

//dto para adicionar produto aos favoritos
export class AddFavoriteDto {
  //id do produto (deve ser uuid válido)
  @IsNotEmpty({ message: 'productId é obrigatório' })
  @IsUUID('4', { message: 'productId deve ser um uuid válido' })
  productId: string;
}
