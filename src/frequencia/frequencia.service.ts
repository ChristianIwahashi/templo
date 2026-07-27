import { Injectable } from '@nestjs/common';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';

@Injectable()
export class FrequenciaService {
  create(createFrequenciaDto: CreateFrequenciaDto) {
    return 'This action adds a new frequencia';
  }

  findAll() {
    return `This action returns all frequencia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} frequencia`;
  }

  update(id: number, updateFrequenciaDto: UpdateFrequenciaDto) {
    return `This action updates a #${id} frequencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} frequencia`;
  }
}
