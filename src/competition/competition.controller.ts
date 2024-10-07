import { Body, Controller, Get, Inject, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompetitionService } from './competition.service';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from '@nestjs/passport';
import { Competition } from './schemas/competition.schema';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { Role } from 'src/auth/schemas/user.schema';
import { QueryCompetitionsDto } from './dto/query-competition.dto';

@Controller('competition')
@ApiTags('Competitions')
export class CompetitionController {
    constructor(
        private readonly competitionService: CompetitionService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    @ApiOperation({ description: 'Gets all competitions' })
    async find(
        @Body() queryCompetitionsDto: QueryCompetitionsDto
    ): Promise<Competition[]> {
        return this.competitionService.findAll(queryCompetitionsDto);
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
