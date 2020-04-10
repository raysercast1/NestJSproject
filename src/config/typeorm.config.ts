import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as config from 'config';
/* This interface tell us the options that we can state when defining the configuration for the BD connection */
const dbConfig = config.get('db');
//Exporting the object containing the configuration with de BD
export const typeOrmConfig: TypeOrmModuleOptions = {
    //connection or BD type
    /*Base on this type typeORm is going to know which driver to use */
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    /*translate to tables in the DB and this are saved files 
    so we should tell typeorm which files these are and they should be an array.*/
    entities:[__dirname + '/../**/*.entity.{js,ts}'], /*current directory then one step back then any folder then any file ending with entity...
    .entity.ts*/
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize

};