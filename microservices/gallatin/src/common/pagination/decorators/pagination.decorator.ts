import { applyDecorators } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, ValidateIf } from 'class-validator';

import {
  IPaginationFilterDateOptions,
  IPaginationFilterStringOptions,
} from '../interfaces/pagination.interfaces';
import { ILike, In } from 'typeorm';
import {
  ENUM_PAGINATION_SORT_TYPE,
  ENUM_PAGINATION_FILTER_CASE_OPTIONS,
} from '../constants/pagination.enum.constant';
import {
  PAGINATION_AVAILABLE_SORT,
  PAGINATION_MAX_PER_PAGE,
  PAGINATION_PAGE,
  PAGINATION_SORT,
} from '../constants/pagination.constant';

export function PaginationPage(page = PAGINATION_PAGE): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Type(() => Number),
    Transform(({ value }) => {
      if (!value) return page;
      if (isNaN(value)) return page;
      if (value < page) return page;

      return value;
    }),
  );
}

export function PaginationPerPage(
  perPage = PAGINATION_MAX_PER_PAGE,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Type(() => Number),
    Transform(({ value }) => {
      if (!value) return perPage;
      if (value > perPage) return perPage;
      if (value < 1) return perPage;

      return value;
    }),
  );
}

export function PaginationSort(
  sort = PAGINATION_SORT,
  availableSort = PAGINATION_AVAILABLE_SORT,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, obj }) => {
      try {
        const bSort = PAGINATION_SORT.split('@')[0];

        const rSort = value || sort;
        const rAvailableSort = obj._availableSort || availableSort;
        const field: string = rSort.split('@')[0];
        const type: string = rSort.split('@')[1];
        const convertField: string = rAvailableSort.includes(field)
          ? field
          : bSort;

        let convertType = ENUM_PAGINATION_SORT_TYPE[type.toUpperCase()];
        if (!convertType)
          convertType =
            ENUM_PAGINATION_SORT_TYPE[sort.split('@')[1].toUpperCase()];
        return { [convertField]: convertType };
      } catch (_) {
        const bSort = PAGINATION_SORT.split('@')[0];

        const field: string = sort.split('@')[0];
        const type: string = sort.split('@')[1];

        const convertField: string = availableSort.includes(field)
          ? field
          : bSort;
        const convertType = ENUM_PAGINATION_SORT_TYPE[type.toUpperCase()];
        return { [convertField]: convertType };
      }
    }),
  );
}

export function PaginationAvailableSort(
  availableSort = PAGINATION_AVAILABLE_SORT,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(() => availableSort),
  );
}
