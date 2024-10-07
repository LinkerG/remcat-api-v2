import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { Competition, CompetitionSchema } from './schemas/competition.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        CacheModule.register({
            ttl: 5000, // milliseconds
            max: 100,
        }),
        MongooseModule.forFeature([{ name: Competition.name, schema: CompetitionSchema }]),
        AuthModule,
    ],
    controllers: [CompetitionController],
    providers: [CompetitionService],
    exports: [CompetitionService],
})
export class CompetitionModule { }
