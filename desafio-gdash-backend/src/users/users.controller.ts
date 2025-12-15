import { Controller, Get, Post, Put, Delete, Body, Param, UnauthorizedException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import type { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  private async checkAdmin(req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token não fornecido');

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyJwt(token);
    if (!decoded) throw new UnauthorizedException('Token inválido');

    if (decoded.role !== 'admin') throw new UnauthorizedException('Acesso negado');
  }

  @Get()
  async findAll(@Req() req: Request) {
    await this.checkAdmin(req);

    const users = await this.usersService.findAll();
    if (!users) throw new UnauthorizedException('Não foi possível listar os usuários');

    return {
      success: true,
      message: users
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    await this.checkAdmin(req);

    const user = this.usersService.findOne(id);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return {
      success: true,
      message: user
    };
  }

  @Post()
  async create(@Body() body: CreateUserDto, @Req() req: Request) {
    await this.checkAdmin(req);

    const createdUser = this.usersService.create(body);
    if (!createdUser) throw new UnauthorizedException('Não foi possível criar um novo usuário');

    if (!body.username) throw new UnauthorizedException('Insira um nome de usuário válido');
    if (!body.email) throw new UnauthorizedException('Insira um email válido');
    if (!body.password) throw new UnauthorizedException('Insira uma senha válida');

    const exists = await this.usersService.findByEmail(body.email);
    if (exists) throw new UnauthorizedException('Email já foi registrado');

    return {
      success: true,
      message: 'Novo usuário adicionado com sucesso!'
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: Request) {
    await this.checkAdmin(req);

    const updatedUser = this.usersService.update(id, body);
    if (!updatedUser) throw new UnauthorizedException('Não foi possível editar o usuário');

    return {
      success: true,
      message: 'Informações do usuário atualizadas com sucesso!'
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.checkAdmin(req);

    const delUser = this.usersService.remove(id);
    if (!delUser) throw new UnauthorizedException('Não foi possível remover o usuário');

    return {
      success: true,
      message: 'Usuário removido com sucesso!'
    };
  }
}
