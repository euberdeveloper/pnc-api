// import { Express } from 'express';
// import logger from 'euberlog';

// import logService from '@/services/log.service';

// export default function loadDatabaseLogger(app: Express): void {
//     logger.debug('Database Logger');
//     app.use((req, res, next) => {
//         res.on('finish', () => {
//             logService.log(req, res).catch(error => logger.error('Error in logging request', error));
//         });
//         next();
//     });
// }
