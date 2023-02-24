import { DatabaseBaseEntityAbstract } from 'src/common/database/abstracts/database.base-entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { Column, JoinColumn, OneToOne } from 'typeorm';

export const TaskEntityTableName = 'tasks';
@DatabaseEntity({
  name: TaskEntityTableName,
})
export class TaskEntity extends DatabaseBaseEntityAbstract {
  @Column()
  title: string;

  @Column()
  description: string;

  @JoinColumn({ name: 'parent_id' })
  @OneToOne(() => TaskEntity, { nullable: true })
  parent?: TaskEntity;

  child?: TaskEntity;
}
