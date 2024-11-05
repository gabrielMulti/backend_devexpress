import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './auth.constants';
import { UserRepository } from 'src/app/repositories/user.repository';
import { DataBaseService } from 'src/infra/database/typeorm/typeorm.service';
import { ScreensRepository } from 'src/app/repositories/screens.repository';
import { ErrorException } from 'src/exceptions/error-exception';
import { CacheModule } from '@nestjs/cache-manager';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn:  jwtConstants.expiresIn },
    }),
    CacheModule.register({ ttl: 0 })
  ],
  providers: [AuthService, UserRepository,DataBaseService, ScreensRepository, ErrorException],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}