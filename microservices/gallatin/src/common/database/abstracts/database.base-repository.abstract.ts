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
  SelectQueryBuilder,
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
    id: string,
    options?: IDatabaseFindOneOptions<QueryRunner>,
  ): Promise<Y> {
    const findOne: FindOneOptions<T> = {
      where: {
        id: id,
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

  async create<N>(
    data: N,
    options?: IDatabaseCreateOptions<QueryRunner>,
  ): Promise<T> {
    const dataCreate: Record<string, any> = data;
    if (options && options.id) {
      dataCreate.id = options.id;
    }

    const create = this._repository.create(dataCreate as T);
    return this._repository.save(create, {
      transaction: options && options.session ? true : false,
    });
  }

  async updateOneById<N>(
    id: string,
    data: N,
    options?: IDatabaseUpdateOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { id } as FindOptionsWhere<any>,
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

  async deleteOneById(
    id: string,
    options?: IDatabaseDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { id } as FindOptionsWhere<any>,
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
    id: string,
    options?: IDatabaseSoftDeleteOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { id } as FindOptionsWhere<any>,
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
    id: string,
    options?: IDatabaseRestoreOptions<QueryRunner>,
  ): Promise<T> {
    const findOne: FindOneOptions = {
      where: { id } as FindOptionsWhere<any>,
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

  repository(): Repository<T> {
    return this._repository;
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
