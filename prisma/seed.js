const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const member1 = await prisma.member.create({
    data: {
      name: 'John Doe',
      role: 'Developer',
    },
  });

  const member2 = await prisma.member.create({
    data: {
      name: 'Jane Smith',
      role: 'Manager',
    },
  });

  const project1 = await prisma.project.create({
    data: {
      name: 'Project A',
      description: 'Description for Project A',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Project B',
      description: 'Description for Project B',
    },
  });

  await prisma.memberProject.create({
    data: {
      memberId: member1.id,
      projectId: project1.id,
    },
  });

  await prisma.memberProject.create({
    data: {
      memberId: member2.id,
      projectId: project1.id,
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });