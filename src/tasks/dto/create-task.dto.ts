/*NestJS provides us of validation pipes and it's to validate data against the DTO */
//We have to download class validator packages and class transformer packages   
import {IsNotEmpty} from 'class-validator';

export class CreateTaskDto{
    /*We need to think about the first point where we retrieve our data that which is the handler in the 
    controller file. The kind of data we expect is the title and description.*/
     
    /*This decorator add some rules to each properties of the DTO */
    @IsNotEmpty()
    title:string;

    /*This decorator add some rules to each properties of the DTO */
    @IsNotEmpty()
    description:string;
    /*So now apply the DTO to the controller */
};




