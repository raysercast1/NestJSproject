import { TaskStatus } from '../task-status.enum';
import {IsOptional, IsIn, IsNotEmpty} from 'class-validator';
/*DTO which represent the shape of the  data we expect after it's parse into an object */
export class GetTaskFilterDto {
    /*We need to think about the first point where we retrieve our data that which is the handler in the 
    controller file. The kind of data we expect is the status and search.*/
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status:TaskStatus;
    
    @IsOptional()
    @IsNotEmpty()
    search:string;
    /*So now apply the DTO to the controller */
};