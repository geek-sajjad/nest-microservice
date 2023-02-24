import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ExtractRequestParamGrpcPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return value[this.paramName];
  }
}
