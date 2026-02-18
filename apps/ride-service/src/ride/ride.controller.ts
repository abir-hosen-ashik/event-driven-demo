import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { UserService } from 'src/user/user.service';

@Controller('ride')
export class RideController {
  constructor(
    private readonly rideService: RideService, 
    private userService: UserService
  ) {}

  @Get(':userId')
  async getRideInfo(@Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId);
    return { rideId: 'R123', user };
  }

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Get()
  findAll() {
    return this.rideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rideService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(+id, updateRideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rideService.remove(+id);
  }
}
