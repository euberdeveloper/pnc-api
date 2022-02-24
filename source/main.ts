import './utils/moduleAlias';

import * as express from 'express';
import logger from 'euberlog';
import { Loader } from '@/loaders';
import router from '@/api';
// import devMiddleware from '@/utils/developmentMiddleware';
import CONFIG from '@/config';

async function startServer(): Promise<void> {
    logger.hr();
    logger.warning('PREBEN NORWEGIAN COMMUNITY API');

    const app = express();

    // Only on development environment
    // devMiddleware(app);

    const loader = new Loader(app, router);
    loader.loadMiddlewares();
    loader.loadRouter();
    loader.loadErrorHandler();
    await loader.startDatabaseConnection();

    logger.info('Starting server...');
    const port = CONFIG.SERVER.PORT;
    app.listen(port, () => {
        logger.success(`Server listening on port ${port}`);
        logger.hr();
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
startServer();
