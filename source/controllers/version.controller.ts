import { Request, Response } from 'express';

import CONFIG from '@/config';

import { BaseController } from './base';

type VersionControllerConfig = typeof CONFIG;

export class VersionController extends BaseController {
    constructor(private readonly config: VersionControllerConfig) {
        super();
    }

    public get(_req: Request, res: Response): void {
        const version = this.config.API_VERSION;
        res.json(version);
    }
}

export const versionController = new VersionController(CONFIG);
