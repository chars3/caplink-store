import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //cria a aplicação nest
  const app = await NestFactory.create(AppModule);

  //habilita cors para permitir requisições do frontend
  app.enableCors();

  //configura validação global de dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remove propriedades não definidas nos dtos
      forbidNonWhitelisted: true, //retorna erro se propriedades extras forem enviadas
      transform: true, //transforma payloads em instâncias de dto
      transformOptions: {
        enableImplicitConversion: true, //converte tipos automaticamente (ex: string para number)
      },
    }),
  );

  //inicia o servidor na porta configurada (Cloud Run usa PORT env var)
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
