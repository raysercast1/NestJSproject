import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksServices:TasksService){}

    // /*This method would never be unless you tell nestjs what kind of request is going to 
    // handle. So to do that you have to decorate this method with @Get() */
    @Get()
    getTask(@Query(ValidationPipe) filterDto:GetTaskFilterDto, @GetUser() user:User):Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksServices.getTask(filterDto,user);

    };
    // @Get()
    // /*Now nestjs knows when there's a get request incoming to the tasks spot handled by this
    // controller. The getAllTasks method is going to handle this request. */
    // /*Handler */
    // // getAllTasks():Task[] {
    // //     /*nestjs get the results and do the magic to transform this results to a proper
    // //     http response going back to the client. */
    // //    return this.tasksServices.getAllTasks();
    // // };
    // /*The validation pipe must be provide as an arg to the @Query() decorator */
    // getTasks(@Query(ValidationPipe) filterDto:GetTaskFilterDto):Task[] {
    //     /*nestjs get the results and do the magic to transform this results to a proper
    //     http response going back to the client. */  

    //     /*Checking if the query parameters are empty */
    //     if (Object.keys(filterDto).length){
    //         return this.tasksServices.getTaskWithFilter(filterDto);
    //     } else {
    //         return this.tasksServices.getAllTasks();
    //     };
    // };

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id:number, @GetUser() user:User): Promise<Task> {
        return this.tasksServices.getTaskById(id,user);
    };

    // /*Decorator */
    // @Get('/:id')/*The id exist in the url so we have to define within the decorator */

    // /*Handler */ //Handle incoming get request to task/id 
    // /*To extract the param and have it available within the method when is executed use @param() decorator */
    // getTaskById(@Param('id') id:string):Task {
    //     /*with the 'id' within the decorator NestJs knows that we're expecting an url parameter that is named 'id'
    //     corresponding to the 'id' in the @Get('/:id') decorator */
    //     return this.tasksServices.getTaskById(id);
    // };

    // //Add decorator that means any post request coming to /task...
    // //...would be handle for this handler.
    
    // /*Retrieve the entire request body with nest @Body decorator */
    // // @Post()
    // // createTask(@Body() body){
    // //     console.log('body',body);
    // // };


    // /*The different is that within each decoration you can specify the exact key in the request body
    // that you want to extract */
    // // @Post()
    // // createTask(@Body('title') title:string,@Body('description') description:string):Task {
    // //     return this.tasksServices.createTask(title,description);
    // // };

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto:CreateTaskDto, @GetUser() user:User): Promise<Task> {
        this.logger.verbose(`User "${user.username} creating new task. Data:${JSON.stringify(createTaskDto)}"`)
        return this.tasksServices.createTask(createTaskDto,user);
    };


    // /*Lets use a DTO instead */
    // @Post()
    // //Pre-fix the arg with @Body() decorator
    // /*This params is going to contain all the req body and we expected to be of SHAPE
    //  CreateTaskDto*/
    //  /*Handler */
    //  /*Decorating a handler with a pipes @UsePipes() */
    //  @UsePipes(ValidationPipe) /*Specify what pipe to use. This pipe is going to take the entire req body which is
    //  using de DTO and validates the data against that DTO */
    // createTask(@Body() createTaskDto:CreateTaskDto):Task {
    //     return this.tasksServices.createTask(createTaskDto);
    // };
    @Patch(':id/status')
    updateTask(
        @Param('id', ParseIntPipe) id:number,
        @Body('status', TaskStatusValidationPipe) status:TaskStatus,
        @GetUser() user:User):Promise<Task> {
        
        return this.tasksServices.updateTask(id,status,user);
    };
    // // @Patch('/:id')
    // // /*Handler */
    // // updateTask(@Param('id') id:string, @Body('status') status:string):Task {
    // //     return this.tasksServices.updateTask(id,status);
    // // };
    // @Patch('/:id/status')
    // /*Handler */
    // /*To apply the pipes specifically to the status parameter. We can provide a second arg to the @Body() decorator
    // This also work for url parameters and query parameters. */
    // updateTask(@Param('id') id:string, @Body('status', TaskStatusValidationPipe) status:TaskStatus):Task {
    //     //NestJS would create a new instance of the class TaskStatusValidationPipe behind the scene
    //     return this.tasksServices.updateTask(id,status);
    // };

    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id:number, @GetUser() user:User): Promise<void>{
        
        return this.tasksServices.deleteTask(id,user);
    };

    // // @Delete('/:id')
    // // /*Handler */
    // // deleteTask(@Param('id') id:string):Task {
    // //     return this.tasksServices.deleteTask(id);
    // // };
    // @Delete('/:id')
    // /*Handler */
    // deleteTask(@Param('id') id:string):void {
    //      this.tasksServices.deleteTask(id);
    // };

    

}
