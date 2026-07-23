import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMensalidadeDto } from './create-mensalidade.dto';

export class UpdateMensalidadeDto extends PartialType(OmitType(CreateMensalidadeDto, ['idGestor',  'idAluno'] as const)) {}
