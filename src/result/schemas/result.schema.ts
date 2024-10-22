import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Result {
    @Prop()
    competition_id: string;

    @Prop()
    team_slug: string;

    @Prop({ default: 0 })
    team_number: number;

    @Prop()
    category: string;

    @Prop()
    time: string;

    @Prop({ default: 0 })
    group: number;

    @Prop()
    isFinal: boolean;

    @Prop()
    isValid: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
