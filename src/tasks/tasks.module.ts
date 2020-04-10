import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  //Importing a module here
  /*This make that the TypeOrmModule that comes from NestJS includes the TaskRepository instance
  injecteble in dependency injection throught out this module. Now is ready to consume it in the server */
  //Provide an arrays of entities or repositories that we want to include in the ecosystem of this module
  imports:[TypeOrmModule.forFeature([TaskRepository]),
AuthModule],//Anything that AuthModule exports is available in the task module
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
