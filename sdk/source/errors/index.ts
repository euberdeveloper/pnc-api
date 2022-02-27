import { ApiError } from './api-errors';

export * from './api-errors';

export class UnknownApiError extends ApiError {
    constructor(code: number) {
        super(code, 'Unknown api error');
        this.name = 'UnknownApiError';
    }
}

export class RequestError extends Error {
    public __proto__: Error;

    constructor(message = 'Error in request') {
        const trueProto = new.target.prototype;
        super(message);
        this.__proto__ = trueProto;

        this.name = 'RequestError';
    }
}

export class ClientError extends Error {
    public __proto__: Error;

    constructor(message = 'Error in setting up request') {
        const trueProto = new.target.prototype;
        super(message);
        this.__proto__ = trueProto;

        this.name = 'ClientError';
    }
}

export type OperatnError = ApiError | RequestError | ClientError;
