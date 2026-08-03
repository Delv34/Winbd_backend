import {Schema, model, type Document, type Types} from "mongoose"

export type NewsStatus = 'draft' | 'published'

export interface INews extends Document {
    title: string;
    content: string;
    author: Types.ObjectId;
    status: NewsStatus;
    publishAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const newsSchema = new Schema<INews>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    publishAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
})

newsSchema.index({status: 1, publishAt: 1})

export const NewsModel = model<INews>('News', newsSchema)