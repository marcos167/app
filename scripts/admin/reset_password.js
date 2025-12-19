const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'marco.lp12@hotmail.com';
    const newPassword = '***REMOVED_DB_PASSWORD***';

    console.log(`Resetting password for ${email}...`);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`Success! Password updated for ${user.email}`);
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

resetPassword()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
