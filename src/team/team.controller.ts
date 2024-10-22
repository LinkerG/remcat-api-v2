import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './schema/team.schema';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/schemas/user.schema';

@Controller('teams')
@ApiTags('Teams')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo equipo' }) 
    async create(
        @Req() req,
        @Body() createTeamDto: CreateTeamDto
    ): Promise<Team> {
        const user = req.user;
        if (!user || user.role == Role.USER)
            throw new UnauthorizedException('You must be logged as administrator in to create a competition');
        else {
            return this.teamService.create(createTeamDto);
        }
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
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un equipo' })
    async update(
        @Req() req,
        @Param('id') id: string,
        @Body() updateTeamDto: UpdateTeamDto
    ): Promise<Team> {
        const user = req.user;
        if (!user || user.role == Role.USER)
            throw new UnauthorizedException('You must be logged as administrator in to create a competition');
        else {
            return this.teamService.update(id, updateTeamDto);
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un equipo' })
    async remove(
        @Req() req,
        @Param('id') id: string
    ): Promise<void> {
        const user = req.user;
        if (!user || user.role == Role.USER)
            throw new UnauthorizedException('You must be logged as administrator in to create a competition');
        else {
            await this.teamService.remove(id);
        }
    }
}
