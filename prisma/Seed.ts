
import {faker} from '@faker-js/faker';
import { PrismaClient, rentals } from '@prisma/client';


const prisma = new PrismaClient

async function main(){
  for (let i= 0; i<15;i++){
    await prisma.rentals.create({
      data: {
        start_date: faker.date.past(),
        end_date: faker.date.recent(),
        car_id: faker.number.int({min:1,max:11}),
      }
    })
  }
  prisma.$disconnect()
}
main();
