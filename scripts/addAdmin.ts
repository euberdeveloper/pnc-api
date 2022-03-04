import './utils/moduleAlias';

import logger from 'euberlog';
import { User, UserRole } from '../source/types';
import { userService, databaseService } from '../source/services';
import databaseConnection from '../source/loaders/databaseConnection';

async function main() {
    try {
        logger.info('Connecting to database...');
        await databaseConnection();
        logger.info('Start creating user');
        const body: Omit<User, 'id' | 'creationDate'> = {
            username: 'euber',
            email: 'euberdeveloper+pnc@gmail.com',
            password: 'XXX',
            role: UserRole.ADMIN
        };
        logger.debug('User is: ', body);
        const id = await userService.create(body);
        logger.success('User created with id: ', id);
    } catch (error: any) {
        logger.error(error);
    } finally {
        await databaseService.disconnect();
    }
}
main();
