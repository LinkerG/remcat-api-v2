import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from './schemas/result.schema';
import { Model as MongooseModel } from 'mongoose';
import { sortResults } from 'src/utils/sortResults';
import { CompetitionService } from '../competition/competition.service';
import { CreateResultDto } from './dto/create-result.dto';
import { Competition } from 'src/competition/schemas/competition.schema';

@Injectable()
export class ResultService {
    constructor(
        @InjectModel(Result.name)
        private resultModel: MongooseModel<Result>,
        private competitionService: CompetitionService,
    ) { }

    async getResultsById(id: string): Promise<Result[]> {
        return await this.resultModel.find({ competition_id: id }).exec();
    }

    async getResultsByIdAndCategory(id: string, category: string): Promise<Result[]> {
        return await this.resultModel.find({ competition_id: id, category: category }).exec();
    }

    async createResults(competition_id: string, category: string, results: CreateResultDto[]): Promise<Result[]> {
        if (!Array.isArray(results)) {
            const singleResult: CreateResultDto = results
            console.log(singleResult);
            const insertedResult = await this.resultModel.create({
                competition_id,
                category,
                team_slug: singleResult.team_slug,
                team_number: singleResult.team_number,
                time: singleResult.time,
                group: singleResult.group,
                isFinal: singleResult.isFinal,
                isValid: true,
            });

            return [insertedResult];
        }

        const newResults = results.map(result => ({
            // Se añaden al DTO los datos pasados por parametro en la URL del endpoint
            competition_id,
            category,
            team_slug: result.team_slug,
            team_number: result.team_number,
            time: result.time,
            group: result.group,
            isFinal: result.isFinal,
            isValid: true,
        }));
    
        return await this.resultModel.insertMany(newResults);
    }

    // ESTADISTICA DE LIGA
    async getLeague(year: number): Promise<any[]> {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);
    
        const competitions = await this.getCompetitionsForLeague(startDate, endDate);
    
        if (!competitions.length) {
            throw new NotFoundException("No competitions found");
        }
    
        const competitionIds = competitions.map(competition => (competition as any)._id.toString());
    
        const results = await this.getResultsForCompetitions(competitionIds);
    
        if (!results.length) {
            throw new NotFoundException("No results found");
        }
    
        return this.buildLeagueStructure(competitions, results);
    }
    
    private async getCompetitionsForLeague(startDate: Date, endDate: Date): Promise<Competition[]> {
        return this.competitionService.findAll({
            date_from: startDate,
            date_to: endDate,
            isLeague: true,
        });
    }
    
    private async getResultsForCompetitions(competitionIds: string[]): Promise<Result[]> {
        return this.resultModel.find({
            competition_id: { $in: competitionIds },
            isValid: true,
        }).exec();
    }
    
    private buildLeagueStructure(competitions: Competition[], results: Result[]): any[] {
        const leagues = [];
    
        competitions.forEach((competition) => {
            const boatType = competition.boat_type;
            const resultsForThisCompetition = this.filterResultsByCompetition(results, competition);
    
            const resultsByCategory = this.groupResultsByCategory(resultsForThisCompetition);
    
            Object.entries(resultsByCategory).forEach(([category, categoryResults]) => {
                const sortedResults = sortResults(categoryResults as Result[]);
                this.assignPointsToTeams(leagues, sortedResults, boatType, category);
            });
        });
    
        return leagues;
    }
    
    private filterResultsByCompetition(results: Result[], competition: Competition): Result[] {
        return results.filter(result => result.competition_id.toString() === (competition as any)._id.toString());
    }
    
    private groupResultsByCategory(results: Result[]): Record<string, Result[]> {
        return results.reduce((acc, result) => {
            if (!acc[result.category]) acc[result.category] = [];
            acc[result.category].push(result);
            return acc;
        }, {});
    }
    
    private assignPointsToTeams(leagues: any[], sortedResults: Result[], boatType: string, category: string) {
        let points = 20;
    
        sortedResults.forEach((result) => {
            const { team_slug, team_number } = result;
    
            let league = leagues.find(league => league.boatType === boatType && league.category === category);
    
            if (!league) {
                league = {
                    boatType,
                    category,
                    leagueSummary: [],
                };
                leagues.push(league);
            }
    
            let team = league.leagueSummary.find(team => team.team_slug === team_slug && team.team_number === team_number);
    
            if (!team) {
                team = { team_slug, team_number, points };
                league.leagueSummary.push(team);
            } else {
                team.points += points;
            }
    
            points = Math.max(points - 1, 0);
        });
    }
    
}
