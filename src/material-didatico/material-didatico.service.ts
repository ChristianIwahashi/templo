import { Injectable } from '@nestjs/common';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Injectable()
export class MaterialDidaticoService {
  create(createMaterialDidaticoDto: CreateMaterialDidaticoDto) {
    return 'This action adds a new materialDidatico';
  }

  findAll() {
    return `This action returns all materialDidatico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialDidatico`;
  }

  update(id: number, updateMaterialDidaticoDto: UpdateMaterialDidaticoDto) {
    return `This action updates a #${id} materialDidatico`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialDidatico`;
  }
}
