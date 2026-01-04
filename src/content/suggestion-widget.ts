import { AnalysisResult } from '../types';
import { getQualityRating } from './prompt-analyzer';
import { logger } from '../utils/logger';

/**
 * UI Widget for displaying suggestions
 * Appears as a floating card near the input area
 */

const WIDGET_ID = 'prompt-improver-widget';

export class SuggestionWidget {
  private container: HTMLElement | null = null;
  private isVisible = false;

  /**
   * Create and inject the widget into the page
   */
  create(anchorElement: HTMLElement): void {
    // Remove existing widget if any
    this.destroy();

    this.container = document.createElement('div');
    this.container.id = WIDGET_ID;
    this.container.className = 'prompt-improver-widget';
    
    // Position relative to input
    this.positionWidget(anchorElement);

    // Add to DOM
    document.body.appendChild(this.container);
    
    // Make draggable (optional enhancement)
    this.makeDraggable();

    logger.debug('Widget created');
  }

/**
 * Position widget at bottom-right with auto-fade behavior
 */
private positionWidget(anchor: HTMLElement): void {
  if (!this.container) return;

  // Position at bottom-right corner
  this.container.style.position = 'fixed';
  this.container.style.top = '20px';
  this.container.style.right = '24px';
  this.container.style.bottom = 'auto';
  this.container.style.left = 'auto';
  this.container.style.zIndex = '999999';
  
  // Add fade behavior
  this.container.style.opacity = '0.25';
  this.container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  this.container.style.pointerEvents = 'auto'; // Always clickable
  
  // Fade in fully when mouse enters widget
  this.container.addEventListener('mouseenter', () => {
    if (this.container) {
      this.container.style.opacity = '1';
      this.container.style.transform = 'scale(1.02)'; // Slight zoom effect
    }
  });
  
  // Fade out when mouse leaves widget
  this.container.addEventListener('mouseleave', () => {
    if (this.container) {
      this.container.style.opacity = '0.25';
      this.container.style.transform = 'scale(1)';
    }
  });
}

  /**
   * Update widget content with analysis results
   */
  show(analysis: AnalysisResult, onCopy: () => void, onApply: () => void): void {
    if (!this.container) return;

    const rating = getQualityRating(analysis.score);
    const hasIssues = analysis.issues.length > 0;

    this.container.innerHTML = `
      <div class="widget-header">
        <div class="widget-title">
          <span class="widget-icon">✨</span>
          Prompt Quality
        </div>
        <button class="widget-close" aria-label="Close">×</button>
      </div>

      <div class="widget-body">
        <div class="quality-score">
          <div class="score-circle" style="background: ${rating.color}">
            <span class="score-number">${analysis.score}</span>
            <span class="score-label">/100</span>
          </div>
          <span class="score-rating" style="color: ${rating.color}">${rating.text}</span>
        </div>

        ${hasIssues ? `
          <div class="issues-section">
            <h3 class="section-title">💡 Suggestions (${analysis.issues.length})</h3>
            <ul class="issues-list">
              ${analysis.issues.slice(0, 5).map((issue) => `
                <li class="issue-item issue-${issue.severity}">
                  <span class="issue-badge">${this.getSeverityIcon(issue.severity)}</span>
                  <div class="issue-content">
                    <div class="issue-message">${issue.message}</div>
                    <div class="issue-suggestion">${issue.suggestion}</div>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : `
          <div class="success-message">
            <span class="success-icon">🎉</span>
            <p>Your prompt looks great! No major improvements needed.</p>
          </div>
        `}

        ${analysis.improvedPrompt !== analysis.issues.length ? `
          <div class="actions-section">
            <button class="btn btn-primary copy-btn" data-action="copy">
              📋 Copy Improved Prompt
            </button>
            <button class="btn btn-secondary apply-btn" data-action="apply">
              ⚡ Apply Suggestions
            </button>
          </div>
        ` : ''}

        <div class="widget-footer">
          <a href="#" class="upgrade-link">🚀 Upgrade for AI-powered analysis</a>
        </div>
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners(analysis, onCopy, onApply);

    this.container.classList.add('visible');
    this.isVisible = true;

    logger.debug('Widget shown with analysis');
  }

  /**
   * Attach event listeners to widget buttons
   */
  private attachEventListeners(
    analysis: AnalysisResult,
    onCopy: () => void,
    onApply: () => void
  ): void {
    if (!this.container) return;

    // Close button
    const closeBtn = this.container.querySelector('.widget-close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Copy button
    const copyBtn = this.container.querySelector('.copy-btn');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(analysis.improvedPrompt);
        this.showToast('Copied to clipboard!');
        onCopy();
      } catch (error) {
        logger.error('Failed to copy:', error);
        this.showToast('Failed to copy', 'error');
      }
    });

    // Apply button
    const applyBtn = this.container.querySelector('.apply-btn');
    applyBtn?.addEventListener('click', () => {
      onApply();
      this.showToast('Suggestions applied!');
    });

    // Upgrade link
    const upgradeLink = this.container.querySelector('.upgrade-link');
    upgradeLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showUpgradeModal();
    });
  }

  /**
   * Hide the widget
   */
  hide(): void {
    if (this.container) {
      this.container.classList.remove('visible');
      this.isVisible = false;
    }
  }

  /**
   * Remove widget from DOM
   */
  destroy(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.isVisible = false;
    }
  }

  /**
   * Get icon for severity level
   */
  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  /**
   * Show temporary toast notification
   */
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /**
   * Show upgrade modal (placeholder for premium features)
   */
  private showUpgradeModal(): void {
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>🚀 Upgrade to Premium</h2>
        <p>Get AI-powered analysis with:</p>
        <ul>
          <li>✨ 10-15 detailed suggestions</li>
          <li>🎯 Domain-specific improvements</li>
          <li>📚 50+ prompt templates</li>
          <li>💾 Prompt history & favorites</li>
          <li>☁️ Cloud sync across devices</li>
        </ul>
        <div class="modal-price">
          <span class="price">₹199</span>/month
        </div>
        <button class="btn btn-primary btn-large">Coming Soon!</button>
        <button class="modal-close">Maybe Later</button>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    const close = () => {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.modal-close')?.addEventListener('click', close);
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
  }

  /**
   * Make widget draggable
   */
  private makeDraggable(): void {
    if (!this.container) return;

    const header = this.container.querySelector('.widget-header') as HTMLElement;
    if (!header) return;

    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).classList.contains('widget-close')) return;
      
      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.container) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      this.container.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  /**
   * Check if widget is currently visible
   */
  isShowing(): boolean {
    return this.isVisible;
  }
}