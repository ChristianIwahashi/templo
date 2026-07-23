import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { CreateMensalidadeDto } from './dto/create-mensalidade.dto';
import { UpdateMensalidadeDto } from './dto/update-mensalidade.dto';

@Controller('mensalidade')
export class MensalidadeController {
  constructor(private readonly mensalidadeService: MensalidadeService) {}

  @Post()
  create(@Body() createMensalidadeDto: CreateMensalidadeDto) {
    return this.mensalidadeService.create(createMensalidadeDto);
  }

  @Get()
  findAll() {
    return this.mensalidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mensalidadeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMensalidadeDto: UpdateMensalidadeDto) {
    return this.mensalidadeService.update(+id, updateMensalidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensalidadeService.remove(+id);
  }
}
