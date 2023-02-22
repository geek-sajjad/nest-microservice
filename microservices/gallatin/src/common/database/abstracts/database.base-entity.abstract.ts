import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from '../constants/database.constant';

export abstract class DatabaseBaseEntityAbstract {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @CreateDateColumn({
    name: DATABASE_CREATED_AT_FIELD_NAME,
    type: Date,
  })
  [DATABASE_CREATED_AT_FIELD_NAME]: Date;

  @UpdateDateColumn({
    name: DATABASE_UPDATED_AT_FIELD_NAME,
    type: Date,
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]: Date;

  @DeleteDateColumn({
    nullable: true,
    name: DATABASE_DELETED_AT_FIELD_NAME,
    type: Date,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;
}
