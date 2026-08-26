# Battleship Game

A modern, visually appealing battleship game built with JavaScript where players can compete against AI opponents. This project demonstrates clean, modern design following clean aesthetic with comprehensive testing and security measures.

## Features

- **Single Player vs AI** - Classic battleship gameplay against computer opponent
- **Multiple AI Difficulty Levels** - Easy, Medium, Hard with different strategic behaviors
- **Modern UI/UX** - Clean, responsive design with smooth animations
- **Game States** - Ship placement, gameplay, win/lose screens
- **Score Tracking** - Track wins, losses, and game statistics

## Design Philosophy

Following Cognition's engineering-first aesthetic:
- Clean & Minimal - High contrast, generous whitespace, sharp geometry
- High contrast neutral palette with accent colors
- Consistent grid, clean alignment, confident modern feel
- 8px spacing system and geometric sans-serif typography

## Tech Stack

- **Frontend**: JavaScript
- **Styling**: Tailwind CSS
- **Testing**: Jest/Vitest (unit/integration), Playwright (E2E)
- **Security**: CodeQL, dependency review
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Testing

This project includes comprehensive testing:
- Unit tests (>80% coverage)
- Integration tests
- E2E tests with Playwright
- Security testing (SAST, dependency scanning)
- Performance testing
- Accessibility testing (WCAG 2.1 AA)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## CI/CD

The project uses GitHub Actions for:
- Code quality checks (ESLint, Prettier)
- Security scanning (CodeQL, dependency review)
- Automated testing (unit, integration, E2E)
- Performance monitoring
- Accessibility testing
- Automatic deployment to GitHub Pages

## Project Status

🚧 **In Development** - This project is currently being built as part of a hiring task for Cognition.

## License

MIT
