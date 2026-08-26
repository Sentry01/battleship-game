# Battleship Game - Product Requirements Document

## Objective

Build a modern, visually appealing battleship game in JavaScript where players can compete against AI opponents. The game should showcase clean, modern design following Cognition's engineering-first aesthetic and be hosted on GitHub with comprehensive testing and security measures.

## Core Features

- **Single Player vs AI** - Classic battleship gameplay against computer opponent
- **Multiple AI Difficulty Levels** - Easy, Medium, Hard with different strategic behaviors
- **Modern UI/UX** - Clean, responsive design with smooth animations
- **Game States** - Ship placement, gameplay, win/lose screens
- **Score Tracking** - Track wins, losses, and game statistics

## Design Philosophy (Clean Modern Aesthetic)

- **Clean & Minimal** - High contrast, generous whitespace, sharp geometry
- **Engineering-first Aesthetic** - Consistent grid, clean alignment, confident modern feel
- **Color Palette** - High contrast neutral palette:
  - Primary: Black (#000000) for backgrounds and emphasis
  - White (#FFFFFF) for primary backgrounds and reversed elements
  - Dark Gray (#111111) for body text and UI surfaces
  - Light Gray (#F5F5F5) for cards and section panels
  - Accent: Blue (#317CFF) for interactive elements (Cognition-inspired)
- **Typography** - Clean geometric sans-serif (Inter or similar)
- **Spacing** - 8px spacing system (8/16/24/32px)
- **Components** - Flat cards with subtle borders, 12px corner radius for UI elements

## Technical Stack

- **Frontend**: JavaScript (vanilla or lightweight framework like React/Vue)
- **Styling**: CSS framework (Tailwind CSS recommended for design consistency)
- **Testing**:
  - Unit/Integration: Jest or Vitest
  - E2E: Playwright
  - Security: CodeQL, dependency review
- **Hosting**: GitHub Pages
- **Version Control**: GitHub with GitHub Actions for CI/CD

## Functional Requirements

1. **Game Board**: 10x10 grid for player and AI
2. **Fleet**: Standard battleship ships (Carrier, Battleship, Cruiser, Submarine, Destroyer)
3. **Ship Placement**: Drag-and-drop or click-to-place system
4. **Game Logic**: Valid move detection, hit/miss tracking, win condition
5. **AI Behavior**:
   - Easy: Random shots
   - Medium: Basic targeting strategy
   - Hard: Advanced pattern recognition and probability-based targeting
6. **Game States**: Setup, playing, game over with replay option

## Non-Functional Requirements

- **Performance**: < 2 second load time, smooth 60fps animations
- **Responsive**: Mobile-first design, works on desktop and mobile
- **Accessibility**: Keyboard navigation, screen reader support, high contrast
- **Code Quality**: Clean, documented code with comprehensive testing
- **Security**: No vulnerabilities, secure dependency management, input validation

## Comprehensive Testing Strategy

### 1. Unit Testing

**Framework**: Jest or Vitest
**Coverage Target**: >80%

**Test Categories**:

- **Game Logic Tests**:
  - Ship placement validation
  - Hit/miss detection algorithms
  - Win condition checks
  - Turn management
  - Coordinate system validation

- **AI Behavior Tests**:
  - Random shot generation (Easy mode)
  - Basic targeting patterns (Medium mode)
  - Advanced probability calculations (Hard mode)
  - Ship tracking and memory

- **Utility Function Tests**:
  - Grid coordinate conversion
  - Ship overlap detection
  - Board state management
  - Score calculation

**GitHub Actions Implementation**:

```yaml
name: Unit Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
```

### 2. Integration Testing

**Framework**: Jest or Vitest

**Test Categories**:

- **Component Integration**:
  - Ship placement UI integration with game logic
  - Board rendering with state management
  - AI move integration with game state
  - Score tracking integration

- **State Management Tests**:
  - Game state transitions
  - Multi-turn scenarios
  - Win/lose state propagation
  - Persistence (if implemented)

**GitHub Actions Implementation**:

```yaml
name: Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:integration
```

### 3. End-to-End Testing (E2E)

**Framework**: Playwright

**Test Categories**:

- **User Flow Tests**:
  - Complete game from start to finish (win scenario)
  - Complete game from start to finish (lose scenario)
  - Ship placement flow
  - All AI difficulty levels
  - Replay functionality

- **Cross-Browser Tests**:
  - Chrome, Firefox, Safari compatibility
  - Mobile viewport testing (375px, 768px)
  - Desktop viewport testing (1280px, 1920px)

- **Visual Regression Tests**:
  - UI consistency across viewports
  - Animation smoothness
  - Color contrast verification
  - Component rendering accuracy

**GitHub Actions Implementation**:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 4. Security Testing

#### 4.1 Static Application Security Testing (SAST)

**Tool**: GitHub CodeQL

**Security Checks**:

- SQL injection patterns
- Cross-site scripting (XSS) vulnerabilities
- Unsafe code execution
- Insecure cryptographic practices
- Input validation issues
- Data exposure risks

**GitHub Actions Implementation**:

```yaml
name: CodeQL SAST
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
  schedule:
    - cron: "31 7 * * 1" # Weekly
permissions:
  contents: read
  security-events: write
jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      packages: read
      actions: read
      contents: read
    strategy:
      fail-fast: false
      matrix:
        language: ["javascript-typescript"]
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{ matrix.language }}"
```

#### 4.2 Dependency Vulnerability Scanning

**Tool**: GitHub Dependency Review Action

**Security Checks**:

- Known CVEs in dependencies
- Outdated package versions
- License compliance
- Dependency tree analysis

**GitHub Actions Implementation**:

```yaml
name: Dependency Review
on: [pull_request]
permissions:
  contents: read
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
```

#### 4.3 Code Quality Security Checks

**Tools**: ESLint with security plugins, npm audit

**Security Checks**:

- Security best practices in code
- Unsafe function usage
- Potential injection points
- Misconfigured security headers
- Secret leakage prevention

**GitHub Actions Implementation**:

```yaml
name: Security Linting
on: [push, pull_request]
jobs:
  security-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint:security
      - run: npm audit --audit-level=high
```

### 5. Performance Testing

**Tools**: Lighthouse CI, WebPageTest

**Performance Metrics**:

- Page load time (< 2 seconds)
- First Contentful Paint (< 1.5 seconds)
- Time to Interactive (< 3 seconds)
- Animation frame rate (60 FPS)
- Bundle size optimization

**GitHub Actions Implementation**:

```yaml
name: Performance Tests
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 6. Accessibility Testing

**Tools**: Axe-core, Playwright accessibility

**Accessibility Checks**:

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- ARIA attribute validation
- Focus management

**GitHub Actions Implementation**:

```yaml
name: Accessibility Tests
on: [push, pull_request]
jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:a11y
```

### 7. Code Quality Testing

**Tools**: ESLint, Prettier, TypeScript (if applicable)

**Quality Checks**:

- Code style consistency
- Code complexity analysis
- Duplicate code detection
- Dead code elimination
- Import/export validation

**GitHub Actions Implementation**:

```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm run type-check # if using TypeScript
```

## GitHub Actions CI/CD Pipeline

### Main Workflow (.github/workflows/ci.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Code Quality
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  # Security Scanning
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm audit --audit-level=high
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3

  # Dependency Review
  dependency-review:
    name: Dependency Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high

  # Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4

  # Integration Tests
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [quality, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:integration

  # E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [quality, unit-tests]
    timeout-minutes: 60
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Performance Tests
  performance:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [quality, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true

  # Accessibility Tests
  accessibility:
    name: Accessibility Tests
    runs-on: ubuntu-latest
    needs: [quality, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:a11y

  # Deployment
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: [security, unit-tests, integration-tests, e2e-tests, performance, accessibility]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## MCP Servers & Skills Configuration

### MCP Servers

- **GitHub MCP Server**: Repository management, issue tracking, PR automation

  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "ghp_your_token_here"
        }
      }
    }
  }
  ```

- **Playwright MCP Server**: Browser automation for E2E testing
  ```json
  {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
  ```

### Public Skills

- **Testing Skills**: Leverage community testing patterns and workflows
- **Frontend Development Skills**: Use existing frontend best practices
- **Code Quality Skills**: Implement standard linting and formatting patterns
- **CI/CD Skills**: Follow established GitHub Actions patterns

## Deliverables

- Fully functional battleship game hosted on GitHub
- Comprehensive test suite (unit, integration, E2E, security, performance, accessibility)
- CI/CD pipeline via GitHub Actions with all testing categories
- Security scanning (SAST, dependency review, code quality)
- Documentation (README, API docs if applicable)
- Clean, modern UI following Cognition design principles
- Demonstrated code quality and testing practices

## Success Criteria

- Game is fully playable with no critical bugs
- All AI difficulty levels work as intended
- Design follows Cognition-inspired modern aesthetic
- Test coverage >80%
- E2E tests cover all major user flows
- Security scans pass with no critical/high vulnerabilities
- Performance meets defined metrics
- Accessibility WCAG 2.1 AA compliance
- Code is clean, documented, and maintainable
- Game loads and performs well on mobile and desktop
- CI/CD pipeline runs successfully on all commits
- GitHub Actions workflows provide comprehensive feedback

## Future Enhancements

- Multiplayer support (PvP)
- Leaderboards and rankings
- Tournament mode
- Additional game variants
- Social features (friend challenges, chat)
- Mobile app versions
- AI improvements and machine learning
- Advanced analytics and user behavior tracking
