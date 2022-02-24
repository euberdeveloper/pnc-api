import * as mongoose from 'mongoose';

import { UserModel } from '@/models';
import CONFIG from '@/config';

interface DatabaseServiceOptions {
    databaseUri: string;
}

export class DatabaseService {
    public connection: typeof mongoose | null = null;

    constructor(private readonly options: DatabaseServiceOptions, public readonly userModel = UserModel) {}

    public async connect(): Promise<void> {
        this.connection = await mongoose.connect(this.options.databaseUri);
    }
}

export const databaseService = new DatabaseService({
    databaseUri: CONFIG.MONGODB.URI
});