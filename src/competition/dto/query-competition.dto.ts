import { IsArray, IsEnum, IsOptional, IsString, IsDate, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BoatType } from '../schemas/competition.schema'; // Ajusta la ruta según sea necesario

export class QueryCompetitionsDto {
    @ApiPropertyOptional({
        description: 'Nombre de la competición',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Nombre de la competición', value: 'Gran Regata de Verano' },
        },
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Ubicación de la competición',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Ubicación de la competición', value: 'Playa del Mar' },
        },
    })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({
        description: 'Fecha de la competición',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Fecha de la competición', value: '2024-08-10T00:00:00Z' },
        },
    })
    @IsOptional()
    @IsDate()
    date_from?: Date;

    @ApiPropertyOptional({
        description: 'Fecha de la competición',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Fecha de la competición', value: '2024-08-10T00:00:00Z' },
        },
    })
    @IsOptional()
    @IsDate()
    date_to?: Date;

    @ApiPropertyOptional({
        enum: BoatType,
        description: 'Tipo de barco utilizado en la competición',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Tipo de barco ejemplo', value: BoatType.BATEL },
        },
    })
    @IsOptional()
    @IsEnum(BoatType)
    boat_type?: BoatType;

    @ApiPropertyOptional({
        type: [String],
        description: 'Número de líneas de competición',
        examples: {
            default: { summary: 'No filter', value: [] },
            example: { summary: 'Número de líneas ejemplo', value: [5] },
        },
    })
    @IsOptional()
    @ValidateIf(o => typeof o.lines === 'number' || Array.isArray(o.lines))
    @IsArray()
    lines?: number[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Distancias de cada línea en la competición',
        examples: {
            default: { summary: 'No filter', value: [] },
            example: { summary: 'Distancias de líneas ejemplo', value: [200] },
        },
    })
    @IsOptional()
    @ValidateIf(o => typeof o.line_distance === 'number' || Array.isArray(o.line_distance))
    @IsArray()
    line_distance?: number[];

    @ApiPropertyOptional({
        description: 'Indica si la competición está cancelada',
        required: false,
        default: false,
    })
    @IsOptional()
    isCancelled?: boolean;

    @ApiPropertyOptional({
        description: 'Indica si la competición es parte de una liga',
        required: false,
        default: false,
    })
    @IsOptional()
    isLeague?: boolean;

    @ApiPropertyOptional({
        description: 'Indica si la competición es un campeonato',
        required: false,
        default: false,
    })
    @IsOptional()
    isChampionship?: boolean;

    @ApiPropertyOptional({
        description: 'Indica si la competición está activa',
        required: false,
        default: true,
    })
    @IsOptional()
    isActive?: boolean;
}
