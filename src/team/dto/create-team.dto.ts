import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
    @ApiProperty({
        description: 'Nombre del equipo',
        example: 'Club de Rem Badalona',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({
        description: 'Nombre corto del equipo (slug)',
        example: 'rembadalona',
    })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({
        description: 'Ruta al logotipo del equipo',
        example: 'https://example.com/logo.png',
    })
    @IsString()
    @IsNotEmpty()
    logo: string;
}