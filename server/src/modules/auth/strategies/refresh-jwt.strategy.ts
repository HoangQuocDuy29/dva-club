import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserContext } from '../interfaces/user-context.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'volleyball-secret-key'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserContext> {
    const user = await this.authService.validateJwtUser(payload);
    if (!user) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    return user;
  }
}
