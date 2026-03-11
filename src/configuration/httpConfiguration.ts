import { registerAs } from '@nestjs/config';

export const HTTP_CONFIG_TOKEN = 'http' as const;

export const httpConfig = registerAs(HTTP_CONFIG_TOKEN, () => {
    const required = [
        'RUNNING_PORT'
    ];

    const missing = required.filter(k => !process.env[k]);
    if (missing.length) throw new Error(`Missing http env vars: ${missing.join(', ')}`);

    const corsOrigins = process.env.CORS_ORIGINS 
        ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
        : '*';

    // Habilitar o deshabilitar autenticación globalmente
    const enableAuth = process.env.ENABLE_AUTH !== undefined 
        ? process.env.ENABLE_AUTH.toLowerCase() === 'true'
        : true; // Por defecto, la autenticación está activada

    return {
        RUNNING_PORT: Number(process.env.RUNNING_PORT),
        CORS_ORIGINS: corsOrigins,
        ENABLE_AUTH: enableAuth
    }
});

export type HttpConfig = ReturnType<typeof httpConfig>;