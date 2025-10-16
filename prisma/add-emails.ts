import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addEmailsToExistingUsers() {
  try {
    // Get users without emails
    const usersWithoutEmails = await prisma.user.findMany({
      where: {
        email: null
      }
    });

    console.log(`Found ${usersWithoutEmails.length} users without emails`);

    // Add placeholder emails for each user
    for (const user of usersWithoutEmails) {
      const placeholderEmail = `${user.username}@temp.mindbridge.com`;
      await prisma.user.update({
        where: { id: user.id },
        data: { email: placeholderEmail }
      });
      console.log(`✓ Added email ${placeholderEmail} to user ${user.username}`);
    }

    console.log('\n✅ All users now have emails!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEmailsToExistingUsers();
