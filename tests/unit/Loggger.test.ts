import { ILogger, LogLevel, LoggerMessage, IDisposable } from './logger'; // Adjust import path as needed
import { MockLogger } from './mock-logger'; // You'll need to create this mock implementation

describe('ILogger', () => {
  let logger: ILogger;

  beforeEach(() => {
    logger = new MockLogger('TestLogger', LogLevel.Trace);
  });

  test('name property returns correct logger name', () => {
    expect(logger.name).toBe('TestLogger');
  });

  test('minLogLevel property returns correct minimum log level', () => {
    expect(logger.minLogLevel).toBe(LogLevel.Trace);
  });

  test('isEnabled returns true for levels above or equal to minLogLevel', () => {
    expect(logger.isEnabled(LogLevel.Trace)).toBe(true);
    expect(logger.isEnabled(LogLevel.Information)).toBe(true);
    expect(logger.isEnabled(LogLevel.Critical)).toBe(true);
  });

  test('isEnabled returns false for levels below minLogLevel', () => {
    const warnLogger = new MockLogger('WarnLogger', LogLevel.Warning);
    expect(warnLogger.isEnabled(LogLevel.Trace)).toBe(false);
    expect(warnLogger.isEnabled(LogLevel.Debug)).toBe(false);
    expect(warnLogger.isEnabled(LogLevel.Information)).toBe(false);
  });

  test('log method calls appropriate level-specific method', () => {
    const message: LoggerMessage = { message: 'Test message' };
    
    logger.log(LogLevel.Debug, message);
    expect(logger.debug).toHaveBeenCalledWith(message);

    logger.log(LogLevel.Error, message);
    expect(logger.error).toHaveBeenCalledWith(message);
  });

  test('level-specific methods log messages correctly', () => {
    const message: LoggerMessage = { message: 'Test message' };
    
    logger.trace(message);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.critical(message);

    expect(logger.getLoggedMessages()).toEqual([
      { level: LogLevel.Trace, message },
      { level: LogLevel.Debug, message },
      { level: LogLevel.Information, message },
      { level: LogLevel.Warning, message },
      { level: LogLevel.Error, message },
      { level: LogLevel.Critical, message },
    ]);
  });

  test('beginScope returns an IDisposable object', () => {
    const scope = logger.beginScope({ label: 'TestScope' });
    expect(scope).toHaveProperty('dispose');
    expect(typeof scope.dispose).toBe('function');
  });

  test('scope affects logged messages', () => {
    const scope = logger.beginScope({ label: 'TestScope' });
    logger.info({ message: 'In scope' });
    scope.dispose();
    logger.info({ message: 'Out of scope' });

    const loggedMessages = logger.getLoggedMessages();
    expect(loggedMessages[0].scope).toBe('TestScope');
    expect(loggedMessages[1].scope).toBeUndefined();
  });

  test('nested scopes work correctly', () => {
    const outerScope = logger.beginScope({ label: 'OuterScope' });
    logger.info({ message: 'In outer scope' });
    
    const innerScope = logger.beginScope({ label: 'InnerScope' });
    logger.info({ message: 'In inner scope' });
    
    innerScope.dispose();
    logger.info({ message: 'Back in outer scope' });
    
    outerScope.dispose();
    logger.info({ message: 'Out of all scopes' });

    const loggedMessages = logger.getLoggedMessages();
    expect(loggedMessages[0].scope).toBe('OuterScope');
    expect(loggedMessages[1].scope).toBe('OuterScope.InnerScope');
    expect(loggedMessages[2].scope).toBe('OuterScope');
    expect(loggedMessages[3].scope).toBeUndefined();
  });

  test('sensitive data is handled correctly', () => {
    const message: LoggerMessage = {
      message: 'Sensitive data test',
      sensitiveData: { password: '12345' }
    };

    logger.info(message);
    const loggedMessage = logger.getLoggedMessages()[0];
    
    expect(loggedMessage.message).toContain('Sensitive data test');
    expect(loggedMessage.sensitiveData).toBeUndefined();
  });
});