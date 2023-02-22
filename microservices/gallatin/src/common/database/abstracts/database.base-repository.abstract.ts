import { ENUM_PAGINATION_SORT_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { IPaginationSort } from 'src/common/pagination/interfaces/pagination.interfaces';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  QueryRunner,
  Repository,
} from 'typeorm';
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
  IDatabaseOptions,
  IDatabaseRestoreManyOptions,
  IDatabaseRestoreOptions,
  IDatabaseSoftDeleteManyOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '../interfaces/database.interface';

export abstract class DatabaseBaseRepositoryAbstract<T> {
  protected _repository: Repository<T>;
  protected _joinOnFind?: FindOptionsRelations<T>;

  constructor(repository: Repository<T>, options?: FindOptionsRelations<T>) {
    this._repository = repository;
    this._joinOnFind = options;
  }

  async findAll<Y = T>(
    find?: Record<string, any> | Record<string, any>[],
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<Y[]> {
    const findAll: FindManyOptions<T> = {
      where: find,
    };

    if (options && options.withDeleted) {
      findAll.withDeleted = true;
    } else {
      findAll.withDeleted = false;
    }

    if (options && options.select) {
      findAll.select = this._convertToObjectOfBoolean(
        options.select,
      ) as FindOptionsSelect<T>;
    }

    if (options && options.paging) {
      findAll.take = options.paging.limit;
      findAll.skip = options.paging.skip;
    }

    if (options && options.sort) {
      findAll.order = this._convertSort(options.sort) as FindOptionsOrder<T>;
    }

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    return this._repository.find(findAll) as any;
  }

  async findOne<Y = T>(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseFindOneOptions<QueryRunner>,
  ): Promise<Y> {
    const findOne: FindOneOptions<T> = {
      where: find,
    };

    if (options && options.withDeleted) {
      findOne.withDeleted = true;
    } else {
      findOne.withDeleted = false;
    }

    if (options && options.select) {
      findOne.select = this._convertToObjectOfBoolean(
        options.select,
      ) as FindOptionsSelect<T>;
    }

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    if (options && options.sort) {
      findOne.order = this._convertSort(options.sort) as FindOptionsOrder<T>;
    }

    return this._repository.findOne(findOne) as any;
  }

  async findOneById<Y = T>(
    _id: string,
    options?: IDatabaseFindOneOptions<QueryRunner>,
  ): Promise<Y> {
    const findOne: FindOneOptions<T> = {
      where: {
        _id: _id,
      } as FindOptionsWhere<any>,
    };

    if (options && options.withDeleted) {
      findOne.withDeleted = true;
    } else {
      findOne.withDeleted = false;
    }

    if (options && options.select) {
      findOne.select = this._convertToObjectOfBoolean(
        options.select,
      ) as FindOptionsSelect<T>;
    }

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    if (options && options.sort) {
      findOne.order = this._convertSort(options.sort) as FindOptionsOrder<T>;
    }

    findOne.transaction = options && options.session ? true : false;

    return this._repository.findOne(findOne) as any;
  }

  async getTotal(
    find?: Record<string, any> | Record<string, any>[],
    options?: IDatabaseOptions<QueryRunner>,
  ): Promise<number> {
    const count: FindManyOptions<any> = {
      where: find,
    };

    if (options && options.withDeleted) {
      count.withDeleted = true;
    } else {
      count.withDeleted = false;
    }

    count.transaction = options && options.session ? true : false;

    if (options && options.join) {
      count.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    return this._repository.count(count) as any;
  }

  async exists(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseExistOptions<QueryRunner>,
  ): Promise<boolean> {
    const findOne: FindOneOptions<T> = {
      where: find,
      select: {
        _id: true,
      } as FindOptionsSelect<any>,
    };

    if (options && options.withDeleted) {
      findOne.withDeleted = true;
    } else {
      findOne.withDeleted = false;
    }

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const exist: T = await this._repository.findOne(findOne);

    return exist ? true : false;
  }

  async raw<N, R = string>(rawOperation: R): Promise<N[]> {
    if (typeof rawOperation !== 'string') {
      throw new Error('Must in string');
    }

    return this._repository.query(rawOperation);
  }

  async create<N>(
    data: N,
    options?: IDatabaseCreateOptions<QueryRunner>,
  ): Promise<T> {
    const dataCreate: Record<string, any> = data;
    if (options && options._id) {
      dataCreate._id = options._id;
    }

    const create = this._repository.create(dataCreate as T);
    return this._repository.save(create, {
      transaction: options && options.session ? true : false,
    });
  }

  async updateOneById<N>(
    _id: string,
    data: N,
    options?: IDatabaseUpdateOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { _id } as FindOptionsWhere<any>,
      withDeleted: false,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    let update = await this._repository.findOne(findOne);
    update = this._convertEntity(update, data);

    return this._repository.save(update, {
      transaction: options && options.session ? true : false,
    });
  }

  async updateOne<N>(
    find: Record<string, any> | Record<string, any>[],
    data: N,
    options?: IDatabaseUpdateOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: find as FindOptionsWhere<any>,
      withDeleted: false,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    let update = await this._repository.findOne(findOne);
    update = this._convertEntity(update, data);

    return this._repository.save(update, {
      transaction: options && options.session ? true : false,
    });
  }

  async deleteOne(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: find as FindOptionsWhere<any>,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const del = await this._repository.findOne(findOne);
    await this._repository.remove(del, {
      transaction: options && options.session ? true : false,
    });

    return del;
  }

  async deleteOneById(
    _id: string,
    options?: IDatabaseDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { _id } as FindOptionsWhere<any>,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const del = await this._repository.findOne(findOne);
    await this._repository.remove(del, {
      transaction: options && options.session ? true : false,
    });

    return del;
  }

  async softDeleteOneById(
    _id: string,
    options?: IDatabaseSoftDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { _id } as FindOptionsWhere<any>,
      withDeleted: false,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const del = await this._repository.findOne(findOne);
    await this._repository.softRemove(del, {
      transaction: options && options.session ? true : false,
    });

    return del;
  }

  async softDeleteOne(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseSoftDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: find as FindOptionsWhere<any>,
      withDeleted: false,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const del = await this._repository.findOne(findOne);
    await this._repository.softRemove(del, {
      transaction: options && options.session ? true : false,
    });

    return del;
  }

  async restoreOneById(
    _id: string,
    options?: IDatabaseRestoreOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { _id } as FindOptionsWhere<any>,
      withDeleted: true,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const rec = await this._repository.findOne(findOne);
    await this._repository.recover(rec, {
      transaction: options && options.session ? true : false,
    });

    return rec;
  }

  async restoreOne(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseRestoreOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: find as FindOptionsWhere<any>,
      withDeleted: true,
    };

    if (options && options.join) {
      findOne.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findOne.transaction = options && options.session ? true : false;

    const rec = await this._repository.findOne(findOne);
    await this._repository.recover(rec, {
      transaction: options && options.session ? true : false,
    });

    return rec;
  }

  async createMany<N>(
    data: N[],
    options?: IDatabaseCreateManyOptions<QueryRunner>,
  ): Promise<boolean> {
    try {
      const create = this._repository.create(data as any[]);
      await this._repository.save(create, {
        transaction: options && options.session ? true : false,
      });
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteManyByIds(
    _id: string[],
    options?: IDatabaseManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: { _id: In(_id) },
      withDeleted: false,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const del = await this._repository.find(findAll);
      await this._repository.remove(del, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteMany(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: find,
      withDeleted: false,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const del = await this._repository.find(findAll);
      await this._repository.remove(del, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async softDeleteManyByIds(
    _id: string[],
    options?: IDatabaseSoftDeleteManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: {
        _id: In(_id),
      },
      withDeleted: false,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const del = await this._repository.find(findAll);
      await this._repository.softRemove(del, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async softDeleteMany(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseSoftDeleteManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: find,
      withDeleted: false,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const del = await this._repository.find(findAll);
      await this._repository.softRemove(del, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async restoreManyByIds(
    _id: string[],
    options?: IDatabaseRestoreManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: {
        _id: In(_id),
      },
      withDeleted: true,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const rec = await this._repository.find(findAll);
      await this._repository.recover(rec, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async restoreMany(
    find: Record<string, any> | Record<string, any>[],
    options?: IDatabaseRestoreManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions<any> = {
      where: find,
      withDeleted: true,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      const rec = await this._repository.find(findAll);
      await this._repository.recover(rec, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async updateMany<N>(
    find: Record<string, any> | Record<string, any>[],
    data: N,
    options?: IDatabaseManyOptions<QueryRunner>,
  ): Promise<boolean> {
    const findAll: FindManyOptions = {
      where: find as FindOptionsWhere<any>,
      withDeleted: false,
    };

    if (options && options.join) {
      findAll.relations =
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as FindOptionsRelations<T>);
    }

    findAll.transaction = options && options.session ? true : false;

    try {
      let update = await this._repository.find(findAll);
      update = this._convertEntity(update, data);

      await this._repository.save(update, {
        transaction: options && options.session ? true : false,
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async model<N = T>(): Promise<N> {
    return this._repository.createQueryBuilder() as N;
  }

  private _convertToObjectOfBoolean(
    obj: Record<string, string | number>,
  ): Record<string, boolean> {
    const keys: string[] = Object.keys(obj);
    const map: Record<string, boolean> = {};
    keys.forEach((val) => {
      map[val] =
        typeof obj[val] === 'string' ? true : obj[val] === 1 ? true : false;
    });

    return map;
  }

  private _convertSort(
    sort: IPaginationSort,
  ): Record<string, ENUM_PAGINATION_SORT_TYPE> {
    return sort;
  }

  private _convertEntity<T, N>(entity: T, data: N): T {
    Object.keys(data).forEach((val) => {
      entity[val] = data[val];
    });

    return entity;
  }
}
