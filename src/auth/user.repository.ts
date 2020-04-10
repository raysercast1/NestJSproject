import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    /*This repo is interacting with the user table in the DB */
    async signUp(authCredentialsDto:AuthCredentialsDto):Promise<void>{
        const {username, password} = authCredentialsDto;
        const user = new User();
        
        /*Before creating the user and storing the password 
        I going to generate a unique salts per user */
        const salt = await bcrypt.genSalt(); //it take time to hash
        

        // const exists = this.findOne({username});
        // if(exists){
        //     //throw error
        // }

        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password,user.salt);//We need to store the password and also the salts in the DB in the user record
        console.log(user.password);
       try{

        await user.save();

       } catch(error) {
            if(error.code === '23505'){
                throw new ConflictException('User already exist')
            } else{
                throw new InternalServerErrorException('Something went wrong');
            }          
       };
    };

    async validateUserPassword(authCrentialDto:AuthCredentialsDto):Promise<string> {
        const {username, password} = authCrentialDto;
        const user = await this.findOne({ username })//retrieve the user base on the username
        //this.findOne() is refering to the user because of extends Repository<User>

        /*Now we want to validate the password */
        if(user && await user.validatePassword(password)){
            return user.username;
        }else {
            return null;
        };

    };
    private async hashPassword(password:string, salt:string):Promise<string> {
        return bcrypt.hash(password,salt);
    };
};