import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Point } from 'geojson'

import { GetCoordinatesReturnDto } from './dtos/get-coordinates-return.dto'

@Injectable()
export class GeolocationsService {
    protected readonly _apiKey: string

    constructor(
        private readonly _httpService: HttpService,
        private readonly _configService: ConfigService,
    ) {
        this._apiKey = this._configService.get<string>('MAP_API_KEY') as string
    }

    async getCity(point: Point): Promise<string | undefined> {
        try {
            const response = await this._httpService
                .get(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=${this._apiKey}&kind=locality&results=1&geocode=${point.coordinates[0]},${point.coordinates[1]}&format=json`,
                )
                .toPromise()
            return response.data.response.GeoObjectCollection.featureMember[0]
                .GeoObject.name
        } catch (e) {
            return undefined
        }
    }

    async getCoordinates(
        city: string,
    ): Promise<GetCoordinatesReturnDto | undefined> {
        try {
            const response = await this._httpService
                .get(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=${
                        this._apiKey
                    }&format=json&results=1&geocode=${encodeURIComponent(
                        city,
                    )}`,
                )
                .toPromise()
            const coordinates: string[] =
                response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                    ' ',
                )
            const parsedCoordinates = coordinates.map((coordinate) =>
                parseFloat(coordinate),
            )
            const parsedCity: string =
                response.data.response.GeoObjectCollection.featureMember[0]
                    .GeoObject.name
            return {
                point: { type: 'Point', coordinates: parsedCoordinates },
                city: parsedCity,
            }
        } catch (e) {
            return undefined
        }
    }
}
