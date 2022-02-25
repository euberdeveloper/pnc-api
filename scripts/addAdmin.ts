import logger from 'euberlog';
import { User, UserRole } from '../source/types';
import { userService } from '../source/services';

async function main() {
    try {
        logger.info('Start creating user');
        const body: Omit<User, 'creationDate'> = {
            id: '6218434466fb44e9f3adc1da',
            username: 'admin',
            email: 'euberdeveloper@gmail.com',
            password: 'admin',
            role: UserRole.ADMIN
        };
        logger.debug('User is: ', body);
        const id = await userService.create(body);
        logger.success('User created with id: ', id);
    } catch (error: any) {
        logger.error(error);
    }
}
main();
