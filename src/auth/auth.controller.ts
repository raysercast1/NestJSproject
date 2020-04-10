import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    
    constructor(private authService:AuthService){}; /*Using dependency injection here to inject it to our controller */
    @Post('/signup')
    /*Validation pipe do the magic and validates DTO against the validation rules we specify */
    signUp(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<void>{
        return this.authService.signUp(authCredentialsDto); /*Now we can use AuthServices here */
    };

    @Post('/signin')
    async signIn(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}> {

        return this.authService.signIn(authCredentialsDto);
    };

    // @Post('/test')
    // /*To apply the guarding into this request we use the decorator
    // Let guards this /test request */
    // @UseGuards(AuthGuard())
    // test(@GetUser() user:User){/*Here I want to retrieve the entire request */
    //     console.log(user);
    // }
};