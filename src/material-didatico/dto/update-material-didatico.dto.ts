import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDidaticoDto } from './create-material-didatico.dto';

export class UpdateMaterialDidaticoDto extends PartialType(CreateMaterialDidaticoDto) {}
