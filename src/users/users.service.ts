import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    // throw new UnauthorizedError('Não autorizado.');
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado.');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
