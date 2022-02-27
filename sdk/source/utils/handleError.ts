import { AxiosError } from 'axios';
import * as errors from '@/errors';

interface ReponseError {
    name: string;
    message: string;
    details: any;
}

function instanceApiError(error: ReponseError, code: number): errors.ApiError {
    try {
        return new (errors as any)[error.name](error.message, error.details);
    } catch {
        return new errors.UnknownApiError(code);
    }
}

export function handleError(error: AxiosError): errors.OperatnError {
    if (error.response) {
        return instanceApiError(error.response.data, error.response.status);
    } else if (error.request) {
        console.warn(error.request);
        return new errors.RequestError(error.request?.message ?? undefined);
    } else {
        console.warn(error);
        return new errors.ClientError(error.message);
    }
}
