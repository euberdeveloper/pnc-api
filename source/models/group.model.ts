import { Schema, model } from 'mongoose';
import { Group } from '@/types/database';

const schema = new Schema<Group>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        maxPartecipants: { type: Number, required: true },
        creationDate: { type: Date, default: new Date() },
        partecipants: [{ type: String, default: [] }],
        courseId: { type: String, required: true }
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false
        }
    }
);
schema.index({ courseId: 1, name: 1 }, { unique: true });
schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

export const GroupModel = model<Group>('Group', schema);
