import { TimeoutError, timeout, firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export function MicroserviceCall(pattern: string, clientKey: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {

            // Obtener clientProxy dinámicamente desde la instancia del UseCase
            const msClient: ClientProxy = this[clientKey];

            if (!msClient) {
                throw new Error(`[MicroserviceCall] ClientProxy '${clientKey}' no existe en instancia`);
            }

            const payload = args[0] ?? {};

            try {
                const response$ = msClient.send(pattern, payload).pipe(timeout(7000));
                const result = await firstValueFrom(response$);

                return await originalMethod.apply(this, [result]);

            } catch (err: any) {

                if (err instanceof TimeoutError) {
                    throw new Error(`[MicroserviceCall] Timeout en patrón "${pattern}"`);
                }

                throw new Error(`[MicroserviceCall] Error microservicio "${pattern}": ${err.message}`);
            }
        };

        return descriptor;
    };
}