// src/team/team.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schema/team.schema';
import { CompetitionService } from 'src/competition/competition.service';
import { ResultService } from 'src/result/result.service';

@Injectable()
export class TeamService {
    constructor(
        @InjectModel(Team.name)
        private teamModel: MongooseModel<Team>,
        private competitionService: CompetitionService,
        private resultService: ResultService,
    ) { }

    async create(createTeamDto: CreateTeamDto): Promise<Team> {
        const newTeam = new this.teamModel(createTeamDto);
        return newTeam.save();
    }

    async findAll(): Promise<Team[]> {
        return this.teamModel.find().exec();
    }

    async findOne(id: string): Promise<Team> {
        const team = await this.teamModel.findById(id).exec();
        if (!team) {
            throw new NotFoundException(`Team with ID "${id}" not found`);
        }
        return team;
    }

    async findOneBySlug(slug: string): Promise<Team> {
        const team = await this.teamModel.findOne({ slug }).exec();
        if (!team) {
            throw new NotFoundException(`Team with slug "${slug}" not found`);
        }
        return team;
    }

    async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
        const updatedTeam = await this.teamModel.findByIdAndUpdate(id, updateTeamDto, { new: true }).exec();
        if (!updatedTeam) {
            throw new NotFoundException(`Team with ID "${id}" not found`);
        }
        return updatedTeam;
    }

    async remove(id: string): Promise<void> {
        const result = await this.teamModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Team with ID "${id}" not found`);
        }
    }

    /* --- ESTADISTICA MEDALLERO/PALMARÉS --- */
    async getResume(slug: string): Promise<any[]> {
        const competitions = await this.competitionService.findAll({ isActive: true, isCancelled: false});
        const results = await this.resultService.findValidResults();
    
        if (!competitions || !results) {
          throw new NotFoundException('No competitions or results found');
        }
    
        const championships = competitions.filter(competition => competition.isChampionship);
    
        const teamResume = this.processChampionshipResults(championships, results, slug);
    
        const years = await this.competitionService.getYears();
        for (const year of years) {
          const leagueResults = await this.getLeagueResultsForYear(year, slug);
    
          let yearResume = teamResume.find(yearRes => yearRes.year === year);
          if (!yearResume) {
            teamResume.push({ year, results: leagueResults });
          } else {
            yearResume.results.push(...leagueResults);
          }
        }
    
        return teamResume;
      }
    
      private processChampionshipResults(championships, results, slug) {
        const teamResume = [];
    
        championships.forEach(competition => {
          const year = competition.date.getFullYear();
          const resultsForCompetition = this.filterResultsByCompetition(results, competition._id);
          const competitionResults = this.getCompetitionResults(resultsForCompetition, slug, competition);
    
          let yearResume = teamResume.find(yearRes => yearRes.year === year);
          if (!yearResume) {
            teamResume.push({ year, results: competitionResults });
          } else {
            yearResume.results.push(...competitionResults);
          }
        });
    
        return teamResume;
      }
    
      private filterResultsByCompetition(results, competitionId) {
        return results.filter(result => result.competition_id.toString() === competitionId.toString());
      }
    
      private getCompetitionResults(resultsForCompetition, slug, competition) {
        const resultsByCategory = this.groupResultsByCategory(resultsForCompetition);
        const competitionResults = [];
    
        Object.entries(resultsByCategory).forEach(([category, categoryResults]) => {
          const sortedResults = this.sortResults(categoryResults);
          const position = sortedResults.findIndex((result) => result.team_slug === slug) + 1;
          const result = sortedResults.find(res => res.team_slug === slug);
    
          if (result) {
            competitionResults.push({
              competition_name: competition.name,
              category: result.category,
              position: position,
            });
          }
        });
    
        return competitionResults;
      }
    
      private groupResultsByCategory(results) {
        return results.reduce((acc, result) => {
          if (!acc[result.category]) acc[result.category] = [];
          acc[result.category].push(result);
          return acc;
        }, {});
      }
    
      private async getLeagueResultsForYear(year, team_slug) {
        const leagues = await this.resultService.getLeague(year);
        const leagueResults = [];
    
        leagues.forEach(league => {
          const sortedResults = league.league_summary.sort((a, b) => b.points - a.points);
          const position = sortedResults.findIndex((result) => result.team_slug === team_slug) + 1;
    
          leagueResults.push({
            competition_name: league.boat_type,
            category: league.category,
            position: position,
          });
        });
    
        return leagueResults;
      }
    
      private sortResults(results) {
        return results.sort((a, b) => a.time - b.time); // Por ejemplo, puedes ajustar cómo ordenar los resultados
      }
}
