import { analyzePrompt, getQualityRating } from '../src/content/prompt-analyzer';

describe('Prompt Analyzer', () => {
  describe('analyzePrompt', () => {
    test('should detect short prompts', () => {
      const result = analyzePrompt('hi');
      
      expect(result.score).toBeLessThan(50);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'clarity',
          severity: 'high',
          message: 'Prompt is too short'
        })
      );
    });

    test('should detect vague words', () => {
      const result = analyzePrompt('write something about stuff');
      
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'clarity',
          severity: 'medium',
          message: expect.stringContaining('vague words')
        })
      );
    });

    test('should detect wall of text', () => {
      const longText = 'a'.repeat(600); // 600 chars, no line breaks
      const result = analyzePrompt(longText);
      
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'structure',
          severity: 'medium',
          message: 'Prompt is a wall of text'
        })
      );
    });

    test('should detect missing context', () => {
      const result = analyzePrompt('write an article');
      
      expect(result.issues.some(i => i.type === 'context')).toBe(true);
    });

    test('should detect missing format specification', () => {
      const result = analyzePrompt('write a long article about AI and machine learning');
      
      expect(result.issues.some(i => 
        i.type === 'specificity' && 
        i.message === 'No format specification'
      )).toBe(true);
    });

    test('should give high score to good prompts', () => {
      const goodPrompt = `
        Write a 500-word article about AI in healthcare for medical professionals.
        Include recent developments, challenges, and future opportunities.
        Use a professional tone with specific examples.
        Format: Introduction, 3 main sections, conclusion.
      `;
      
      const result = analyzePrompt(goodPrompt);
      
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.issues.length).toBeLessThanOrEqual(2);
    });

    test('should return improved prompt when issues exist', () => {
      const result = analyzePrompt('write something');
      
      expect(result.improvedPrompt).not.toBe('write something');
      expect(result.improvedPrompt.length).toBeGreaterThan('write something'.length);
    });

    test('should not modify excellent prompts', () => {
      const excellentPrompt = `
        Create a Python function to calculate fibonacci numbers.
        Requirements: Use memoization for optimization.
        Input: Integer n (1-100)
        Output: The nth fibonacci number
        Include: Docstring, type hints, unit tests
      `;
      
      const result = analyzePrompt(excellentPrompt);
      
      expect(result.score).toBeGreaterThanOrEqual(85);
    });
  });

  describe('getQualityRating', () => {
    test('should return Excellent for score >= 80', () => {
      const rating = getQualityRating(85);
      expect(rating.text).toBe('Excellent');
      expect(rating.color).toBe('#10b981');
    });

    test('should return Good for score 60-79', () => {
      const rating = getQualityRating(70);
      expect(rating.text).toBe('Good');
      expect(rating.color).toBe('#3b82f6');
    });

    test('should return Fair for score 40-59', () => {
      const rating = getQualityRating(50);
      expect(rating.text).toBe('Fair');
      expect(rating.color).toBe('#f59e0b');
    });

    test('should return Needs Work for score < 40', () => {
      const rating = getQualityRating(30);
      expect(rating.text).toBe('Needs Work');
      expect(rating.color).toBe('#ef4444');
    });
  });
});