import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { AxiosContainer } from '@/utils/baseController';
import { handleError } from '@/utils/handleError';

import { AuthController, CoursesController, UsersController, VersionController } from './controllers';

export * from './controllers';

const DEFAULT_ROOT_ENDPOINT = 'http://localhost:3000/api/';

export type ErrorHandler = (error: { error: AxiosError; config: any }) => void | Promise<void>;
export class OperaTN {
    private _token!: string | null;
    private _apiRootEndpoint!: string;
    private _errorHandler!: ErrorHandler | null;
    private _defaultOptions!: AxiosRequestConfig | null;
    private errorHandlerInstance!: number | null;
    public axiosInstance!: AxiosInstance;

    public readonly auth: AuthController;
    public readonly users: UsersController;
    public readonly courses: CoursesController;
    public readonly version: VersionController;

    private axiosContainer!: AxiosContainer;

    constructor(
        apiRootEndpoint = DEFAULT_ROOT_ENDPOINT,
        token: string | null = null,
        errorHandler: ErrorHandler | null = null,
        defaultOptions: AxiosRequestConfig | null = null
    ) {
        this.init(apiRootEndpoint, token, errorHandler, defaultOptions);
        this.axiosContainer = { axiosInstance: this.axiosInstance };

        this.auth = new AuthController(this.axiosContainer);
        this.users = new UsersController(this.axiosContainer);
        this.courses = new CoursesController(this.axiosContainer);
        this.version = new VersionController(this.axiosContainer);
    }

    private init(
        apiRootEndpoint: string,
        token: string | null,
        errorHandler: ErrorHandler | null,
        defaultOptions: AxiosRequestConfig | null
    ): void {
        this._apiRootEndpoint = apiRootEndpoint;
        this._token = token;
        this._defaultOptions = defaultOptions;

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authOpts = token ? { Authorization: `Bearer ${token}` } : {};
        this.axiosInstance = axios.create({
            baseURL: apiRootEndpoint,
            headers: { ...(authOpts as any) },
            ...this.defaultOptions
        });

        if (this.errorHandlerInstance) {
            this.axiosInstance.interceptors.response.eject(this.errorHandlerInstance);
            this.errorHandlerInstance = null;
            this._errorHandler = null;
        }

        this.axiosInstance.interceptors.response.use(
            res => res,
            error => {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw { error: handleError(error), config: error.config };
            }
        );

        if (errorHandler) {
            this.errorHandlerInstance = this.axiosInstance.interceptors.response.use(
                res => res,
                async error => {
                    await errorHandler(error);
                }
            );
            this._errorHandler = errorHandler;
        }
    }

    get apiRootEndpoint(): string {
        return this._apiRootEndpoint;
    }
    set apiRootEndpoint(apiEndpoint: string) {
        this.init(apiEndpoint, this.token, this.errorHandler, this.defaultOptions);
        this.axiosContainer.axiosInstance = this.axiosInstance;
    }

    get token(): string | null {
        return this._token;
    }
    set token(token: string | null) {
        this.init(this.apiRootEndpoint, token, this.errorHandler, this.defaultOptions);
        this.axiosContainer.axiosInstance = this.axiosInstance;
    }

    get errorHandler(): ErrorHandler | null {
        return this._errorHandler;
    }
    set errorHandler(errorHandler: ErrorHandler | null) {
        this.init(this.apiRootEndpoint, this.token, errorHandler, this.defaultOptions);
        this.axiosContainer.axiosInstance = this.axiosInstance;
    }

    get defaultOptions(): AxiosRequestConfig | null {
        return this._defaultOptions;
    }
    set defaultOptions(defaultOptions: AxiosRequestConfig | null) {
        this.init(this.apiRootEndpoint, this.token, this.errorHandler, defaultOptions);
        this.axiosContainer.axiosInstance = this.axiosInstance;
    }
}
