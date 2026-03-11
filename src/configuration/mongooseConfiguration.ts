import { registerAs } from '@nestjs/config';

export const MONGOOSE_CONFIG_TOKEN = 'mongoose' as const;

export const mongooseConfig = registerAs(MONGOOSE_CONFIG_TOKEN, () => {
    const required = [
        'DB_USER',
        'DB_PASSWORD',
        'DB_USAGE',
    ];

    const missing = required.filter(k => !process.env[k]);

    if (missing.length) throw new Error(`Missing Mongo env vars: ${missing.join(', ')}`);

    return {
        DB_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rlmv7x0.mongodb.net/DTS_DB?retryWrites=true&w=majority`,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_USAGE: process.env.DB_USAGE
    };
});

export type MongooseConfig = ReturnType<typeof mongooseConfig>;