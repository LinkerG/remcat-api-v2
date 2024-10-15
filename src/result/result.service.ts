import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from './schemas/result.schema';
import { Model as MongooseModel } from 'mongoose';
import { sortResults } from 'src/utils/sortResults';
import { CompetitionService } from '../competition/competition.service';

@Injectable()
export class ResultService {
    constructor(
        @InjectModel(Result.name)
        private resultModel: MongooseModel<Result>,
        private competitionService: CompetitionService,
    ) { }

    async getLeague(year: number): Promise<any[]> {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        // Obtener competiciones de tipo liga de esa temporada
        const competitions = await this.competitionService.findAll({
            date_from: startDate,
            date_to: endDate,
            isLeague: true
        });

        if (!competitions || competitions.length === 0) {
            throw new NotFoundException("No competitions found");
        }

        const competitionIds = competitions.map(competition => (competition as any)._id.toString());

        // Obtener resultados de las competiciones
        const results = await this.resultModel.find({
            competition_id: { $in: competitionIds },
            isValid: true,
        }).exec();

        if (!results || results.length === 0) {
            throw new NotFoundException("No results found");
        }

        // Crear estructura de liga
        const leagues = [];

        competitions.forEach((competition) => {
            const boatType = competition.boat_type;
            const resultsForThisCompetition = results.filter(result => result.competition_id.toString() === (competition as any)._id.toString());

            const resultsByCategory = resultsForThisCompetition.reduce((acc, result) => {
                if (!acc[result.category]) acc[result.category] = [];
                acc[result.category].push(result);
                return acc;
            }, {});

            // Para cada categoría en esta competición, ordenar y asignar puntos
            Object.entries(resultsByCategory).forEach(([category, categoryResults]) => {
                const sortedResults = sortResults(categoryResults as Result[]);
                let points = 20;

                sortedResults.forEach((result) => {
                    const teamName = result.teamShortName;

                    let league = leagues.find(league => league.boatType === boatType && league.category === category);

                    if (!league) {
                        league = {
                            boatType,
                            category,
                            leagueSummary: [],
                        };
                        leagues.push(league);
                    }

                    let team = league.leagueSummary.find(team => team.teamName === teamName);

                    if (!team) {
                        team = { teamName, points };
                        league.leagueSummary.push(team);
                    } else {
                        team.points += points;
                    }

                    points = Math.max(points - 1, 0);
                });
            });
        });

        return leagues;
    }

    async getResultsById(id: string): Promise<Result[]> {
        return await this.resultModel.find({ competition_id: id }).exec();
    }

    async getResultsByIdAndCategory(id: string, category: string): Promise<Result[]> {
        return await this.resultModel.find({ competition_id: id, category: category }).exec();
    }
}
