import { HttpModuleAsyncOptions } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const httpConfig: HttpModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
    }),
    inject: [ConfigService],
}
