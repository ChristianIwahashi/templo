import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Controller('material-didatico')
export class MaterialDidaticoController {
  constructor(private readonly materialDidaticoService: MaterialDidaticoService) {}

  @Post()
  create(@Body() createMaterialDidaticoDto: CreateMaterialDidaticoDto) {
    return this.materialDidaticoService.create(createMaterialDidaticoDto);
  }

  @Get()
  findAll() {
    return this.materialDidaticoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialDidaticoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialDidaticoDto: UpdateMaterialDidaticoDto) {
    return this.materialDidaticoService.update(+id, updateMaterialDidaticoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialDidaticoService.remove(+id);
  }
}
