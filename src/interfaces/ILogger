export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5,
    None = 6,
  }
  
  export interface LoggerMessage {
    error?: Error;
    message: string;
    sensitiveData?: Record<string, unknown>;
    [key: string]: unknown;
  }
  
  export interface ILogger {
    readonly name: string;
    readonly minLogLevel: LogLevel;
  
    /**
     * Begins a logical operation scope.
     * @param state - The identifier for the scope.
     * @returns A disposable scope object.
     */
    beginScope<TState extends LoggerScopeState>(state: TState): IDisposable;
  
    /**
     * Checks if the given {@link LogLevel} is enabled.
     * @param logLevel
     */
    isEnabled(logLevel: LogLevel): boolean;
  
    /**
     * Formats and writes a log message at the specified log level.
     * @param logLevel - Entry will be written on this level.
     * @param message - Object representing all the properties of the message.
     */
    log(logLevel: LogLevel, message: LoggerMessage): void;
  
    /**
     * Formats and writes a critical log message.
     * @param message - Object representing all the properties of the message.
     */
    critical(message: LoggerMessage): void;
  
    /**
     * Formats and writes a debug log message.
     * @param message - Object representing all the properties of the message.
     */
    debug(message: LoggerMessage): void;
  
    /**
     * Formats and writes an error log message.
     * @param message - Object representing all the properties of the message.
     */
    error(message: LoggerMessage): void;
  
    /**
     * Formats and writes an information log message.
     * @param message - Object representing all the properties of the message.
     */
    info(message: LoggerMessage): void;
  
    /**
     * Formats and writes a trace log message.
     * @param message - Object representing all the properties of the message.
     */
    trace(message: LoggerMessage): void;
  
    /**
     * Formats and writes a warning log message.
     * @param message - Object representing all the properties of the message.
     */
    warn(message: LoggerMessage): void;
  }
  
  export interface LoggerScopeState {
    label?: string;
    collapsed?: boolean;
    messagePrefix?: string;
    messageSuffix?: string;
    [key: string]: unknown;
  }
  
  export interface IDisposable {
    dispose(): void;
  }