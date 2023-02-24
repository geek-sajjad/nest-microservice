import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class TransformParentIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const val = { ...value, parent_id: value?.parentId };
    delete val.parentId;
    return val;
  }
}
