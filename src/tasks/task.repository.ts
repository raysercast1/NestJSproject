import {Task} from './task.entity';
import { Entity, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Query, Logger, InternalServerErrorException } from '@nestjs/common';
import { User } from '../auth/user.entity';

//This repository is acting as a layer, the persisten layer for anything relate to the table in our database

//This tells typeOrm this reposity is the reposity for Task
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTask(filterDto:GetTaskFilterDto,user:User):Promise<Task[]>{
        const {status, search} = filterDto;
        /*createQueryBuilder is a method of Repository and cuz it's a Repo for the <Task> the query
        will interact with the task table. */
        const query = this.createQueryBuilder('task');/*The arg 'task' is the keyword to use within my queries 
        refering to the Task entity */

        //Matching the id column in the Task DB to the user coming from the request
        query.where('task.userId = :userId',{userId: user.id});

        if(status){
            query.andWhere('task.status = :status', {status});
        };
        if(search){
            /*we wrap the query with parenthesis () cuz we want to evaluate it as ONE condition. If we do it
            without it and it match one of both side it will execute without the other */
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search:`%${search}%`});/*the %% it's 
            cuz it's a partial match cuz we're using LIKE in the query so it allows to be more flexible in the
            matching*/
        };

        try {

            const tasks = await query.getMany();
            return tasks;

        } catch(error) {
            this.logger.error(`Failed to get tasks for user ${user.username}, DTO: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
        

    };

    async createTask(createTaskDto:CreateTaskDto,user:User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
            
        } catch(error) {
            this.logger.error(`Failed to create task for user ${user.username}, DTO:${createTaskDto}`,error.stack);
            throw new InternalServerErrorException();
        }
        
        delete task.user; //delete user property from the task that we are returning back to the caller
        //The entity is already being saved on the DB. It's to ensure that whatever we return doesn't contain
        //the user object

        return task;
    };    

};

/*Now we can make available anywhere in our tasks.module.ts  via dependency injection */