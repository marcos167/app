import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export type AdminAction =
    | 'CREATE_RECIPE'
    | 'UPDATE_RECIPE'
    | 'DELETE_RECIPE'
    | 'BAN_USER'
    | 'UPDATE_USER_ROLE'
    | 'DELETE_USER'
    | 'DELETE_COMMENT'
    | 'APPROVE_COMMENT'
    | 'REJECT_COMMENT'
    | 'SOFT_DELETE_RECIPE'
    | 'RESTORE_RECIPE';

export async function logAdminAction(
    userId: string,
    action: AdminAction,
    details: object
) {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';

        await prisma.adminLog.create({
            data: {
                userId,
                action,
                details: JSON.stringify(details),
                ip
            }
        });
    } catch (error) {
        // Fail silently to not block the main action, but log to console
        console.error('Failed to create admin log:', error);
    }
}
