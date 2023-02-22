import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONNECTION_NAME } from './database/constants/database.constant';
import { DatabaseOptionsModule } from './database/database.options.module';
import { DatabaseOptionsService } from './database/services/database.options.service';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DATABASE_CONNECTION_NAME,
      inject: [DatabaseOptionsService],
      imports: [DatabaseOptionsModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    ConfigModule.forRoot(), //TODO set config file for ConfigModule

    // TypeOrmModule.forRoot({
    //   //TODO create constant file for this section
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'task-manager',
    //   // entities: [],
    //   synchronize: true, //TODO read this from process file to be false in the production
    // }),

    PaginationModule,
  ],
  providers: [],
  controllers: [],
})
export class CommonModule {}
