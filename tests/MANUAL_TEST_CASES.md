# Manual Test Cases

## Platform Detection Tests

### TC-001: ChatGPT Detection
**Steps:**
1. Navigate to https://chatgpt.com
2. Open DevTools Console

**Expected:** Console shows `[PromptImprover] Initialized on platform: chatgpt`

---

### TC-002: Claude Detection
**Steps:**
1. Navigate to https://claude.ai
2. Open DevTools Console

**Expected:** Console shows `[PromptImprover] Initialized on platform: claude`

---

### TC-003: Input Element Detection
**Steps:**
1. Navigate to ChatGPT
2. Wait for page load
3. Check console

**Expected:** 
- `[PromptImprover] Input element found, setting up listeners`
- `[PromptImprover] Listeners set up successfully`

---

## Analysis Tests

### TC-004: Short Prompt Analysis
**Steps:**
1. Type "hi" in ChatGPT
2. Wait 1 second

**Expected:** 
- Widget appears
- Score < 50
- Shows "Prompt is too short" issue

---

### TC-005: Vague Prompt Analysis
**Steps:**
1. Type "write something about stuff"
2. Wait 1 second

**Expected:**
- Widget appears
- Shows "Contains vague words" issue
- Lists "something, stuff"

---

### TC-006: Good Prompt Analysis
**Steps:**
1. Type: "Write a 500-word article about AI in healthcare. Use professional tone with examples. Format: intro, 3 sections, conclusion."
2. Wait 1 second

**Expected:**
- Widget appears
- Score >= 70
- Few or no issues
- Shows "Good" or "Excellent" rating

---

## Widget Interaction Tests

### TC-007: Copy Functionality
**Steps:**
1. Analyze any prompt
2. Click "📋 Copy Improved Prompt"
3. Paste in a text editor

**Expected:**
- Toast shows "Copied to clipboard!"
- Improved prompt is pasted correctly

---

### TC-008: Apply Functionality
**Steps:**
1. Type "write something"
2. Wait for widget
3. Click "⚡ Apply Suggestions"

**Expected:**
- Input box text is replaced with improved prompt
- Toast shows "Suggestions applied!"

---

### TC-009: Close Widget
**Steps:**
1. Analyze a prompt
2. Click "×" button

**Expected:**
- Widget fades out
- Widget becomes semi-transparent

---

### TC-010: Keyboard Shortcut
**Steps:**
1. Type any text in input
2. Press Ctrl+Shift+A (Cmd+Shift+A on Mac)

**Expected:**
- Widget appears immediately
- Shows analysis

---

## SPA Navigation Tests

### TC-011: New Chat Navigation (ChatGPT)
**Steps:**
1. Analyze a prompt (widget appears)
2. Click "New chat" button
3. Type another prompt
4. Wait 1 second

**Expected:**
- Widget appears for new prompt
- No console errors
- Console shows: "Input element was removed from DOM, re-initializing..."

---

### TC-012: Multiple Chat Sessions
**Steps:**
1. Create 3 different chats
2. Analyze prompts in each
3. Switch between chats

**Expected:**
- Widget works in all chats
- No memory leaks
- No duplicate widgets

---

## UI/UX Tests

### TC-013: Widget Positioning
**Steps:**
1. Analyze a prompt
2. Check widget location

**Expected:**
- Widget at bottom-right
- Doesn't block send button
- Opacity: 0.4 when not hovered

---

### TC-014: Hover Behavior
**Steps:**
1. Analyze a prompt
2. Move mouse over widget
3. Move mouse away

**Expected:**
- Widget opacity: 1.0 on hover
- Widget opacity: 0.4 when mouse leaves
- Smooth transition

---

### TC-015: Draggable Widget
**Steps:**
1. Analyze a prompt
2. Click and drag widget header
3. Release

**Expected:**
- Widget moves with mouse
- Stays at new position
- No console errors

---

## Edge Cases

### TC-016: Empty Input
**Steps:**
1. Click in input box (empty)
2. Press Ctrl+Shift+A

**Expected:**
- Widget doesn't appear
- Console shows: "Text too short to analyze"

---

### TC-017: Very Long Prompt
**Steps:**
1. Type 1000+ characters in a single line
2. Wait 1 second

**Expected:**
- Widget appears
- Shows "wall of text" issue
- No performance issues

---

### TC-018: Special Characters
**Steps:**
1. Type: "Write code: `const x = 10;` and explain @mentions #hashtags"
2. Wait 1 second

**Expected:**
- Widget appears
- Analysis handles special characters
- No crashes

---

### TC-019: Rapid Typing
**Steps:**
1. Type very quickly without pausing
2. Stop typing

**Expected:**
- Analysis is debounced
- Only one analysis runs
- Widget appears 1 second after last keystroke

---

### TC-020: Browser Refresh
**Steps:**
1. Analyze a prompt
2. Refresh page (Ctrl+R)
3. Type new prompt

**Expected:**
- Extension reloads
- Widget works after refresh
- No duplicate event listeners

---

## Performance Tests

### TC-021: Load Time
**Steps:**
1. Navigate to ChatGPT
2. Measure time until extension ready

**Expected:**
- Extension loads in < 200ms
- No blocking of page load

---

### TC-022: Analysis Speed
**Steps:**
1. Type a 200-word prompt
2. Wait for analysis

**Expected:**
- Analysis completes in < 100ms
- UI remains responsive

---

## Cross-Platform Tests

### TC-023: Test All Platforms
**Platforms:** ChatGPT, Claude, Gemini, Perplexity, Copilot

**For each platform:**
1. Navigate to platform
2. Type test prompt
3. Verify widget appears
4. Test copy/apply
5. Test new conversation

**Expected:** All features work on all platforms

---

## Regression Tests

### TC-024: After Code Changes
**Run after any code changes:**
1. All automated tests pass
2. TC-001 to TC-020 pass
3. No new console errors
4. Extension still loads

---

## Bug Report Template
```
**Bug Title:** [Short description]

**Platform:** ChatGPT / Claude / Gemini / Other

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**

**Actual Result:**

**Console Errors:**

**Screenshots:**

**Browser:** Chrome XX.X
**Extension Version:** 0.1.0
```