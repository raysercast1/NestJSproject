import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
/*Defining a unique column at the DB level. This column cannot have duplicate values*/
/*Specify entities's fields to be unique in array of columns name*/
@Unique(['username'])
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column()
    salt:string;

    //one to many side
    @OneToMany(type => Task, task => task.user, {eager:true})
    tasks:Task[];
 
    /*introducing a custom method for the user entity. And it's use 
    to run some business logic against a specific user or a specific entity instance. 
    We just have to create the method in the entity definition here in the class */

    //Method to validate the password of individual users
    async validatePassword(password:string):Promise<boolean>{
        /*Retrieve the password from the request body and then apply the same hash 
        against the original user's salt, the correct user's salt and then compare the result's
        hash with the actual user password's hash*/
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    };
};