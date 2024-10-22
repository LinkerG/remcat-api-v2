import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Team, TeamSchema } from './schema/team.schema';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { CompetitionModule } from 'src/competition/competition.module';
import { ResultModule } from 'src/result/result.module';

@Module({
  imports: [
      CacheModule.register({
          ttl: 5000, // milliseconds
          max: 100,
      }),
      MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
      AuthModule,
      CompetitionModule,
      ResultModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule { }
