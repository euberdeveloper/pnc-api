import { Schema, model } from 'mongoose';
import { User } from '@/types/database';

const schema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: new Date() }
});
schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
});

export const UserModel = model<User>('User', schema);
