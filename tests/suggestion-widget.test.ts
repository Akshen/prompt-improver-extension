import { SuggestionWidget } from '../src/content/suggestion-widget';
import { analyzePrompt } from '../src/content/prompt-analyzer';

describe('SuggestionWidget', () => {
  let widget: SuggestionWidget;
  let anchorElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    widget = new SuggestionWidget();
    anchorElement = document.createElement('div');
    anchorElement.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      bottom: 150,
      left: 50,
      right: 400,
      width: 350,
      height: 50,
      x: 50,
      y: 100,
      toJSON: () => ({})
    }));
    document.body.appendChild(anchorElement);
  });

  afterEach(() => {
    widget.destroy();
  });

  test('should create widget in DOM', () => {
    widget.create(anchorElement);
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement).toBeInTheDocument();
  });

  test('should position widget at bottom-right', () => {
    widget.create(anchorElement);
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement?.style.position).toBe('fixed');
    expect(widgetElement?.style.bottom).toBe('80px');
    expect(widgetElement?.style.right).toBe('24px');
  });

  test('should show analysis results', () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('write something');
    const mockCopy = jest.fn();
    const mockApply = jest.fn();
    
    widget.show(analysis, mockCopy, mockApply);
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement?.textContent).toContain('Prompt Quality');
    expect(widgetElement?.textContent).toContain(analysis.score.toString());
  });

  test('should show suggestions when issues exist', () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('write something');
    widget.show(analysis, jest.fn(), jest.fn());
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement?.textContent).toContain('Suggestions');
    expect(widgetElement?.querySelector('.issues-list')).toBeInTheDocument();
  });

  test('should show success message for good prompts', () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('Write a detailed 500-word article about AI with examples');
    widget.show(analysis, jest.fn(), jest.fn());
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    if (analysis.issues.length === 0) {
      expect(widgetElement?.textContent).toContain('looks great');
    }
  });

  test('should call copy callback when copy button clicked', async () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('write something');
    const mockCopy = jest.fn();
    
    widget.show(analysis, mockCopy, jest.fn());
    
    const copyButton = document.querySelector('.copy-btn') as HTMLButtonElement;
    copyButton?.click();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(analysis.improvedPrompt);
    expect(mockCopy).toHaveBeenCalled();
  });

  test('should call apply callback when apply button clicked', () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('write something');
    const mockApply = jest.fn();
    
    widget.show(analysis, jest.fn(), mockApply);
    
    const applyButton = document.querySelector('.apply-btn') as HTMLButtonElement;
    applyButton?.click();
    
    expect(mockApply).toHaveBeenCalled();
  });

  test('should hide widget when close button clicked', () => {
    widget.create(anchorElement);
    
    const analysis = analyzePrompt('write something');
    widget.show(analysis, jest.fn(), jest.fn());
    
    const closeButton = document.querySelector('.widget-close') as HTMLButtonElement;
    closeButton?.click();
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement?.classList.contains('visible')).toBe(false);
  });

  test('should destroy widget and remove from DOM', () => {
    widget.create(anchorElement);
    widget.destroy();
    
    const widgetElement = document.getElementById('prompt-improver-widget');
    expect(widgetElement).not.toBeInTheDocument();
  });

  test('should not crash when showing widget without creation', () => {
    const analysis = analyzePrompt('test');
    expect(() => {
      widget.show(analysis, jest.fn(), jest.fn());
    }).not.toThrow();
  });
});