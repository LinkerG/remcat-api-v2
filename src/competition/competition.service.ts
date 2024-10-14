import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { Competition } from './schemas/competition.schema';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { QueryCompetitionsDto } from './dto/query-competition.dto';

@Injectable()
export class CompetitionService {
    constructor(
        @InjectModel(Competition.name)
        private competitionModel: MongooseModel<Competition>,
    ) { }

    async findAll(queryCompetitionsDto: QueryCompetitionsDto): Promise<Competition[]> {
        const filter: any = {};

        if (queryCompetitionsDto.name) {
            filter.name = { $regex: queryCompetitionsDto.name, $options: 'i' };
        }

        if (queryCompetitionsDto.location) {
            filter.location = { $regex: queryCompetitionsDto.location, $options: 'i' };
        }

        if (queryCompetitionsDto.date_from || queryCompetitionsDto.date_to) {
            const startOfDay = (date: string) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0); // Comienza a medianoche (00:00:00)
                return d;
            };

            const endOfDay = (date: string) => {
                const d = new Date(date);
                d.setHours(23, 59, 59, 999); // Finaliza al final del día (23:59:59)
                return d;
            };

            if (queryCompetitionsDto.date_to && !queryCompetitionsDto.date_from) {
                // Solo filtro hasta la fecha final
                filter.date = { $lte: endOfDay(queryCompetitionsDto.date_to.toString()) };
            } else if (queryCompetitionsDto.date_from && !queryCompetitionsDto.date_to) {
                // Solo filtro desde la fecha inicial
                filter.date = { $gte: startOfDay(queryCompetitionsDto.date_from.toString()) };
            } else {
                // Ambos filtros (rango de fechas)
                filter.date = {
                    $gte: startOfDay(queryCompetitionsDto.date_from.toString()), // Desde el inicio del día
                    $lte: endOfDay(queryCompetitionsDto.date_to.toString()),     // Hasta el final del día
                };
            }
        }

        if (queryCompetitionsDto.boat_type) {
            filter.boat_type = queryCompetitionsDto.boat_type;
        }

        if (queryCompetitionsDto.lines) {
            filter.lines = { $in: queryCompetitionsDto.lines };
        }

        if (queryCompetitionsDto.line_distance) {
            filter.line_distance = { $in: queryCompetitionsDto.line_distance };
        }

        if (queryCompetitionsDto.isCancelled !== undefined) {
            filter.isCancelled = queryCompetitionsDto.isCancelled;
        }

        if (queryCompetitionsDto.isLeague !== undefined) {
            filter.isLeague = queryCompetitionsDto.isLeague;
        }

        if (queryCompetitionsDto.isChampionship !== undefined) {
            filter.isChampionship = queryCompetitionsDto.isChampionship;
        }

        if (queryCompetitionsDto.isActive !== undefined) {
            filter.isActive = queryCompetitionsDto.isActive;
        }

        return this.competitionModel.find(filter).exec();
    }

    async findBySlug(slug: string): Promise<Competition> {
        const competition = await this.competitionModel.findOne({ slug: slug }).exec();
        if (!competition) {
            throw new NotFoundException(`Competition with slug ${slug} not found.`);
        }
        return competition;
    }

    async findById(id: string): Promise<Competition> {
        const competition = await this.competitionModel.findById(id).exec();
        if (!competition) {
            throw new NotFoundException(`Competition with ID ${id} not found.`);
        }
        return competition;
    }

    async getYears(): Promise<number[]> {
        const competitions = await this.competitionModel.find().exec();
        const years = competitions.map(competition => competition.date.getFullYear());

        return [...new Set(years)];
    }

    async create(createDeckDto: CreateCompetitionDto): Promise<Competition> {
        const newCompetition = new this.competitionModel(createDeckDto);
        return newCompetition.save();
    }
}
