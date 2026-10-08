# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Build a single-page quiz game called "Star Quiz" for kids aged 6–10 with 8 easy questions about animals, colours and space. Show one question at a time with 4 big answer buttons and a progress bar, give a star for each right answer and a friendly message for wrong ones, and finish with a score screen and a "Play again" button. Bright, rounded, playful design with big text and emoji. No login, no forms and no external links.

## Goal
Build "Star Quiz" — a fully self-contained single-page kids' quiz game with 8 questions, animated progress bar, star rewards, friendly feedback, and a final score screen with Play Again.

## Project type
other

## Design system — match this exactly
- Color tokens: `--background: #FFF9C4`, `--foreground: #1A1240`, `--card: #FFFFFF`, `--border: #FFD700`, `--muted-foreground: #5B4F9A`, `--primary: #FF6B6B`, `--accent: #4ECDC4`, `--accent-h: #09090b`

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`cta`, `footer`, `funFacts`, `hero`, `howItWorks`, `meta`, `nav`, `quiz`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
