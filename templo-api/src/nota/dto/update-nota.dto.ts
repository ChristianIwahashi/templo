import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateNotaDto } from './create-nota.dto';

export class UpdateNotaDto extends PartialType( OmitType(CreateNotaDto, ['idProfessor', 'idAluno'] as const)) {}
