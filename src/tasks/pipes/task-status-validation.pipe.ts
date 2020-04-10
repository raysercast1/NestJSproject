import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';

/*Pipes must implement the Pipe transform interface*/
export class TaskStatusValidationPipe implements PipeTransform {
        
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    
    //This interface define that there should be a transfer method in the class. 
    //Defining a class property       
    /*This method would be call by NestJS and handle the validation */
    //Here we define two parameters. The value and the meta-data but in this case we don't need the meta-data
    transform(value: any) {
        
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status`);
        }
        
        return value;
    }

    private isStatusValid(status: any) : boolean {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    };
}

//Wire it up this pipes to the controller. 