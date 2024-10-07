import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BoatType } from '../schemas/competition.schema';

export class CreateCompetitionDto {
    @ApiProperty({
        description: 'Nombre de la competición',
        example: 'Campionat de Catalunya de LLagut Català',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Ubicación de la competición',
        example: 'Lloret de mar',
    })
    @IsString()
    location?: string;

    @ApiProperty({
        description: 'Fecha de la competición en formato ISO (YYYY-MM-DD)',
        example: '2024-08-10',
    })
    @IsNotEmpty()
    date: Date;

    @ApiProperty({
        description: 'Tipo de barco utilizado en la competición',
        enum: BoatType,
        example: BoatType.LLAGUT_CAT,
    })
    @IsEnum(BoatType)
    boat_type: BoatType;

    @ApiProperty({
        description: 'Número de calles de la regata',
        example: 4,
    })
    @IsNumber()
    lines: number;

    @ApiProperty({
        description: 'Distancia entre boyas',
        example: 500,
    })
    @IsNumber()
    line_distance: number;

    @ApiProperty({
        description: 'Indica si la competición está cancelada',
        default: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isCancelled?: boolean;

    @ApiProperty({
        description: 'Indica si la competición es parte de una liga',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isLeague?: boolean;

    @ApiProperty({
        description: 'Indica si la competición es un campeonato',
        required: false,
        default: false,
    })
    @IsBoolean()
    @IsOptional()
    isChampionship?: boolean;

    @ApiProperty({
        description: 'Indica si la competición está activa',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
