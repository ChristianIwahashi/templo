import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAvisoAulaDto } from './create-aviso-aula.dto';

export class UpdateAvisoAulaDto extends PartialType(OmitType(CreateAvisoAulaDto, ['idProfessor',    'idTurma'] as const)) {}
