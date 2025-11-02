import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsInt,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateTemplateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  template_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  fields_schema: object;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsBoolean()
  is_prebuilt?: boolean;

  @IsOptional()
  @IsInt()
  version?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
