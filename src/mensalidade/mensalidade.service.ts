import { Injectable } from '@nestjs/common';
import { CreateMensalidadeDto } from './dto/create-mensalidade.dto';
import { UpdateMensalidadeDto } from './dto/update-mensalidade.dto';

@Injectable()
export class MensalidadeService {
  create(createMensalidadeDto: CreateMensalidadeDto) {
    return 'This action adds a new mensalidade';
  }

  findAll() {
    return `This action returns all mensalidade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mensalidade`;
  }

  update(id: number, updateMensalidadeDto: UpdateMensalidadeDto) {
    return `This action updates a #${id} mensalidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} mensalidade`;
  }
}
