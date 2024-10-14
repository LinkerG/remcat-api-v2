import { Controller, Get, Header, Inject, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultService } from './result.service';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Result } from './schemas/result.schema';

@Controller('results')
@ApiTags('Results')
export class ResultController {
    constructor(
        private readonly resultService: ResultService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get("/league/:year")
    @ApiOperation({ description: 'Gets the league result from a specified season' })
    async getLeagueResultByYear(
        @Param("year") year: number
    ): Promise<any[]> {
        return this.resultService.getLeague(year);
    }

    @Get(":id")
    @UseInterceptors(CacheInterceptor)
    @Header('Cache-Control', 'public, max-age=300') // 5min
    @ApiOperation({ description: 'Get all results' })
    async getResultsById(
        @Param("id") id: string
    ): Promise<Result[]> {
        return this.resultService.getResultsById(id);
    }

    @Get(":id/category/:category")
    @UseInterceptors(CacheInterceptor)
    @Header('Cache-Control', 'public, max-age=300') // 5min
    @ApiOperation({ description: 'Get all results' })
    async getResultsByIdAndCategory(
        @Param("id") id: string,
        @Param("category") category: string
    ): Promise<Result[]> {
        return this.resultService.getResultsByIdAndCategory(id, category);
    }
}
