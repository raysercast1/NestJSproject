import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from './user.entity';

/*The arrow function contains two parameter data which contain data provided to the decorator.
and req which contain the request object */
export const GetUser = createParamDecorator((data,ctx:ExecutionContext): User => {
    /*Whatever we return from this function is going to be set to the parameter
    that is decorated with this decorator */
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});