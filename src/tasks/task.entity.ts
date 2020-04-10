import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

//Entity definition to the DB
@Entity()
export class Task extends BaseEntity {
    //It tells that this is a primary key and the id should be automatic generated and incremented in every new task
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status:TaskStatus;

    @ManyToOne(type=>User, user => user.tasks, {eager:false})
    user:User;

    @Column()
    userId:number;
};