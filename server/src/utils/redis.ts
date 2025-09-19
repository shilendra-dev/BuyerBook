import Redis from 'ioredis';

export const redis = new Redis(
    {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
    }
);

redis.on('error', (err) => {
    console.error('Redis error', err);
});