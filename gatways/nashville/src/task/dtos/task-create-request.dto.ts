import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class TaskCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  description: string;

  @IsOptional()
  @IsUUID()
  parentId: string;
}
