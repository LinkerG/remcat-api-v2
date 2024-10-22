import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './schema/team.schema';

@Controller('teams')
@ApiTags('Teams')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo equipo' }) 
    async create(
        @Body() createTeamDto: CreateTeamDto
    ): Promise<Team> {
        return this.teamService.create(createTeamDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor) 
    @ApiOperation({ summary: 'Obtener todos los equipos' })
    async findAll(): Promise<Team[]> {
        return this.teamService.findAll();
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor) 
    @ApiOperation({ summary: 'Obtener un equipo por ID' })
    async findOne(
        @Param('id') id: string
    ): Promise<Team> {
        return this.teamService.findOne(id);
    }

    @Get('/slug/:slug')
    @UseInterceptors(CacheInterceptor) 
    @ApiOperation({ summary: 'Obtener un equipo por slug' })
    async findOneBySlug(
        @Param('slug') slug: string
    ): Promise<Team> {
        return this.teamService.findOneBySlug(slug);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un equipo' })
    async update(
        @Param('id') id: string,
        @Body() updateTeamDto: UpdateTeamDto
    ): Promise<Team> {
        return this.teamService.update(id, updateTeamDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un equipo' })
    async remove(
        @Param('id') id: string
    ): Promise<void> {
        await this.teamService.remove(id);
    }
}
