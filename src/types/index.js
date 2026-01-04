/**
 * Type definitions for the Prompt Improver extension
 */

export type PlatformType = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'copilot' | 'unknown';

export interface PlatformConfig {
  name: string;
  inputSelector: string;
  submitButtonSelector?: string;
  containerSelector?: string;
}

export interface PromptIssue {
  type: 'clarity' | 'specificity' | 'structure' | 'context';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  position?: number; // Character position in prompt
}

export interface AnalysisResult {
  score: number; // 0-100
  issues: PromptIssue[];
  improvedPrompt: string;
  timestamp: number;
}

export interface WidgetPosition {
  top: number;
  left: number;
  right?: number;
}