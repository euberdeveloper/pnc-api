import * as mongoose from 'mongoose';

import { UserModel, GroupModel, StudentPartecipationsModel } from '@/models';
import CONFIG from '@/config';

interface DatabaseServiceOptions {
    databaseUri: string;
}

export class DatabaseService {
    public connection: typeof mongoose | null = null;

    constructor(
        private readonly options: DatabaseServiceOptions,
        public readonly userModel = UserModel,
        public readonly groupModel = GroupModel,
        public readonly studentPartecipationsModel = StudentPartecipationsModel
    ) {}

    public async connect(): Promise<void> {
        this.connection = await mongoose.connect(this.options.databaseUri);
    }

    public async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}

export const databaseService = new DatabaseService({
    databaseUri: CONFIG.MONGODB.URI
});
