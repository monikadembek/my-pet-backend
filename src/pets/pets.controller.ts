import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AccessTokenGuard } from 'src/shared/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVetClinicDto } from './dto/create-vet-clinic.dto';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create pet profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body(ValidationPipe) createPetDto: CreatePetDto, @Request() request) {
    const userId = request.user.sub;
    return this.petsService.create(createPetDto, +userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('vetClinic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vet clinic data and connect with pet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'Created' })
  createVetClinic(
    @Body(ValidationPipe)
    createVetClinicDto: CreateVetClinicDto,
  ) {
    return this.petsService.createVetClinic(createVetClinicDto);
  }

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all pets information for provided user' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAllPetsForUser(@Param('userId') userId: string) {
    return this.petsService.findAllForUser(+userId);
  }

  @Get('user/:userId/:id')
  @ApiOperation({ summary: 'Get pet information for provided user' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiParam({ name: 'id', format: 'String' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'OK' })
  findOnePetForUser(@Param('userId') userId: string, @Param('id') id: string) {
    return this.petsService.findOneForUser(+userId, +id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':petId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete pet profile' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('petId') petId: string, @Request() request) {
    const userId = request.user.sub;
    return this.petsService.remove(+petId, +userId);
  }
}
