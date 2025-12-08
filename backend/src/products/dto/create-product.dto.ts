import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUrl } from 'class-validator';

//dto para criação de produto
export class CreateProductDto {
  //nome do produto
  @IsString({ message: 'nome deve ser uma string' })
  @IsNotEmpty({ message: 'nome é obrigatório' })
  name: string;

  //descrição detalhada do produto
  @IsString({ message: 'descrição deve ser uma string' })
  @IsNotEmpty({ message: 'descrição é obrigatória' })
  description: string;

  //preço do produto (deve ser positivo)
  @IsNumber({}, { message: 'preço deve ser um número' })
  @IsPositive({ message: 'preço deve ser positivo' })
  price: number;

  //url da imagem do produto
  @IsString({ message: 'imageUrl deve ser uma string' })
  @IsUrl({}, { message: 'imageUrl deve ser uma url válida' })
  @IsNotEmpty({ message: 'imageUrl é obrigatória' })
  imageUrl: string;

  //nota: sellerId é extraído do token jwt no controller, não deve ser enviado pelo cliente
}
