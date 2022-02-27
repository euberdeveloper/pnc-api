import { InvalidPathParamError } from './InvalidPathParamError';

export class CourseDoesNotExistError extends InvalidPathParamError {
    protected static readonly defaultMessage: string = 'Course does not exist';

    constructor(message = CourseDoesNotExistError.defaultMessage) {
        super(message);
        this.name = 'CourseDoesNotExistError';
    }
}
