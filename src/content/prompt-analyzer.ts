import { AnalysisResult, PromptIssue } from '../types';
import { logger } from '../utils/logger';

/**
 * Local rule-based prompt analyzer
 * Detects common issues and provides suggestions
 */

// Vague words that indicate lack of clarity
const VAGUE_WORDS = [
  'something', 'stuff', 'things', 'kind of', 'sort of',
  'maybe', 'probably', 'might', 'could be', 'some'
];

// Words indicating missing specificity
const UNSPECIFIC_PATTERNS = [
  /\b(any|some|few|many|several)\b/gi,
  /\b(good|bad|better|worse)\b/gi,
  /\b(big|small|large|short|long)\b/gi
];

/**
 * Analyze prompt and return issues + improved version
 */
export function analyzePrompt(prompt: string): AnalysisResult {
  const issues: PromptIssue[] = [];
  const trimmedPrompt = prompt.trim();

  // Check 1: Prompt too short
  if (trimmedPrompt.length < 10) {
    issues.push({
      type: 'clarity',
      severity: 'high',
      message: 'Prompt is too short',
      suggestion: 'Add more context and details to help the AI understand your request better.'
    });
  }

  // Check 2: Prompt too long (wall of text)
  if (trimmedPrompt.length > 500 && !trimmedPrompt.includes('\n')) {
    issues.push({
      type: 'structure',
      severity: 'medium',
      message: 'Prompt is a wall of text',
      suggestion: 'Break your prompt into clear sections or bullet points for better structure.'
    });
  }

  // Check 3: Contains vague words
  const foundVagueWords = VAGUE_WORDS.filter(word => 
    trimmedPrompt.toLowerCase().includes(word)
  );
  
  if (foundVagueWords.length > 0) {
    issues.push({
      type: 'clarity',
      severity: 'medium',
      message: `Contains vague words: ${foundVagueWords.slice(0, 3).join(', ')}`,
      suggestion: 'Replace vague terms with specific details about what you want.'
    });
  }

  // Check 4: Lacks specificity
  const hasUnspecificWords = UNSPECIFIC_PATTERNS.some(pattern => 
    pattern.test(trimmedPrompt)
  );
  
  if (hasUnspecificWords) {
    issues.push({
      type: 'specificity',
      severity: 'medium',
      message: 'Lacks specific details',
      suggestion: 'Add concrete numbers, examples, or constraints (e.g., length, format, tone).'
    });
  }

  // Check 5: No clear question or instruction
  const hasQuestion = /[?]/.test(trimmedPrompt);
  const hasImperative = /^(create|write|generate|make|build|explain|describe|list|show|give|provide|help|can you|could you|please)/i.test(trimmedPrompt);
  
  if (!hasQuestion && !hasImperative && trimmedPrompt.length > 10) {
    issues.push({
      type: 'clarity',
      severity: 'low',
      message: 'No clear question or instruction',
      suggestion: 'Start with a clear action word (e.g., "Create", "Explain", "List") or end with a question.'
    });
  }

  // Check 6: Missing context
  const contextKeywords = ['for', 'because', 'in order to', 'context', 'background', 'i need', 'i want'];
  const hasContext = contextKeywords.some(keyword => 
    trimmedPrompt.toLowerCase().includes(keyword)
  );

  if (!hasContext && trimmedPrompt.length < 100) {
    issues.push({
      type: 'context',
      severity: 'low',
      message: 'Could use more context',
      suggestion: 'Add background information or explain why you need this (your goal, audience, use case).'
    });
  }

  // Check 7: No format specification
  const hasFormat = /\b(format|structure|style|tone|length|words|lines|paragraphs|bullet|numbered)\b/i.test(trimmedPrompt);
  
  if (!hasFormat && trimmedPrompt.length > 50) {
    issues.push({
      type: 'specificity',
      severity: 'low',
      message: 'No format specification',
      suggestion: 'Specify the desired format, length, or style for the output.'
    });
  }

  // Calculate score (100 - penalty for each issue)
  const score = Math.max(0, 100 - (issues.length * 15));

  // Generate improved prompt
  const improvedPrompt = generateImprovedPrompt(trimmedPrompt, issues);

  logger.debug('Analysis complete:', { score, issueCount: issues.length });

  return {
    score,
    issues,
    improvedPrompt,
    timestamp: Date.now()
  };
}

/**
 * Generate an improved version of the prompt
 */
function generateImprovedPrompt(original: string, issues: PromptIssue[]): string {
  if (issues.length === 0) {
    return original;
  }

  let improved = original;
  const hasStructureIssue = issues.some(i => i.type === 'structure');
  const hasContextIssue = issues.some(i => i.type === 'context');
  const hasSpecificityIssue = issues.some(i => i.type === 'specificity');

  // Add clear instruction if missing
  if (issues.some(i => i.message.includes('No clear question'))) {
    improved = `Please help me with the following:\n\n${improved}`;
  }

  // Add context suggestion
  if (hasContextIssue) {
    improved += '\n\nContext: [Add your background, goal, or use case here]';
  }

  // Add format specification
  if (hasSpecificityIssue && !improved.toLowerCase().includes('format')) {
    improved += '\n\nDesired format: [Specify length, style, or structure]';
  }

  // Improve structure
  if (hasStructureIssue && improved.length > 200) {
    // Try to break into sections
    const sentences = improved.split(/[.!?]\s+/);
    if (sentences.length > 3) {
      improved = sentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
    }
  }

  return improved.trim();
}

/**
 * Get quality rating based on score
 */
export function getQualityRating(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Excellent', color: '#10b981' };
  if (score >= 60) return { text: 'Good', color: '#3b82f6' };
  if (score >= 40) return { text: 'Fair', color: '#f59e0b' };
  return { text: 'Needs Work', color: '#ef4444' };
}