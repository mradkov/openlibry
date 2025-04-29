import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user1 = await prisma.user.create({
    data: {
      id: 1000,
      lastName: 'Георгиев',
      firstName: 'Георги',
      phone: '0878987654',
      eMail: 'gosho.georgiev@istinski.mail',
      active: true,
    },
  });
  const book1 = await prisma.book.create({
    data: {
      id: 1000,
      rentalStatus: 'available',
      rentedDate: new Date(),
      dueDate: new Date(),
      renewalCount: 0,
      title: 'Тест Книга',
      subtitle: 'Напълно реална книга',
      author: 'Истински Човек',
      topics: '',
      imageLink: '',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
