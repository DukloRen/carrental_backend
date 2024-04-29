import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  license_plate_number: string;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  model:string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  daily_cost: number;
}
