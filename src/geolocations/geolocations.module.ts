import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { httpConfig } from '../config/http.config'

import { GeolocationsService } from './geolocations.service'

@Module({
    imports: [HttpModule.registerAsync(httpConfig), ConfigModule],
    providers: [GeolocationsService],
    exports: [GeolocationsService],
})
export class GeolocationsModule {}
