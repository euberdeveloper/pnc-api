import { InvalidPathParamError } from '@/errors';

export class BaseService {
    protected validateRequiredParam(param: any): string {
        if (!param || typeof param !== 'string') {
            throw new InvalidPathParamError();
        }
        return param;
    }
}
