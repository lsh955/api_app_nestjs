import * as jwt from 'jsonwebtoken';
import {Inject, Injectable} from '@nestjs/common';
import authConfig from '../config/authConfig';
import {ConfigType} from '@nestjs/config';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload = {...user};

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      // 토큰이 유효한 것인지 확인
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (jwt.JwtPayload | string) & User;

      const {id, email} = payload;

      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
