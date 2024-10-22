// src/team/team.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schema/team.schema';

@Injectable()
export class TeamService {
    constructor(
        @InjectModel(Team.name)
        private teamModel: MongooseModel<Team>,
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
}
