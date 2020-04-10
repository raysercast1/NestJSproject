import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from '../auth/jwt-payload1.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)/*To make this injected repository we need the decorator and add the repo I want to
        inject */
        private userRepository:UserRepository, /*Injecting UserRepository when the server is initialize. 
        private parameters makes userRepository a class member that we can reference with this.userRepository. */
        private jwtService:JwtService /*definig another parameter */
    ){};

    async signUp(authCredentialsDto:AuthCredentialsDto):Promise<void> {
          return this.userRepository.signUp(authCredentialsDto);

    };

    async signIn(authCrentialsDto:AuthCredentialsDto):Promise<{accessToken:string}> {
        const username = await this.userRepository.validateUserPassword(authCrentialsDto);
        
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }

        //After doing the validation whether is valid or not. 
        
        //Now create a payload with jwt token
        // const payload = {username};

        /*It is better to extract the payload structure into an interface cuz it would be use in more places
        around the application */
        const payload:JwtPayload = {username};
        
        //generate the token
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);

        return {accessToken};

    };

    
}
