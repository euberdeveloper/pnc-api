import { Handler } from 'express';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';

import CONFIG from '@/config';

export default async function (): Promise<Handler> {
    const redisStore = connectRedis(session);
    const redisClient = redis.createClient({
        url: `redis://${CONFIG.REDIS.HOST}:${CONFIG.REDIS.PORT}`,
        legacyMode: true
    });
    await redisClient.connect();

    return session({
        store: new redisStore({ client: redisClient }),
        secret: CONFIG.SECURITY.SESSION.SECRET,
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: CONFIG.SECURITY.SESSION.MAXAGE,
            secure: false
        }
    });
}
