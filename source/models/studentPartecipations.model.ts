import { Schema, model, Types } from 'mongoose';
import { StudentPartecipations } from '@/types/database';

const schema = new Schema<StudentPartecipations>(
    {
        studentId: { type: String, required: true },
        groups: { type: [Types.ObjectId], required: true },
        creationDate: { type: Date, default: new Date() }
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

export const StudentPartecipationsModel = model<StudentPartecipations>('StudentPartecipations', schema);
