import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthService],
})
export class AuthModule {}
