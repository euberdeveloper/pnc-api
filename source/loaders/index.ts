import { Express, Router } from 'express';

import logger from 'euberlog';

import loadMorgan from './morgan';
import loadHelmet from './helmet';
import loadCors from './cors';
import loadBodyParser from './bodyParser';
import loadCookieParser from './cookieParser';
import loadSession from './session';
import loadPassport from './passport';

import getErrorHandler from './errorHandler';
import databaseConnection from './databaseConnection';

export class Loader {
    private readonly app: Express;
    private readonly router: () => Router;

    constructor(app: Express, router: () => Router) {
        this.app = app;
        this.router = router;
    }

    public async loadMiddlewares(): Promise<void> {
        logger.hr();
        logger.info('Loading middlewares');

        loadMorgan(this.app);
        loadCors(this.app);
        loadHelmet(this.app);
        loadBodyParser(this.app);
        loadCookieParser(this.app);
        await loadSession(this.app);
        loadPassport(this.app);

        logger.success('Middlewares loaded');
        logger.hr();
    }

    public loadRouter(): void {
        logger.hr();
        logger.info('Handling routes...');

        this.app.use('/api', this.router());

        logger.success('Handled routes');
        logger.hr();
    }

    public loadErrorHandler(): void {
        logger.hr();
        logger.info('Loading error handler');

        this.app.use(getErrorHandler());

        logger.success('Error handler loaded');
        logger.hr();
    }

    public async startDatabaseConnection(): Promise<void> {
        logger.hr();
        logger.info('Starting database connection');

        await databaseConnection();

        logger.success('Started database connection');
        logger.hr();
    }
}
