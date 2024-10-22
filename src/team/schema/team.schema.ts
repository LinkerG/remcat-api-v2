import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Team {
    @Prop()
    name: string;

    @Prop()
    slug: string;

    @Prop()
    logo: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
