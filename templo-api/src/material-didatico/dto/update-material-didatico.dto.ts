import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDidaticoDto } from './create-material-didatico.dto';

export class UpdateMaterialDidaticoDto extends PartialType(OmitType(CreateMaterialDidaticoDto, ['idProfessor', 'idTurma'] as const)) {}
