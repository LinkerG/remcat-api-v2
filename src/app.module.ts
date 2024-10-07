import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RemoveHeaderMiddleware } from './middleware/remove-header.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CompetitionModule } from './competition/competition.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(
            process.env.NODE_ENV === 'test'
                ? process.env.TEST_URI
                : process.env.MONGO_URI,
        ),
        AuthModule,
        CompetitionModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RemoveHeaderMiddleware).forRoutes('*');
    }
}
