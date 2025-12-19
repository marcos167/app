const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteToAdmin() {
    // Get the first user or specific email
    const email = process.argv[2]; // Pass email as arg

    let user;
    if (email) {
        user = await prisma.user.findUnique({ where: { email } });
    } else {
        user = await prisma.user.findFirst();
    }

    if (!user) {
        console.log('No user found.');
        return;
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
    });

    console.log(`User ${updated.email} (${updated.name}) promoted to ADMIN.`);
}

promoteToAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
