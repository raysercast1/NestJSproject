import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    /*Properties I expect to get from the client */
    /*We're going to decorate this properties using class validator package. 
    This Decorator we can use from typescript which in runtime do some magic to our class,
    and then this can be use by the NestJS validation pipes and validate the values again
    those validation rules */
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password:string;
};
/*To test the validator we need to apply the ValidationPipe to our DTO. Our entire request body */