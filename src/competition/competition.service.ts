import { Injectable } from '@nestjs/common';
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
            if (queryCompetitionsDto.date_to && !queryCompetitionsDto.date_from) {
                // Solo filtro hasta la fecha final
                filter.date = { $lte: new Date(queryCompetitionsDto.date_to) };
            } else if (queryCompetitionsDto.date_from && !queryCompetitionsDto.date_to) {
                // Solo filtro desde la fecha inicial
                filter.date = { $gte: new Date(queryCompetitionsDto.date_from) };
            } else {
                // Ambos filtros
                filter.date = {
                    $gte: new Date(queryCompetitionsDto.date_from), // Desde
                    $lte: new Date(queryCompetitionsDto.date_to),   // Hasta
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

    async create(createDeckDto: CreateCompetitionDto): Promise<Competition> {
        const newCompetition = new this.competitionModel(createDeckDto);
        return newCompetition.save();
    }
}
