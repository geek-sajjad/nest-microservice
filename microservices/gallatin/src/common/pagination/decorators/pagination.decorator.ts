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
  PAGINATION_MAX_PAGE,
  PAGINATION_MAX_PER_PAGE,
  PAGINATION_PAGE,
  PAGINATION_SORT,
} from '../constants/pagination.constant';

export function PaginationSearch(availableSearch: string[]): PropertyDecorator {
  return applyDecorators(
    Expose(),
    IsOptional(),
    ValidateIf((e) => e.search !== ''),
    Transform(({ value }) => {
      if (!value) {
        return undefined;
      }

      const data: Record<string, any> = {};
      availableSearch.forEach((val) => {
        data[val] = ILike(`%${value}%`);
      });

      return data;
    }),
  );
}

export function PaginationAvailableSearch(
  availableSearch: string[],
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(() => availableSearch),
  );
}

export function PaginationPage(page = PAGINATION_PAGE): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Type(() => Number),
    Transform(({ value }) =>
      !value ? page : value > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : value,
    ),
  );
}

export function PaginationPerPage(
  perPage = PAGINATION_PAGE,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Type(() => Number),
    Transform(({ value }) =>
      !value
        ? perPage
        : value > PAGINATION_MAX_PER_PAGE
        ? PAGINATION_MAX_PER_PAGE
        : value,
    ),
  );
}

export function PaginationSort(
  sort = PAGINATION_SORT,
  availableSort = PAGINATION_AVAILABLE_SORT,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, obj }) => {
      const bSort = PAGINATION_SORT.split('@')[0];

      const rSort = value || sort;
      const rAvailableSort = obj._availableSort || availableSort;
      const field: string = rSort.split('@')[0];
      const type: string = rSort.split('@')[1];
      const convertField: string = rAvailableSort.includes(field)
        ? field
        : bSort;

      const convertType = ENUM_PAGINATION_SORT_TYPE[type.toUpperCase()];

      return { [convertField]: convertType };
    }),
  );
}

export function PaginationAvailableSort(
  availableSort = PAGINATION_AVAILABLE_SORT,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value }) => (!value ? availableSort : value)),
  );
}

export function PaginationFilterBoolean(
  defaultValue: boolean[],
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, key }) => {
      return value
        ? {
            [key]: In(
              value
                .split(',')
                .map((val: string) => (val === 'true' ? true : false)),
            ),
          }
        : {
            [key]: In(defaultValue),
          };
    }),
  );
}

export function PaginationFilterEnum<T>(
  defaultValue: T[],
  defaultEnum: Record<string, any>,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, key }) => {
      return value
        ? {
            [key]: In(
              value
                .split(',')
                .map((val: string) => defaultEnum[val])
                .filter((val: string) => val !== undefined),
            ),
          }
        : { [key]: In(defaultValue) };
    }),
  );
}

export function PaginationFilterId(): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, key }) => {
      return value ? { [key]: value } : undefined;
    }),
  );
}

export function PaginationFilterDate(
  options?: IPaginationFilterDateOptions,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, key }) => {
      let valDate = new Date(value);
      if (options) {
        const today = new Date();

        if (options?.operation?.lessThanEqualToday && valDate <= today) {
          valDate = today;
        } else if (options?.operation?.lessThanToday && valDate < today) {
          valDate = today;
        } else if (options?.operation?.moreThanEqualToday && valDate >= today) {
          valDate = today;
        } else if (options?.operation?.moreThanToday && valDate > today) {
          valDate = today;
        }

        if (options?.endOfDate) {
          valDate = valDate ?? today;
          valDate.setHours(23, 59, 59, 999);
        }
      }

      return value ? { [key]: valDate } : undefined;
    }),
  );
}

export function PaginationFilterString(
  options?: IPaginationFilterStringOptions,
): PropertyDecorator {
  return applyDecorators(
    Expose(),
    Transform(({ value, key }) => {
      if (options) {
        if (options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.UPPERCASE) {
          value = value.toUpperCase();
        } else if (
          options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.LOWERCASE
        ) {
          value = value.toUpperCase();
        }

        if (options?.trim) {
          value = value.trim();
        }
      }

      return value ? { [key]: value } : undefined;
    }),
  );
}
