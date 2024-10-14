import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Result {
    @Prop()
    competition_id: string;

    @Prop()
    teamShortName: string;

    @Prop()
    category: string;

    @Prop()
    time: string;

    @Prop()
    isFinal: boolean;

    @Prop()
    isValid: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
