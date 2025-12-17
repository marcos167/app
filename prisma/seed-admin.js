
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'marco.lp12@hotmail.com'

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    })

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: 'Marco Admin',
                email: adminEmail,
                password: '***REMOVED_DB_PASSWORD***', // In production, hash this!
                role: 'ADMIN',
                plan: 'Chef Pro',
                username: 'admin_marco',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco'
            },
        })
        console.log('Admin user created!')
    } else {
        // Ensure role is ADMIN and password matches
        await prisma.user.update({
            where: { email: adminEmail },
            data: {
                role: 'ADMIN',
                password: '***REMOVED_DB_PASSWORD***'
            }
        })
        console.log('Admin user updated!')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
