import { Injectable } from '@nestjs/common';

//service raiz da aplicação
@Injectable()
export class AppService {
  //retorna mensagem de boas-vindas
  getHello(): string {
    return 'Hello World!';
  }
}
