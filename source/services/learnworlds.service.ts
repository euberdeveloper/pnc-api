import CONFIG from '@/config';

interface LearnWorldsServiceOptions {
    learnworlds: typeof CONFIG.LEARNWORLDS;
}

export class LearnWorldsService {
    constructor(private readonly options: LearnWorldsServiceOptions) {}

    
}

export const userService = new LearnWorldsService({
    learnworlds: CONFIG.LEARNWORLDS
});
