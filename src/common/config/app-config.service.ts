import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HTTP_CONFIG_TOKEN,
  JWT_CONFIG_TOKEN,
  MONGOOSE_CONFIG_TOKEN,
  MICROSERVICE_CONFIG_TOKEN,
  HttpConfig,
  JwtConfig,
  MongooseConfig,
  MicroserviceConfig
} from '../../configuration';

/**
 * Centralized Configuration Service
 * Provides typed access to all application configurations
 * Uses NestJS ConfigService with injection tokens
 */
@Injectable()
export class AppConfigService {
  private httpConfig: HttpConfig;
  private jwtConfig: JwtConfig;
  private mongooseConfig: MongooseConfig;
  private microserviceConfig: MicroserviceConfig;

  constructor(private readonly configService: ConfigService) {
    this.initializeConfigs();
  }

  /**
   * Initialize all configurations
   * Called once during service instantiation
   */
  private initializeConfigs(): void {
    this.httpConfig = this.configService.get<HttpConfig>(HTTP_CONFIG_TOKEN);
    this.jwtConfig = this.configService.get<JwtConfig>(JWT_CONFIG_TOKEN);
    this.mongooseConfig = this.configService.get<MongooseConfig>(MONGOOSE_CONFIG_TOKEN);
    this.microserviceConfig = this.configService.get<MicroserviceConfig>(MICROSERVICE_CONFIG_TOKEN);

    if (!this.httpConfig || !this.jwtConfig || !this.mongooseConfig || !this.microserviceConfig) {
      throw new Error('Failed to load required configurations');
    }
  }

  /**
   * Get HTTP Configuration
   */
  getHttpConfig(): HttpConfig {
    return this.httpConfig;
  }

  /**
   * Get HTTP running port
   */
  getRunningPort(): number {
    return this.httpConfig.RUNNING_PORT;
  }

  /**
   * Get CORS origins
   */
  getCorsOrigins(): string[] | string {
    return this.httpConfig.CORS_ORIGINS;
  }
  /**
   * Check if authentication is enabled
   */
  isAuthEnabled(): boolean {
    return this.httpConfig.ENABLE_AUTH;
  }
  /**
   * Get JWT Configuration
   */
  getJwtConfig(): JwtConfig {
    return this.jwtConfig;
  }

  /**
   * Get JWT seed
   */
  getJwtSeed(): string {
    return this.jwtConfig.JWT_SEED;
  }

  /**
   * Get MongoDB Configuration
   */
  getMongooseConfig(): MongooseConfig {
    return this.mongooseConfig;
  }

  /**
   * Get MongoDB connection URI
   */
  getMongoUri(): string {
    return this.mongooseConfig.DB_URI;
  }

  /**
   * Get Microservice Configuration
   */
  getMicroserviceConfig(): MicroserviceConfig {
    return this.microserviceConfig;
  }

  /**
   * Get Microservice host
   */
  getHost(): string {
    return this.microserviceConfig.SERVER_HOST;
  }

  /**
   * Get Microservice port
   */
  getMicroservicePort(): number {
    return this.microserviceConfig.MICROSERVICE_PORT;
  }
}
