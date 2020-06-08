import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);
    const payload: JwtPayload = { username };
    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    return { token };
  }
}
