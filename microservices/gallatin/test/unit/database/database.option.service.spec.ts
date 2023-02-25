import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseOptionsModule } from 'src/common/database/database.options.module';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.service';

describe('DatabaseOptionServiceUnitTest', () => {
  let databaseOptionService: DatabaseOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          envFilePath: ['.env'],
          expandVariables: true,
        }),
        DatabaseOptionsModule,
      ],
    }).compile();

    databaseOptionService = module.get<DatabaseOptionsService>(
      DatabaseOptionsService,
    );
  });

  it('should be defined', () => {
    expect(databaseOptionService).toBeDefined();
  });

  it('should return typeOrmOptions', () => {
    const res: TypeOrmModuleOptions = databaseOptionService.createOptions();

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
  });
});
