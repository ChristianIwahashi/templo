import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAvisoEventoDto } from './create-aviso-evento.dto';

export class UpdateAvisoEventoDto extends PartialType(OmitType(CreateAvisoEventoDto, ['idGestor'] as const)) {}
