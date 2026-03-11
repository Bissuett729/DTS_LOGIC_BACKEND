import { AppConfigService } from "../config/app-config.service";
import { toolcolor } from "../global";

export function logStartup(appConfig: AppConfigService, port: number, path: string) {
    console.log(`${toolcolor.yellow}******************************************************${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}* RUNNING PORT            : ${toolcolor.green}${port}${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}* MICROSERVICE PORT       : ${toolcolor.green}${appConfig.getMicroservicePort()}${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}* SERVER IP               : ${toolcolor.red}${appConfig.getHost()}${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}* SWAGGER PATH            : ${toolcolor.magenta}http://${appConfig.getHost()}:${port}${path}${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}* GraphQL PATH            : ${toolcolor.magenta}http://${appConfig.getHost()}:${port}/graphql${toolcolor.reset}`);
    console.log(`${toolcolor.yellow}******************************************************${toolcolor.reset}`);
}