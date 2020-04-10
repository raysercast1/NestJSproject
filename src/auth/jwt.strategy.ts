import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload1.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(UserRepository) private userRepository:UserRepository){
        //super call the constructor of the base class that we're extending from
        super({
            /*And also accept configuration objects on how Strategy is going to work with passport-js */
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),/*This configures the strategy to retrieve
            the jwtToken from the headers of the request as a bearer token */ 

            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret') /*This is that secret that password is going to use to verify the signature
            of the  token that is extracted from the request */
        });
    };

    /*Defining a method that must exits for every strategy */
    async validate(payload:JwtPayload):Promise<User>{/*It takes a payload that's already verified a this point */
        //Here we're going to do some validation and whatever we return from here is going to be
        //injected into any operation relate with authentication. 
        const {username} = payload;
        const user = await this.userRepository.findOne({username})
        /*To use the user.repository which is in the same module we're going to use dependency injection
        to inject it in the constructor of this class */

        if(!user){
            throw new UnauthorizedException();
        };

        return user;
    };


};