import { registerAs } from '@nestjs/config';

export const JWT_CONFIG_TOKEN = 'jwt' as const;

export const jwtConfig = registerAs(JWT_CONFIG_TOKEN, () => {
    const required = [
        'JWT_SEED'
    ];

    const missing = required.filter(k => !process.env[k]);

    if (missing.length) throw new Error(`Missing jwt env vars: ${missing.join(', ')}`);

    return {
        JWT_SEED: process.env.JWT_SEED
    };
});

export type JwtConfig = ReturnType<typeof jwtConfig>;


