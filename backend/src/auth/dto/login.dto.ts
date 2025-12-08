import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

//dto para login de usuário
export class LoginDto {
  //email do usuário (deve ser válido)
  @IsEmail({}, { message: 'email inválido' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  //senha do usuário
  @IsString({ message: 'senha deve ser uma string' })
  @IsNotEmpty({ message: 'senha é obrigatória' })
  password: string;
}
