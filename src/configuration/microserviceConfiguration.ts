import { registerAs } from '@nestjs/config';

export const MICROSERVICE_CONFIG_TOKEN = 'microservice' as const;

export const microserviceConfig = registerAs(MICROSERVICE_CONFIG_TOKEN, () => {
    const required = [
        'SERVER_HOST',
        'MICROSERVICE_PORT',
    ];

    const missing = required.filter(k => !process.env[k]);

    if (missing.length) throw new Error(`Missing microservice env vars: ${missing.join(', ')}`);

    return {
        SERVER_HOST: process.env.SERVER_HOST,
        MICROSERVICE_PORT: Number(process.env.MICROSERVICE_PORT)
    };
});

export type MicroserviceConfig = ReturnType<typeof microserviceConfig>;


