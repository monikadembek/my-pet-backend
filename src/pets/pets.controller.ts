import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AccessTokenGuard } from 'src/shared/guards/accessToken.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
