import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  readonly description: string;

  @IsUUID('4') //TODO check the uuid versions
  @IsOptional()
  readonly parent_id?: string;
}
