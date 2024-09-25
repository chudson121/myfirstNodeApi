import { ILogger, LogLevel, LoggerMessage, LoggerScopeState, IDisposable } from '../../src/interfaces/ILogger'; 

export class MockLogger implements ILogger {
  readonly name: string;
  readonly minLogLevel: LogLevel;
  private scopes: string[] = [];

  constructor(name: string, minLogLevel: LogLevel = LogLevel.Trace) {
    this.name = name;
    this.minLogLevel = minLogLevel;
  }

  isEnabled(logLevel: LogLevel): boolean {
    return logLevel >= this.minLogLevel;
  }

  log(logLevel: LogLevel, message: LoggerMessage): void {
    if (this.isEnabled(logLevel)) {
      const timestamp = new Date().toISOString();
      const scopeString = this.scopes.length > 0 ? `[${this.scopes.join('.')}] ` : '';
      const levelString = LogLevel[logLevel].toUpperCase().padEnd(11);
      const errorString = message.error ? `\nError: ${message.error.stack}` : '';
      
      let sensitiveDataString = '';
      if (message.sensitiveData) {
        sensitiveDataString = '\nSensitive Data: [REDACTED]';
      }

      console.log(`${timestamp} ${levelString} ${this.name} ${scopeString}${message.message}${errorString}${sensitiveDataString}`);
    }
  }

  beginScope<TState extends LoggerScopeState>(state: TState): IDisposable {
    const scopeLabel = state.label || 'Scope';
    this.scopes.push(scopeLabel);
    return {
      dispose: () => {
        const index = this.scopes.lastIndexOf(scopeLabel);
        if (index !== -1) {
          this.scopes.splice(index, 1);
        }
      }
    };
  }

  trace(message: LoggerMessage): void {
    this.log(LogLevel.Trace, message);
  }

  debug(message: LoggerMessage): void {
    this.log(LogLevel.Debug, message);
  }

  info(message: LoggerMessage): void {
    this.log(LogLevel.Information, message);
  }

  warn(message: LoggerMessage): void {
    this.log(LogLevel.Warning, message);
  }

  error(message: LoggerMessage): void {
    this.log(LogLevel.Error, message);
  }

  critical(message: LoggerMessage): void {
    this.log(LogLevel.Critical, message);
  }
}