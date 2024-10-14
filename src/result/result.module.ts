import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Result, ResultSchema } from './schemas/result.schema';
import { CompetitionModule } from 'src/competition/competition.module';

@Module({
    imports: [
        CacheModule.register({
            ttl: 5000, // milliseconds
            max: 100,
        }),
        MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
        AuthModule,
        CompetitionModule,
    ],
    controllers: [ResultController],
    providers: [ResultService],
    exports: [ResultService],
})
export class ResultModule { }