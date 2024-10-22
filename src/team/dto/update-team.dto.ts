import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
    @ApiProperty({
        description: 'Nombre del equipo',
        example: 'Club de Rem Badalona',
    })
    @IsString()
    @IsOptional()
    name: string;
    
    @ApiProperty({
        description: 'Nombre corto del equipo (slug)',
        example: 'rembadalona',
    })
    @IsString()
    @IsOptional()
    slug: string;

    @ApiProperty({
        description: 'Ruta al logotipo del equipo',
        example: 'https://example.com/logo.png',
    })
    @IsString()
    @IsOptional()
    logo: string;

    @ApiProperty({
        description: 'Indica si el equipo está activo',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}