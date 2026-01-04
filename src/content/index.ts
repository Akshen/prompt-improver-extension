import { detectPlatform, findInputElement, getInputText, setInputText } from './platform-detector';
import { analyzePrompt } from './prompt-analyzer';
import { SuggestionWidget } from './suggestion-widget';
import { logger } from '../utils/logger';

/**
 * Main content script
 * Orchestrates the entire extension functionality
 */

let widget: SuggestionWidget | null = null;
let inputElement: HTMLElement | null = null;
let lastAnalyzedText = '';
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let mutationObserver: MutationObserver | null = null;

/**
 * Initialize the extension
 */
function init(): void {
  const platform = detectPlatform();
  logger.info(`Initialized on platform: ${platform}`);

  // Set up MutationObserver to watch for DOM changes
  setupDOMObserver();

  // Find and set up initial input element
  setupInputElement();

  // Also retry after delay in case DOM is still loading
  setTimeout(() => {
    if (!inputElement) {
      setupInputElement();
    }
  }, 2000);
}

/**
 * Set up MutationObserver to detect when input element changes
 */
function setupDOMObserver(): void {
  // Watch for changes in the entire document
  mutationObserver = new MutationObserver((mutations) => {
    // Check if our input element still exists in the DOM
    if (inputElement && !document.contains(inputElement)) {
      logger.warn('Input element was removed from DOM, re-initializing...');
      removeListeners();
      inputElement = null;
      
      // Try to find the new input element
      setTimeout(() => setupInputElement(), 100);
    }
  });

  // Start observing
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  logger.debug('DOM observer set up');
}

/**
 * Find input element and set up listeners
 */
function setupInputElement(): void {
  inputElement = findInputElement();

  if (!inputElement) {
    logger.warn('Input element not found');
    return;
  }

  logger.debug('Input element found, setting up listeners');
  setupListeners();
}

/**
 * Remove listeners from old input element
 */
function removeListeners(): void {
  if (!inputElement) return;

  logger.debug('Removing old listeners');
  
  // Clone and replace to remove all event listeners
  // This is a simple way to remove all listeners at once
  const newElement = inputElement.cloneNode(true) as HTMLElement;
  inputElement.parentNode?.replaceChild(newElement, inputElement);
}

/**
 * Set up event listeners on input element
 */
function setupListeners(): void {
  if (!inputElement) return;

  logger.debug('Setting up listeners');

  // Listen for input changes (debounced)
  inputElement.addEventListener('input', handleInput);

  // Listen for focus (show widget if text exists)
  inputElement.addEventListener('focus', () => {
    const text = getInputText(inputElement!);
    if (text.trim().length > 10) {
      handleAnalysis();
    }
  });

  // Keyboard shortcut: Ctrl/Cmd + Shift + A to analyze
  document.addEventListener('keydown', handleKeyboardShortcut);

  logger.info('Listeners set up successfully');
}

/**
 * Handle keyboard shortcut
 */
function handleKeyboardShortcut(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    handleAnalysis();
  }
}

/**
 * Handle input changes (debounced)
 */
function handleInput(): void {
  if (!inputElement) return;

  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Debounce for 1 second
  debounceTimer = setTimeout(() => {
    const text = getInputText(inputElement!);
    
    // Only analyze if text length is reasonable and changed
    if (text.trim().length >= 10 && text !== lastAnalyzedText) {
      handleAnalysis();
    }
  }, 1000);
}

/**
 * Perform analysis and show widget
 */
function handleAnalysis(): void {
  // Re-check if input element still exists
  if (!inputElement || !document.contains(inputElement)) {
    logger.warn('Input element no longer in DOM, re-finding...');
    inputElement = findInputElement();
    
    if (!inputElement) {
      logger.error('Could not find input element for analysis');
      return;
    }
  }

  const text = getInputText(inputElement);
  
  if (text.trim().length < 10) {
    logger.debug('Text too short to analyze');
    return;
  }

  lastAnalyzedText = text;
  logger.debug('Analyzing prompt...', { length: text.length });

  // Perform analysis
  const analysis = analyzePrompt(text);

  // Create widget if it doesn't exist
  if (!widget) {
    widget = new SuggestionWidget();
    widget.create(inputElement);
  }

  // Show results
  widget.show(
    analysis,
    () => {
      // On copy callback
      logger.info('Improved prompt copied');
    },
    () => {
      // On apply callback
      // Re-check element before applying
      if (inputElement && document.contains(inputElement)) {
        setInputText(inputElement, analysis.improvedPrompt);
        logger.info('Suggestions applied');
      } else {
        logger.error('Cannot apply - input element no longer exists');
      }
    }
  );
}

/**
 * Clean up on page unload
 */
window.addEventListener('beforeunload', () => {
  if (widget) {
    widget.destroy();
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

logger.info('Prompt Improver extension loaded! Press Ctrl+Shift+A to analyze any prompt.');