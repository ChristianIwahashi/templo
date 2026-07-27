import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';

@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Post()
  create(@Body() createFrequenciaDto: CreateFrequenciaDto) {
    return this.frequenciaService.create(createFrequenciaDto);
  }

  @Get()
  findAll() {
    return this.frequenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frequenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrequenciaDto: UpdateFrequenciaDto) {
    return this.frequenciaService.update(+id, updateFrequenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frequenciaService.remove(+id);
  }
}
