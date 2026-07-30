import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvisoAulaService } from './aviso_aula.service';
import { CreateAvisoAulaDto } from './dto/create-aviso_aula.dto';
import { UpdateAvisoAulaDto } from './dto/update-aviso_aula.dto';

@Controller('aviso-aula')
export class AvisoAulaController {
  constructor(private readonly avisoAulaService: AvisoAulaService) {}

  @Post()
  create(@Body() createAvisoAulaDto: CreateAvisoAulaDto) {
    return this.avisoAulaService.create(createAvisoAulaDto);
  }

  @Get()
  findAll() {
    return this.avisoAulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avisoAulaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvisoAulaDto: UpdateAvisoAulaDto) {
    return this.avisoAulaService.update(+id, updateAvisoAulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avisoAulaService.remove(+id);
  }
}
