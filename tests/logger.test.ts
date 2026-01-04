import { logger } from '../src/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should prefix info logs', () => {
    logger.info('test message');
    expect(console.log).toHaveBeenCalledWith('[PromptImprover]', 'test message');
  });

  test('should prefix warn logs', () => {
    logger.warn('test warning');
    expect(console.warn).toHaveBeenCalledWith('[PromptImprover]', 'test warning');
  });

  test('should prefix error logs', () => {
    logger.error('test error');
    expect(console.error).toHaveBeenCalledWith('[PromptImprover]', 'test error');
  });

  test('should handle multiple arguments', () => {
    logger.info('message', 123, { key: 'value' });
    expect(console.log).toHaveBeenCalledWith(
      '[PromptImprover]',
      'message',
      123,
      { key: 'value' }
    );
  });
});