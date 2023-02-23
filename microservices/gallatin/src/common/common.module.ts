import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONNECTION_NAME } from './database/constants/database.constant';
import { DatabaseOptionsModule } from './database/database.options.module';
import { DatabaseOptionsService } from './database/services/database.options.service';
import { PaginationModule } from './pagination/pagination.module';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        registerAs('database', () => ({
          host: process.env?.DATABASE_HOST ?? 'localhost',
          port: process.env?.DATABASE_PORT ?? '5432',
          name: process.env?.DATABASE_NAME ?? 'task-manager',
          user: process.env?.DATABASE_USER ?? 'postgres',
          password: process?.env.DATABASE_PASSWORD,
          debug: process.env.DATABASE_DEBUG === 'true',
          options: process.env?.DATABASE_OPTIONS,
        })),
      ],
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid('production', 'development')
          .default('development')
          .required(),

        DATABASE_HOST: Joi.string()
          .default('postgresql://localhost:5432')
          .required(),
        DATABASE_NAME: Joi.string().default('task-manager').required(),
        DATABASE_USER: Joi.string().default('postgres').required(),
        DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
        DATABASE_DEBUG: Joi.boolean().default(false).required(),
        DATABASE_OPTIONS: Joi.string().allow(null, '').optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      name: DATABASE_CONNECTION_NAME,
      inject: [DatabaseOptionsService],
      imports: [DatabaseOptionsModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) => {
        console.log(databaseOptionsService.createOptions());
        return databaseOptionsService.createOptions();
      },
    }),
    PaginationModule,
  ],
  providers: [],
  controllers: [],
})
export class CommonModule {}
