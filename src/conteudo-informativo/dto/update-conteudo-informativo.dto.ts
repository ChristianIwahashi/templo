import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateConteudoInformativoDto } from './create-conteudo-informativo.dto';

export class UpdateConteudoInformativoDto extends PartialType(OmitType(CreateConteudoInformativoDto, ['idGestor'] as const)) {}
