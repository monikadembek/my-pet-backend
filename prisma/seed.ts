import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10;

async function createUsers() {
  const user1password = await bcrypt.hash('admin', saltRounds);
  const user2password = await bcrypt.hash('password', saltRounds);

  const user1data = {
    name: 'Mina',
    password: user1password,
    email: 'monika.dembek@gmail.com',
  };

  const user2data = {
    name: 'Monika Cybercom',
    password: user2password,
    email: 'monika.cybercom@gmail.com',
  };

  const user1 = await prisma.user.create({
    data: user1data,
  });

  const user2 = await prisma.user.create({
    data: user2data,
  });
}

async function createUserProfiles() {
  const userProfiles = await prisma.userProfile.createMany({
    data: [
      {
        userId: 1,
        phoneNumber: '111222333',
        address: 'Bydgoszcz',
        bio: 'cats lover',
      },
      {
        userId: 9,
        phoneNumber: '444222333',
        address: 'Bydgoszcz',
        bio: "cat's queen",
      },
    ],
  });
}

async function createPetRecord() {
  const vetClinic = await prisma.vetClinic.create({
    data: {
      name: 'Zoovet',
      address: 'Bydgoszcz, Brzozowa',
      phone: '123456789',
    },
  });

  const pet1 = await prisma.pet.create({
    data: {
      name: 'Rysia',
      species: 'cat',
      breed: 'European shorthair',
      description: 'Best cat ever',
      dateOfBirth: new Date('2018-08-27'),
      weight: 4.2,
      food: 'only wet food',
      healthIssues: 'Thyroid problems, IBD, food allergies',
      medicine: 'Thiafeline, Cyclavance',
      behavioralIssues: "doesn't like to be touched by people",
      user: {
        connect: { id: 9 },
      },
      vetClinic: {
        connect: { id: vetClinic.id },
      },
      additionalContacts: {
        create: [
          {
            name: 'Jane Doe',
            phone: '111222333',
          },
        ],
      },
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Bert',
      species: 'cat',
      breed: 'European shorthair',
      description: 'Beast',
      dateOfBirth: new Date('2022'),
      weight: 4.0,
      food: 'only wet food',
      healthIssues: 'chicken allergy, trembling of front paws',
      behavioralIssues: 'scared of people',
      medicine: 'none',
      user: {
        connect: { id: 9 },
      },
      vetClinic: {
        connect: { id: vetClinic.id },
      },
      additionalContacts: {
        create: [
          {
            name: 'Jane Doe',
            phone: '111222333',
          },
        ],
      },
    },
  });

  console.log('Pet record created:', pet1, pet2);
}

async function main() {
  await createUsers();
  await createUserProfiles();
  await createPetRecord();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
