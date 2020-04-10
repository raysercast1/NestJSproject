import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

/*Because we imported the jwt module here that is provided by NestJS this module export a services (provider) and 
that is call jwtServices. That means that can be injected using dependency injection in auth.services.ts */
@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),/*Provide it with a default strategy that I'm going to use passport with.
    Now It's configure to take jwt tokens and use it to authenticating the user*/
    //importing JwtModule and calling it with .register() and providing some configurations. The way im going to use this
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,/*Defining the secret which with I'm going to sign the payload from JWT that I generate*/
      signOptions:{/*I want to override secret using environment variables when deploy to production */
        expiresIn: jwtConfig.expiresIn,
      }
    }),
      TypeOrmModule.forFeature([UserRepository])],//UserRepository is ready to be injected throughtout modules
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[JwtStrategy,PassportModule]//Exporting so that it can be use in others modules of the app from this module.  
})
export class AuthModule {}
