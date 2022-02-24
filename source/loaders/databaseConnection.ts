import logger from 'euberlog';
import { databaseService } from '@/services';

export default async function databaseConnection(): Promise<void> {
    logger.debug('Connect to DB');

    try {
        await databaseService.connect();
    } catch (error) {
        logger.error('Error in connecting to database', error);
        throw new Error('Error in connecting to database');
    }
}
