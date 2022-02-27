import { Schema, model } from 'mongoose';
import { Group } from '@/types/database';

const schema = new Schema<Group>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        maxPartecipants: { type: Number, required: true },
        creationDate: { type: Date, default: new Date() },
        partecipants: [{ type: Array, default: [] }],
        courseId: { type: String, required: true }
    },
    {
        toJSON: {
            transform: (_doc, obj) => {
                delete obj.__v;
                return obj;
            }
        }
    }
);
schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

export const GroupModel = model<Group>('Group', schema);
