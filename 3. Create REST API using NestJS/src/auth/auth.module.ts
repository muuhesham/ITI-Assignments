import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=> ({
        secret:config.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:'1d'}
      })
    }),
  ],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
