import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  ValidationPipe,
  Put,
  ParseIntPipe,
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
  @Post('vet-clinic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vet clinic data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'Created' })
  createVetClinic(
    @Body(ValidationPipe)
    createVetClinicDto: CreateVetClinicDto,
  ) {
    return this.petsService.createVetClinic(createVetClinicDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('vet-clinic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of all vet clinics' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAllVetClinics() {
    return this.petsService.findAllVetClinics();
  }

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all pets information for provided user' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAllPetsForUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.petsService.findAllForUser(userId);
  }

  @Get('user/:userId/:id')
  @ApiOperation({ summary: 'Get pet information for provided user' })
  @ApiParam({ name: 'userId', format: 'String' })
  @ApiParam({ name: 'id', format: 'String' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'OK' })
  findOnePetForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.petsService.findOneForUser(userId, id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update pet profile' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePetDto: UpdatePetDto,
    @Request() request,
  ) {
    const userId = request.user.sub;
    return this.petsService.update(+userId, id, updatePetDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':petId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete pet profile' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('petId', ParseIntPipe) petId: number, @Request() request) {
    const userId = request.user.sub;
    return this.petsService.remove(petId, +userId);
  }
}
