import { Schema, model } from 'mongoose';
import { Group } from '@/types/database';

const schema = new Schema<Group>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        maxPartecipants: { type: Number, required: true },
        creationDate: { type: Date, default: new Date() },
        partecipants: [{ type: String, default: [] }],
        lecturePeriod: {
            type: {
                start: { type: Date, required: true },
                end: { type: Date, required: true }
            },
            required: true
        },
        weekSchedule: {
            type: {
                monday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                tuesday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                wednesday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                thursday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                friday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                saturday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                },
                sunday: {
                    type: { from: { type: String, required: true }, to: { type: String, required: true } },
                    required: false
                }
            },
            required: true
        },
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
