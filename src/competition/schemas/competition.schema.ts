import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';

export enum BoatType {
    BATEL = 'BATEL',
    LLAUT_MED = 'LLAUT_MED',
    LLAGUT_CAT = 'LLAGUT_CAT',
}

export type CompetitionDocument = Competition & Document;

@Schema({ timestamps: true })
export class Competition {
    @Prop()
    name: string;

    @Prop({ unique: true })
    slug: string;

    @Prop()
    location: string;

    @Prop()
    date: Date;

    @Prop()
    boat_type: BoatType;

    @Prop()
    lines: number;

    @Prop()
    line_distance: number;

    @Prop({ default: false })
    isCancelled: boolean;

    @Prop({ default: false })
    isLeague: boolean;

    @Prop({ default: false })
    isChampionship: boolean;

    @Prop({ default: true })
    isActive: boolean;
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);

// Hook para generar el slug antes de guardar el documento
CompetitionSchema.pre<CompetitionDocument>('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});
