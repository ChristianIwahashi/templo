import { CreateUsuarioDto } from "./create-usuario.dto";
import { PartialType, OmitType } from '@nestjs/mapped-types';


export class UpdateUsuarioDto extends PartialType (
    OmitType(CreateUsuarioDto, ['papel', 'senha'] as const)) {}