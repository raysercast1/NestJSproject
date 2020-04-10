import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { stat } from 'fs';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
@Injectable()
export class TasksService {
/*Inject the task repository to our service */
constructor(
    @InjectRepository(TaskRepository) //Decorate this parameter and provide it with the repo that we want to inject
    private taskRepository:TaskRepository //The keyword private become this to a "class member"
){};
    // //Storing tasks in memory for now.
    // //The array tasks is going to be a property of this class. 
    
    // //If it isn't private that means that any other component from the outside that inject this services...
    // //can make changes to this array.
    // //It's the services's responsability to make any manipulation to tasks array.

    async getTask(filterDto:GetTaskFilterDto, user:User):Promise<Task[]>{
        return await this.taskRepository.getTask(filterDto,user);
    };

    // /*The controller need to have access to the tasks array so we expose a methond within the class
    // so that it returns from within this tasks array */
    // /*Method */
    // getAllTasks():Task[] {
    //     return this.tasks;
    // };

    // /*Method */
    // getTaskWithFilter(filterDto:GetTaskFilterDto):Task[]{
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();

    //     if(status){tasks = tasks.filter(task => task.status === status);};
    //     if(search){
    //         tasks = tasks.filter(task=> task.title.includes(search) || task.description.includes(search));
    //     };

    //     return tasks;
    // };
    // //Remember that methods within the class can acceses to privates properties.

    // // createTask(title:string, description:string):Task {
    // //     //Creation of a new object
    // //     const task:Task = {
    // //         id:uuid(),
    // //         title,
    // //         description,
    // //         status:TaskStatus.OPEN
    // //     };

    // //     this.tasks.push(task);
    // //     return task;
    // // };


    async getTaskById(id: number,user:User): Promise<Task>{
        const found = await this.taskRepository.findOne({where:{id, userId: user.id}});

        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found`);
        };
        return found;

    };

    // // /*Method */
    // // getTaskById(id:string):Task {
    // //     return this.tasks.find(task=> task.id ===id);
    // // };

    // /*Method with validation */
    // getTaskById(id:string):Task {
    //     const found = this.tasks.find(task=> task.id ===id);

    //     if(!found){
    //         /*NestJS  provides us with a set of exceptions to be use that represent different http error code */
    //         throw new NotFoundException(`Task with ID ${id} not found`); //We can custom the message within the NotFoundException('...')
    //         /*This exception is not caught within this scope of this method because we're not using try - catch. 
    //          So it escalate one step higher to the controller and even higher than that. NestJS do it behind the 
    //          scene */
    //     }
    //     return found;
    // };

    createTask(createTaskDto:CreateTaskDto, user:User): Promise<Task>{
        return  this.taskRepository.createTask(createTaskDto,user);
    };

    // /*Using DTO instead */
    // /*Method */
    // createTask(createTaskDto:CreateTaskDto):Task {
    //     const {title, description} = createTaskDto;
    //     //Creation of a new object
    //     const task:Task = {
    //         id:uuid(),
    //         title,
    //         description,
    //         status:TaskStatus.OPEN
    //     };

    //     this.tasks.push(task);
    //     return task;
    // };
    async updateTask(id:number, status:TaskStatus, user:User):Promise<Task> {
        const task = await this.getTaskById(id,user);
        
        task.status = status;
        await task.save();
        return task;
    };
    

    // /*Method */
    // // updateTask(id:string, status:string):Task {
        
    // //     const idToUpdate = this.tasks.find(task=> task.id === id);
    // //     const idx = this.tasks.indexOf(idToUpdate);
    // //     status === 'IN_PROGRESS' ? this.tasks[idx].status = TaskStatus.IN_PROGRESS : status === 'DONE' ? this.tasks[idx].status = TaskStatus.DONE : false
    // //     return this.tasks[idx]
    // // };
    // updateTask(id:string, status:TaskStatus):Task {
    //     /*We create a custum pipe so we can constrain the status to be PATCH */
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
        
    // };

    async deleteTask(id:number,user:User): Promise<void>{        

        const deletedTask = await this.taskRepository.delete({id,userId: user.id})

        if(!deletedTask.affected){
            throw new NotFoundException(`ID ${id} not found`)
        }
            
         
    };

    // /*Method */
    // // deleteTask(id:string):Task {
    // //     const idToDelete = this.tasks.find(task=> task.id === id);        
    // //     const idx = this.tasks.indexOf(idToDelete)
    // //     this.tasks.splice(idx,1);
        
    // //     return idToDelete;
    // // };
    // deleteTask(id:string):void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // };
}
