import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

declare const process: {
    env: Record<string, string>;
    cwd: () => string;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const packageJson = require(path.join(process.cwd(), 'package.json'));

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

function getPath(address: string): string {
    return path.join(process.cwd(), address);
}

function fileContent(path: string): string {
    return fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '';
}

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SERVER: {
        PORT: process.env.SERVER_PORT || 3000,
        URL: process.env.SERVER_URL
    },
    MONGODB: {
        URI: process.env.MONGODB_URI,
        DB: process.env.MONGODB_DB,
    },
    SECURITY: {
        SALT_ROUNDS: +process.env.SECURITY_SALT_ROUNDS,
        SESSION: {
            SECRET: process.env.SECURITY_SESSION_SECRET,
            MAXAGE: +process.env.SECURITY_SESSION_MAXAGE
        },
        JWT: {
            ALGORITHM: process.env.SECURITY_JWT_ALGORITHM,
            PRIVATE_PASSWORD_PATH: getPath(process.env.SECURITY_JWT_PRIVATE_PASSWORD_PATH),
            PUBLIC_PASSWORD_PATH: getPath(process.env.SECURITY_JWT_PUBLIC_PASSWORD_PATH),
            PRIVATE_PASSWORD: fileContent(getPath(process.env.SECURITY_JWT_PRIVATE_PASSWORD_PATH)),
            PUBLIC_PASSWORD: fileContent(getPath(process.env.SECURITY_JWT_PUBLIC_PASSWORD_PATH)),
            EXPIRATION: process.env.SECURITY_JWT_EXPIRATION,
            ISSUER: process.env.SECURITY_JWT_ISSUER
        }
    },
    CORS: {
        ORIGIN: process.env.CORS_ORIGIN,
        CREDENTIALS: process.env.CORS_CREDENTIALS === 'true'
    },
    API_VERSION: packageJson.version
};

export default CONFIG;
