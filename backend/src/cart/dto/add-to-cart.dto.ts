import { IsNotEmpty, IsUUID, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

//dto para adicionar item ao carrinho
export class AddToCartDto {
  //id do produto (deve ser uuid válido)
  @IsNotEmpty({ message: 'productId é obrigatório' })
  @IsUUID('4', { message: 'productId deve ser um uuid válido' })
  productId: string;

  //quantidade do produto (deve ser positiva)
  @Type(() => Number)
  @IsInt({ message: 'quantity deve ser um número inteiro' })
  @IsPositive({ message: 'quantity deve ser positiva' })
  quantity: number;
}
