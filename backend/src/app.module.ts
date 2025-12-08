import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';

//módulo raiz da aplicação que importa todos os módulos
@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProductsModule, OrdersModule, FavoritesModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
