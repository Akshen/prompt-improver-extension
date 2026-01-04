/**
 * Logging utility for debugging
 * Prefixes all logs with [PromptImprover] for easy filtering
 */

const PREFIX = '[PromptImprover]';
const DEBUG_ENABLED = true; // Set to false in production

export const logger = {
  info: (...args: unknown[]) => {
    console.log(PREFIX, ...args);
  },

  warn: (...args: unknown[]) => {
    console.warn(PREFIX, ...args);
  },

  error: (...args: unknown[]) => {
    console.error(PREFIX, ...args);
  },

  debug: (...args: unknown[]) => {
    if (DEBUG_ENABLED) {
      console.debug(PREFIX, ...args);
    }
  }
};