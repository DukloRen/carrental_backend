import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly database: PrismaService) {
  }

  async rent(id: string) {
    const carExists = await this.database.cars.findUnique({
      where: { id: parseInt(id) },
    });

    if (!carExists) {
      throw new HttpException('Car was not found', HttpStatus.NOT_FOUND);
    }


    const existingRental = await this.database.rentals.findFirst({
      where: {
        car_id: parseInt(id),
        start_date: { lte: new Date() },
        end_date: { gte: new Date() },
      },
    });

    if (existingRental) {
      throw new HttpException(
        'Car has already been rented',
        HttpStatus.CONFLICT,
      );
    }


    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    try {
      return await this.database.rentals.create({
        data: {
          car_id: parseInt(id),
          start_date: new Date(),
          end_date: endDate,
        },
      });
    } catch (error) {
      throw new HttpException('Creating rental failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  async create(createCarDto: CreateCarDto) {
    try {
      return this.database.cars.create({
        data: {
          license_plate_number: createCarDto.license_plate_number,
          brand: createCarDto.brand,
          model: createCarDto.model,
          daily_cost: createCarDto.daily_cost,
          created_at: new Date()
        },
        select: {
          id: true,
          license_plate_number: true,
          brand: true,
          model: true,
          daily_cost: true
        },
      });
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Validation failed',
      },
        HttpStatus.BAD_REQUEST,
        )
    }
  }

  findAll() {
    return this.database.cars.findMany({
      select:{
        id: true,
        license_plate_number: true,
        brand: true,
        model: true,
        daily_cost: true,
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
