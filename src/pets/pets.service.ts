import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  create(createPetDto: CreatePetDto) {
    return 'This action adds a new pet';
  }

  async findAll() {
    return this.prisma.pet.findMany({
      include: {
        vetClinic: true,
        additionalContacts: true,
      },
    });
  }

  async findAllForUser(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    return this.prisma.pet.findMany({
      where: {
        userId,
      },
      include: {
        vetClinic: true,
        additionalContacts: true,
      },
    });
  }

  async findOne(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        vetClinic: true,
        additionalContacts: true,
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with id ${id} was not found`);
    }

    return pet;
  }

  async findOneForUser(userId: number, id: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    const pet = await this.prisma.pet.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        vetClinic: true,
        additionalContacts: true,
      },
    });

    console.log('pet: ', pet);

    if (!pet) {
      throw new NotFoundException(`Pet with id ${id} was not found`);
    }

    return pet;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
