export enum ErrorType {
    COMMAND_EXECUTION = 'command_execution',
    CONFIGURATION = 'configuration',
    API = 'api',
    UNKNOWN = 'unknown'
}

export class ShellSageError extends Error {
    constructor(
        message: string,
        public readonly type: ErrorType = ErrorType.UNKNOWN,
        public readonly cause?: Error
    ) {
        super(message);
        this.name = 'ShellSageError';
    }
}

export function isShellSageError(error: unknown): error is ShellSageError {
    return error instanceof ShellSageError;
}

export function createError(message: string, type: ErrorType = ErrorType.UNKNOWN, cause?: Error): ShellSageError {
    return new ShellSageError(message, type, cause);
}
