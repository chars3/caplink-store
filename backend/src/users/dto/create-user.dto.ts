import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

//enum para roles de usuário
enum UserRole {
  CLIENT = 'CLIENT',
  SELLER = 'SELLER',
}

//dto para criação de usuário
export class CreateUserDto {
  //email do usuário (deve ser válido e único)
  @IsEmail({}, { message: 'email inválido' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  //senha do usuário (mínimo 8 caracteres)
  @IsString({ message: 'senha deve ser uma string' })
  @MinLength(8, { message: 'senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty({ message: 'senha é obrigatória' })
  password: string;

  //nome completo do usuário
  @IsString({ message: 'nome deve ser uma string' })
  @IsNotEmpty({ message: 'nome é obrigatório' })
  name: string;

  //role do usuário (CLIENT ou SELLER), padrão é CLIENT
  @IsOptional()
  @IsEnum(UserRole, { message: 'role deve ser CLIENT ou SELLER' })
  role?: string;
}
