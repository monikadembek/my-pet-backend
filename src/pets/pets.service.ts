import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateVetClinicDto } from './dto/create-vet-clinic.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(createPetDto: CreatePetDto, userId: number) {
    if (createPetDto.vetClinicId) {
      const vetClinicExists = await this.prisma.vetClinic.findUnique({
        where: { id: createPetDto.vetClinicId },
      });

      if (!vetClinicExists) {
        throw new NotFoundException(
          `Vet clinic with id ${createPetDto.vetClinicId} does not exist`,
        );
      }
    }

    const createData: any = {
      name: createPetDto.name,
      species: createPetDto.species,
      breed: createPetDto.breed,
      description: createPetDto.description,
      dateOfBirth: createPetDto.dateOfBirth,
      weight: createPetDto.weight,
      food: createPetDto.food,
      healthIssues: createPetDto.healthIssues,
      medicine: createPetDto.medicine,
      behavioralIssues: createPetDto.behavioralIssues,
      user: {
        connect: { id: userId },
      },
      additionalContacts: {
        create: createPetDto.additionalContacts,
      },
    };

    if (createPetDto.vetClinicId) {
      createData.vetClinic = {
        connect: { id: createPetDto.vetClinicId },
      };
    }

    return this.prisma.pet.create({
      data: createData,
      include: {
        additionalContacts: true,
        vetClinic: createPetDto.vetClinicId ? true : false,
      },
    });
  }

  async createVetClinic(createVetClinicDto: CreateVetClinicDto) {
    return this.prisma.vetClinic.create({
      data: createVetClinicDto,
    });
  }

  async findAllVetClinics() {
    return this.prisma.vetClinic.findMany();
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

  async update(userId: number, petId: number, updatePetDto: UpdatePetDto) {
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with id ${petId} was not found`);
    }

    if (userId !== pet.userId) {
      throw new UnauthorizedException(
        `Unauthorized attempt to update pet belonging to other user`,
      );
    }

    if (updatePetDto.vetClinicId) {
      const vetClinicExists = await this.prisma.vetClinic.findUnique({
        where: { id: updatePetDto.vetClinicId },
      });

      if (!vetClinicExists) {
        throw new NotFoundException(
          `Vet clinic with id ${updatePetDto.vetClinicId} does not exist`,
        );
      }
    }

    const updateData: any = {
      name: updatePetDto.name,
      species: updatePetDto.species,
      breed: updatePetDto.breed,
      description: updatePetDto.description,
      dateOfBirth: updatePetDto.dateOfBirth,
      weight: updatePetDto.weight,
      food: updatePetDto.food,
      healthIssues: updatePetDto.healthIssues,
      medicine: updatePetDto.medicine,
      behavioralIssues: updatePetDto.behavioralIssues,
    };

    // handle vetClinic connection
    if (updatePetDto.vetClinicId) {
      updateData.vetClinic = {
        connect: { id: updatePetDto.vetClinicId },
      };
    } else {
      updateData.vetClinic = {
        disconnect: true,
      };
    }

    // handle additional contacts
    if (updatePetDto.additionalContacts) {
      updateData.additionalContacts = {
        deleteMany: {}, // delete all existing contacts
        create: updatePetDto.additionalContacts, // create new contacts
      };
    }

    return this.prisma.pet.update({
      where: {
        id: petId,
      },
      data: updateData,
      include: {
        additionalContacts: true,
        vetClinic: true,
      },
    });
  }

  async remove(petId: number, userId: number) {
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with id ${petId} was not found`);
    }

    if (userId !== pet.userId) {
      throw new UnauthorizedException(
        `Unauthorized attempt to delete pet belonging to other user`,
      );
    }

    const deleteAdditionalContacts = this.prisma.additionalContact.deleteMany({
      where: {
        petId,
      },
    });
    const deletePet = this.prisma.pet.delete({
      where: {
        id: petId,
      },
    });
    await this.prisma.$transaction([deleteAdditionalContacts, deletePet]);

    return {
      status: 'success',
      message: `Pet named ${pet.name} was deleted`,
      timestamp: new Date().toISOString(),
    };
  }
}
