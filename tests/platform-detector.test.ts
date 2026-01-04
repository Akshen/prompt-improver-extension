import { detectPlatform, getPlatformConfig, getInputText, setInputText, findInputElement } from '../src/content/platform-detector';

describe('Platform Detector', () => {
  describe('detectPlatform', () => {
    // Mock window.location.hostname using jest.spyOn
    let originalLocation: Location;

    beforeEach(() => {
      originalLocation = window.location;
    });

    afterEach(() => {
      // @ts-ignore
      window.location = originalLocation;
    });

    const mockHostname = (hostname: string) => {
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { hostname } as Location;
    };

    test('should detect ChatGPT', () => {
      mockHostname('chatgpt.com');
      expect(detectPlatform()).toBe('chatgpt');
    });

    test('should detect ChatGPT (old domain)', () => {
      mockHostname('chat.openai.com');
      expect(detectPlatform()).toBe('chatgpt');
    });

    test('should detect Claude', () => {
      mockHostname('claude.ai');
      expect(detectPlatform()).toBe('claude');
    });

    test('should detect Gemini', () => {
      mockHostname('gemini.google.com');
      expect(detectPlatform()).toBe('gemini');
    });

    test('should detect Perplexity', () => {
      mockHostname('www.perplexity.ai');
      expect(detectPlatform()).toBe('perplexity');
    });

    test('should detect Copilot', () => {
      mockHostname('copilot.microsoft.com');
      expect(detectPlatform()).toBe('copilot');
    });

    test('should return unknown for unsupported platforms', () => {
      mockHostname('example.com');
      expect(detectPlatform()).toBe('unknown');
    });
  });

  describe('getPlatformConfig', () => {
    test('should return config for chatgpt', () => {
      const config = getPlatformConfig('chatgpt');
      expect(config.name).toBe('ChatGPT');
      expect(config.inputSelector).toBe('#prompt-textarea');
    });

    test('should return config for claude', () => {
      const config = getPlatformConfig('claude');
      expect(config.name).toBe('Claude');
    });
  });

  describe('getInputText', () => {
    test('should get text from textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'test prompt';
      
      expect(getInputText(textarea)).toBe('test prompt');
    });

    test('should get text from input', () => {
      const input = document.createElement('input');
      input.value = 'test prompt';
      
      expect(getInputText(input)).toBe('test prompt');
    });

    test('should get text from contenteditable', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      // Use textContent instead of innerText for jsdom compatibility
      div.textContent = 'test prompt';
      
      const result = getInputText(div);
      expect(result).toBe('test prompt');
    });

    test('should get text from ProseMirror editor', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.classList.add('ProseMirror');
      
      const p = document.createElement('p');
      p.textContent = 'test prompt';
      div.appendChild(p);
      
      const result = getInputText(div);
      expect(result).toBe('test prompt');
    });

    test('should return empty string for ProseMirror placeholder', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.classList.add('ProseMirror');
      
      const p = document.createElement('p');
      p.classList.add('placeholder');
      p.textContent = 'Ask anything';
      div.appendChild(p);
      
      expect(getInputText(div)).toBe('');
    });

    test('should return empty string for unsupported elements', () => {
      const span = document.createElement('span');
      expect(getInputText(span)).toBe('');
    });
  });

  describe('setInputText', () => {
    test('should set text in textarea', () => {
      const textarea = document.createElement('textarea');
      const inputSpy = jest.fn();
      textarea.addEventListener('input', inputSpy);
      
      setInputText(textarea, 'new text');
      
      expect(textarea.value).toBe('new text');
      expect(inputSpy).toHaveBeenCalled();
    });

    test('should set text in input', () => {
      const input = document.createElement('input');
      const inputSpy = jest.fn();
      input.addEventListener('input', inputSpy);
      
      setInputText(input, 'new text');
      
      expect(input.value).toBe('new text');
      expect(inputSpy).toHaveBeenCalled();
    });

    test('should set text in contenteditable', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      const inputSpy = jest.fn();
      div.addEventListener('input', inputSpy);
      
      setInputText(div, 'new text');
      
      // Use textContent for jsdom compatibility
      expect(div.textContent).toBe('new text');
      expect(inputSpy).toHaveBeenCalled();
    });

    test('should set text in ProseMirror editor', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.classList.add('ProseMirror');
      
      const p = document.createElement('p');
      div.appendChild(p);
      
      setInputText(div, 'new text');
      
      expect(p.innerHTML).toBe('new text');
    });

    test('should handle newlines in ProseMirror', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.classList.add('ProseMirror');
      
      const p = document.createElement('p');
      div.appendChild(p);
      
      setInputText(div, 'line 1\nline 2');
      
      expect(p.innerHTML).toBe('line 1<br>line 2');
    });

    test('should remove placeholder class in ProseMirror', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.classList.add('ProseMirror');
      
      const p = document.createElement('p');
      p.classList.add('placeholder');
      div.appendChild(p);
      
      setInputText(div, 'new text');
      
      expect(p.classList.contains('placeholder')).toBe(false);
    });
  });

  describe('findInputElement', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    test('should find input by selector', () => {
      const textarea = document.createElement('textarea');
      textarea.id = 'prompt-textarea';
      document.body.appendChild(textarea);

      const config = { name: 'Test', inputSelector: '#prompt-textarea' };
      const found = findInputElement(config);

      expect(found).toBe(textarea);
    });

    test('should return null if not found', () => {
      const config = { name: 'Test', inputSelector: '#nonexistent' };
      const found = findInputElement(config);

      expect(found).toBeNull();
    });

    test('should use fallback selectors', () => {
      const textarea = document.createElement('textarea');
      textarea.setAttribute('placeholder', 'Type a message');
      document.body.appendChild(textarea);

      const config = { name: 'Test', inputSelector: '#nonexistent' };
      const found = findInputElement(config);

      expect(found).toBe(textarea);
    });
  });
});