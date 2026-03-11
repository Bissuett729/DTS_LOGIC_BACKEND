import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { availableMsClients } from "./client.data";

@Injectable()
export class TcpClientsService implements OnModuleInit {
    private readonly logger = new Logger(TcpClientsService.name)
        constructor(
        @Inject(availableMsClients.user) public readonly userProxyMs: ClientProxy,
        @Inject(availableMsClients.websocat) public readonly websocatProxyMs: ClientProxy,
    ) {}

    async onModuleInit() {
        try {
            await firstValueFrom(this.userProxyMs.send('healthcheck', {}));
            await firstValueFrom(this.websocatProxyMs.send('healthcheck', {}));
            this.logger.log(`Connected to ${availableMsClients.user}`);
            this.logger.log(`Connected to ${availableMsClients.websocat}`);
        } catch (error) {
            this.logger.error(`Error to connect ${availableMsClients.user}`, error);
            this.logger.error(`Error to connect ${availableMsClients.websocat}`, error);
        }
    }
}
