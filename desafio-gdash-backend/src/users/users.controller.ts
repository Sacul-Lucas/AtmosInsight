import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Criar usuário (para admin ou seed)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Listar todos os usuários
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Buscar usuário por id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // Atualizar usuário
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) throw new NotFoundException('Usuário não encontrado');
    return updated;
  }

  // Deletar usuário
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException('Usuário não encontrado');
    return { message: 'Usuário deletado com sucesso' };
  }
}
