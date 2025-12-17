import prisma from '@/lib/prisma';

interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // Seconds until reset
}

/**
 * Check Rate Limit for a given key.
 * Uses a Token Bucket / Counter approach stored in Postgres.
 * 
 * @param key Unique identifier (e.g. "comment:ip:127.0.0.1")
 * @param limit Max requests allowed in the window
 * @param windowSeconds Duration of the window in seconds
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = new Date();

    // We use a transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
        let record = await tx.rateLimit.findUnique({
            where: { key }
        });

        // 1. If record exists but is expired, reset it
        if (record && record.resetAt < now) {
            record = await tx.rateLimit.update({
                where: { key },
                data: {
                    count: 1,
                    resetAt: new Date(now.getTime() + windowSeconds * 1000)
                }
            });

            return {
                success: true,
                limit,
                remaining: limit - 1,
                reset: windowSeconds
            };
        }

        // 2. If record exists and is valid
        if (record) {
            if (record.count >= limit) {
                return {
                    success: false,
                    limit,
                    remaining: 0,
                    reset: Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000)
                };
            }

            // Increment
            record = await tx.rateLimit.update({
                where: { key },
                data: { count: record.count + 1 }
            });

            return {
                success: true,
                limit,
                remaining: limit - record.count,
                reset: Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000)
            };
        }

        // 3. Create new record
        record = await tx.rateLimit.create({
            data: {
                key,
                count: 1,
                resetAt: new Date(now.getTime() + windowSeconds * 1000)
            }
        });

        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: windowSeconds
        };
    });
}
