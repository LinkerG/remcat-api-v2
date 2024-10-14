import { Body, Controller, Get, Inject, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompetitionService } from './competition.service';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from '@nestjs/passport';
import { Competition } from './schemas/competition.schema';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { Role } from 'src/auth/schemas/user.schema';
import { QueryCompetitionsDto } from './dto/query-competition.dto';

@Controller('competitions')
@ApiTags('Competitions')
export class CompetitionController {
    constructor(
        private readonly competitionService: CompetitionService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    @ApiOperation({ description: 'Gets all competitions' })
    async find(
        @Query() queryCompetitionsDto: QueryCompetitionsDto
    ): Promise<Competition[]> {
        return this.competitionService.findAll(queryCompetitionsDto);
    }

    @Get("/upcoming")
    @ApiOperation({ description: 'Get upcoming competitions for this year' })
    async findUpcomingByYear(): Promise<Competition[]> {
        const currentDate = new Date(); // Fecha actual
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59); // 31 de diciembre del año en curso

        return this.competitionService.findAll({ date_from: currentDate, date_to: endOfYear });
    }

    @Get("/years")
    @ApiOperation({ description: 'Get years' })
    async getYears(): Promise<number[]> {
        return this.competitionService.getYears();
    }

    @Get("/years/:year")
    @ApiOperation({ description: 'Gets competitions by year' })
    async findByYear(
        @Param("year") year: number
    ): Promise<Competition[]> {
        return this.competitionService.findAll({ date_from: new Date(`${year}-1-1`), date_to: new Date(`${year}-12-31`) });
    }

    @Get(":slug")
    @ApiOperation({ description: 'Get a competition by ID' })
    async findBySlug(
        @Param('slug') slug: string
    ): Promise<Competition> {
        return this.competitionService.findBySlug(slug);
    }

    @Get("/id/:id")
    @ApiOperation({ description: 'Get a competition by ID' })
    async findById(
        @Param('competition_id') competition_id: string
    ): Promise<Competition> {
        return this.competitionService.findById(competition_id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: 'Creates new competition' })
    async create(
        @Req() req,
        @Body() createCompetitionDTO: CreateCompetitionDto
    ): Promise<Competition> {
        const user = req.user;
        if (!user || user.role == Role.USER)
            throw new UnauthorizedException('You must be logged as administrator in to create a competition');
        else {
            return this.competitionService.create(createCompetitionDTO);
        }
    }
}
