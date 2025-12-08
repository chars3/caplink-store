import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

//dto para atualização de produto (todos os campos são opcionais)
export class UpdateProductDto extends PartialType(CreateProductDto) { }
