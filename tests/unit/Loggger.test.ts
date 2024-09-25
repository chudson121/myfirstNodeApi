import { ILogger, LogLevel, LoggerMessage, IDisposable } from './../../src/interfaces/ILogger'; // Adjust import path as needed
import { MockLogger } from './MockLogger'; // You'll need to create this mock implementation
import { describe, test, expect } from "@jest/globals";

describe('ILogger', () => {
  //const consoleSpy = jest.spyOn(console, 'log');  
  // let logger = MockLogger;
  // let consoleSpy = jest.SpyInstance;

  // beforeEach(() => {
  let logger = new MockLogger('TestLogger', LogLevel.Trace);
  let consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  // });

  // afterEach(() => {
  //   consoleSpy.mockRestore();
  // });

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

  test('level-specific methods log messages correctly', () => {
    //const consoleSpy = jest.spyOn(console, 'log');
    const message = { message: 'Test message' };
    
    logger.trace(message);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.critical(message);
  
    expect(consoleSpy).toHaveBeenCalledTimes(6);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('TRACE'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('INFORMATION'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('CRITICAL'));
  
    consoleSpy.mockRestore();
  });

  test('sensitive data is not logged but placeholder is present', () => {
    //const consoleSpy = jest.spyOn(console, 'log');
    const sensitiveMessage = {
      message: 'Log with sensitive data',
      sensitiveData: {
        password: 'secret123',
        creditCard: '1234-5678-9012-3456'
      }
    };

    logger.info(sensitiveMessage);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    
    const loggedMessage = consoleSpy.mock.calls[0][0];

    // Check that sensitive data is not present
    expect(loggedMessage).not.toContain('secret123');
    expect(loggedMessage).not.toContain('1234-5678-9012-3456');

    // Check that placeholder for sensitive data is present
    expect(loggedMessage).toContain('Sensitive Data: [REDACTED]');

    // Check other expected parts of the log message
    expect(loggedMessage).toContain('INFORMATION');
    expect(loggedMessage).toContain('TestLogger');
    expect(loggedMessage).toContain('Log with sensitive data');
  });

  test('non-sensitive data is logged normally', () => {
    const normalMessage = { message: 'Log without sensitive data' };

    logger.info(normalMessage);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    
    const loggedMessage = consoleSpy.mock.calls[0][0];

    // Check that the message is logged normally
    expect(loggedMessage).toContain('INFORMATION');
    expect(loggedMessage).toContain('TestLogger');
    expect(loggedMessage).toContain('Log without sensitive data');

    // Check that there's no mention of sensitive data
    expect(loggedMessage).not.toContain('Sensitive Data: [REDACTED]');
  });

  test('sensitive data in nested objects is not logged', () => {
    const nestedSensitiveMessage = {
      message: 'Log with nested sensitive data',
      sensitiveData: {
        user: {
          name: 'John Doe',
          password: 'verysecret'
        }
      }
    };

    logger.info(nestedSensitiveMessage);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    
    const loggedMessage = consoleSpy.mock.calls[0][0];

    // Check that sensitive data is not present
    expect(loggedMessage).not.toContain('verysecret');

    // Check that placeholder for sensitive data is present
    expect(loggedMessage).toContain('Sensitive Data: [REDACTED]');

    // The non-sensitive parts of the message should still be logged
    expect(loggedMessage).toContain('Log with nested sensitive data');
  });
});