import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

//estratégia de autenticação jwt usando passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extrai token do header authorization
      ignoreExpiration: false, //valida expiração do token
      secretOrKey: process.env.JWT_SECRET || 'secretKey', //chave secreta para validar token
    });
  }

  //valida payload do token e retorna dados do usuário
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
