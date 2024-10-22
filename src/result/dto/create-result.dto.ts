import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateResultDto {
    @ApiProperty({
        description: 'Nombre corto del equipo (slug)',
        example: 'rembadalona',
    })
    @IsString()
    @IsNotEmpty()
    team_slug: string;

    @ApiProperty({
        description: 'Numero del equipo en caso de que haya varios (0 en caso de que no haya mas de 1)',
        example: 0,
    })
    @IsNumber()
    @IsOptional()
    team_number?: number;

    @ApiProperty({
        description: 'Tiempo en formato MM:SS:MSMS o DNF/DNS en caso de tiempos invalidos',
        example: '7:15:23',
    })
    @IsString()
    @IsNotEmpty()
    time: string;

    @ApiProperty({
        description: 'Manga de la competicion en la que participa (0 si es indiferente o cronometrada)',
        example: 0,
    })
    @IsNumber()
    @IsOptional()
    group?: number;

    @ApiProperty({
        description: 'Indica si es final o semifinal / Sirve para el medallero y el recuento de puntos de la liga',
        example: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    isFinal: boolean;

    @ApiProperty({
        description: 'Indica si el resultado es valido y puede ser contabilizado',
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    isValid: boolean;
}
