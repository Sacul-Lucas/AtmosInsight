import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: User) {
    const payload = { sub: user._id.toString(), email: user.email, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
