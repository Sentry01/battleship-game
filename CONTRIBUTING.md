# Contributing to Battleship Game

Thank you for your interest in contributing to the Battleship Game! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/battleship-game.git
   cd battleship-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Running the Project

```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Run linting
npm run lint

# Run formatting
npm run format:write

# Check formatting
npm run format:check
```

## Contribution Guidelines

### Making Changes

1. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following the project's coding standards

3. Test your changes thoroughly:
   - Run unit tests
   - Run integration tests
   - Run E2E tests
   - Check code quality with linting

4. Commit your changes with clear, descriptive messages:

   ```bash
   git commit -m "feat: add your feature description"
   # or
   git commit -m "fix: describe the bug fix"
   ```

5. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request to the main repository

### Pull Request Process

1. Ensure your PR description clearly describes the changes and the reason for them
2. Link to any related issues
3. Ensure all CI checks pass
4. Request review from maintainers
5. Respond to review feedback promptly

### Code Style

- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write unit tests for new functions
- Add integration tests for new features
- Update E2E tests for UI changes
- Ensure all tests pass before submitting PR

## Design Guidelines

### Cognition-Inspired Design

- Follow the clean, minimal aesthetic
- Use the defined color palette (high contrast neutrals + accent)
- Maintain the 8px spacing system
- Use geometric sans-serif typography
- Ensure high contrast and accessibility

### UI Components

- Use consistent component patterns
- Ensure responsive design (mobile-first)
- Implement smooth animations
- Test across different browsers and viewports

## Security Considerations

- Never commit secrets or API keys
- Follow security best practices
- Update dependencies regularly
- Review security alerts from Dependabot
- Test with security scanning tools

## Issues and Bug Reports

- Use the provided issue templates
- Provide clear steps to reproduce
- Include environment details
- Add screenshots for UI issues
- Check existing issues before creating new ones

## Feature Requests

- Use the feature request template
- Describe the problem you're solving
- Explain the proposed solution
- Consider alternatives
- Discuss in issues before implementing

## Questions

- Use GitHub Discussions for questions
- Check existing discussions first
- Provide context and details
- Be patient with responses

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community
- Show empathy towards other community members

Thank you for contributing to the Battleship Game!
