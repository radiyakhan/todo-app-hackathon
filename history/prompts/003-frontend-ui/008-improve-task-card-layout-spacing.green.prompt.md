---
id: 008
title: Improve Task Card Layout Spacing
stage: green
date: 2026-02-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-frontend-ui
branch: main
user: Dell
command: none
labels: ["ui-improvement", "layout", "spacing", "task-cards"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/components/tasks/TaskList.tsx
  - frontend/components/tasks/TaskItem.tsx
tests:
  - Manual UI testing required
---

## Prompt

Improve the task card layout to make it wider and more spacious with better element separation.

**Problem:** Task cards still feel cramped and compressed. Elements are too close together and cards are too narrow.

**Requirements:**

## 1. Make Cards Wider

**File: `frontend/components/tasks/TaskList.tsx`**

Current grid layout likely has 3 columns on large screens which makes cards narrow.

**Change from:**
```tsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

**Change to:**
```tsx
grid-cols-1 lg:grid-cols-2
```

This gives only 2 columns max on large screens, making each card significantly wider.

## 2. Increase Card Padding Significantly

**File: `frontend/components/tasks/TaskItem.tsx`**

**Current:** Probably `p-8` (32px)
**Change to:** `p-10` or `p-12` (40px or 48px)

This gives much more breathing room inside the card.

## 3. Restructure Card Layout for Better Separation

**Current layout structure is likely:**
```
[Checkbox] [Title + Priority] [Actions]
```

**Improve to:**
```
┌─────────────────────────────────────────┐
│  [Checkbox]  [Title]         [Priority] │
│                                          │
│  [Date/Time Info]                        │
│                                          │
│  [Edit Button]  [Delete Button]          │
└─────────────────────────────────────────┘
```

**Specific layout changes:**

1. **Top Row:** Checkbox + Title + Priority Badge
   - Use `flex items-start gap-6` (24px gap)
   - Title should flex-grow to take available space
   - Priority badge on the right

2. **Middle Section:** Date/Time metadata
   - Add `mt-6` or `mt-8` (24-32px margin top)
   - Clear separation from title

3. **Bottom Section:** Action buttons
   - Add `mt-8` or `mt-10` (32-40px margin top)
   - Use `flex gap-4` (16px gap between buttons)
   - Buttons should be clearly separated

[Additional requirements sections 4-10 omitted for brevity]

## Response snapshot

Successfully implemented comprehensive layout improvements to task cards:

**1. TaskList.tsx Changes:**
- Reduced grid columns from `lg:grid-cols-2 xl:grid-cols-3` to `lg:grid-cols-2`
- Cards now display maximum 2 columns on large screens, making them significantly wider

**2. TaskItem.tsx Complete Restructure:**
- Increased card padding from `p-8` to `p-10 lg:p-12` (40-48px)
- Changed from horizontal flex layout to vertical flex with `space-y-8` (32px vertical spacing)
- Restructured into three distinct sections:

**Top Section (Checkbox + Title + Priority):**
- Horizontal flex with `gap-6` (24px)
- Title has `flex-1 pr-4` for proper spacing
- Added `leading-relaxed` for better line height
- Priority badge with `flex-shrink-0` to prevent compression

**Middle Section (Metadata):**
- Increased badge padding from `px-3 py-1.5` to `px-4 py-2`
- Increased icon size from `w-3.5 h-3.5` to `w-4 h-4`
- Better text color contrast with `text-white/70`

**Bottom Section (Action Buttons):**
- Added `pt-6 border-t border-white/10` for visual separation
- Changed buttons from vertical stack to horizontal flex with `gap-4`
- Increased button size from `size="sm"` to `size="md"`
- Added explicit `px-6 py-3` padding for better button sizing
- Removed responsive text hiding - buttons always show labels
- Maintained hover effects and transitions

**Key Improvements:**
- 32px vertical spacing between all major sections
- 24px horizontal gap in top row
- 16px gap between action buttons
- Clear visual separator (border) before action buttons
- Consistent rounded corners (`rounded-xl` for buttons, `rounded-2xl` for card)
- All glassmorphism effects preserved
- Smooth transitions maintained

## Outcome

- ✅ Impact: Task cards are now significantly wider and more spacious with clear visual hierarchy
- 🧪 Tests: Manual UI testing required to verify layout improvements
- 📁 Files: Modified 2 files (TaskList.tsx, TaskItem.tsx)
- 🔁 Next prompts: Test on different screen sizes, verify responsive behavior
- 🧠 Reflection: Complete layout restructure from horizontal to vertical flex provides much better element separation and breathing room

## Evaluation notes (flywheel)

- Failure modes observed: None - straightforward layout improvements
- Graders run and results (PASS/FAIL): Manual testing required
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test responsive behavior on mobile devices, consider adjusting spacing for smaller screens if needed
