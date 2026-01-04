import { PlatformType, PlatformConfig } from '../types';
import { logger } from '../utils/logger';

/**
 * Platform detection and configuration
 * Identifies which LLM platform we're on and provides selectors
 */

const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  chatgpt: {
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea',
    submitButtonSelector: 'button[data-testid="send-button"]',
    containerSelector: 'main'
  },
  claude: {
    name: 'Claude',
    inputSelector: 'div[contenteditable="true"]',
    submitButtonSelector: 'button[aria-label="Send Message"]',
    containerSelector: 'main'
  },
  gemini: {
    name: 'Gemini',
    inputSelector: 'rich-textarea .ql-editor',
    submitButtonSelector: 'button[aria-label="Send message"]',
    containerSelector: 'main'
  },
  perplexity: {
    name: 'Perplexity',
    inputSelector: 'textarea[placeholder*="Ask anything"]',
    submitButtonSelector: 'button[aria-label="Submit"]',
    containerSelector: 'main'
  },
  copilot: {
    name: 'Copilot',
    inputSelector: 'textarea[aria-label="Ask me anything..."]',
    submitButtonSelector: 'button[aria-label="Submit"]',
    containerSelector: 'main'
  },
  unknown: {
    name: 'Unknown',
    inputSelector: 'textarea, [contenteditable="true"]',
    containerSelector: 'body'
  }
};

/**
 * Detect which platform we're currently on
 */
export function detectPlatform(): PlatformType {
  const hostname = window.location.hostname;

  if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) return 'chatgpt';
  if (hostname.includes('claude.ai')) return 'claude';
  if (hostname.includes('gemini.google.com')) return 'gemini';
  if (hostname.includes('perplexity.ai')) return 'perplexity';
  if (hostname.includes('copilot.microsoft.com')) return 'copilot';

  return 'unknown';
}

/**
 * Get configuration for current platform
 */
export function getPlatformConfig(platform?: PlatformType): PlatformConfig {
  const detectedPlatform = platform || detectPlatform();
  return PLATFORM_CONFIGS[detectedPlatform];
}

/**
 * Find the input element on the page
 */
export function findInputElement(config?: PlatformConfig): HTMLElement | null {
  const platformConfig = config || getPlatformConfig();
  
  try {
    const element = document.querySelector<HTMLElement>(platformConfig.inputSelector);
    
    if (element) {
      logger.debug('Found input element:', element);
      return element;
    }

    // Fallback: try common selectors
    const fallbackSelectors = [
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="prompt"]',
      '[contenteditable="true"]',
      'textarea'
    ];

    for (const selector of fallbackSelectors) {
      const fallbackElement = document.querySelector<HTMLElement>(selector);
      if (fallbackElement) {
        logger.warn('Using fallback selector:', selector);
        return fallbackElement;
      }
    }

    logger.warn('Could not find input element');
    return null;
  } catch (error) {
    logger.error('Error finding input element:', error);
    return null;
  }
}

/**
 * Get text content from input element (handles textarea, contenteditable, and ProseMirror)
 */
export function getInputText(element: HTMLElement): string {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value;
  }
  
  if (element.isContentEditable) {
    // Check if it's ProseMirror (used by ChatGPT)
    if (element.classList.contains('ProseMirror')) {
      // Get text from the paragraph inside
      const paragraph = element.querySelector('p');
      if (paragraph) {
        // Remove placeholder content
        if (paragraph.classList.contains('placeholder')) {
          return '';
        }
        return paragraph.innerText || paragraph.textContent || '';
      }
    }
    return element.innerText || element.textContent || '';
  }

  return '';
}

/**
 * Set text content in input element
 */
export function setInputText(element: HTMLElement, text: string): void {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (element.isContentEditable) {
    // Check if it's ProseMirror
    if (element.classList.contains('ProseMirror')) {
      const paragraph = element.querySelector('p');
      if (paragraph) {
        // Remove placeholder class if it exists
        paragraph.classList.remove('placeholder');
        paragraph.innerHTML = text.replace(/\n/g, '<br>');
      } else {
        // Fallback: create new paragraph
        element.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
      }
    } else {
      element.innerText = text;
    }
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Also trigger change event for some editors
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}