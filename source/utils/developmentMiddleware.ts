import * as express from 'express';
import corsLoader from '@/loaders/cors';
import CONFIG from '@/config';

export default function (app: express.Express): void {
    if (CONFIG.NODE_ENV === 'development') {
        corsLoader(app);
    }
}
