# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅        |
| < 1.0   | ❌        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report
1. **Do not** create a public issue for security vulnerabilities
2. Send an email to: [INSERT SECURITY EMAIL]
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### What to Expect
- We will acknowledge receipt of your report within 48 hours
- We will provide a detailed response within 7 days
- We will work with you to understand and resolve the issue
- We will coordinate disclosure of the vulnerability

### Security Features
This project includes several security features:

- **Dependabot**: Automated dependency vulnerability scanning
- **CodeQL**: Static application security testing (SAST)
- **Secret Scanning**: Automatic detection of committed secrets
- **Dependency Review**: Automated review of dependency changes
- **Security Updates**: Automated pull requests for vulnerability fixes

### Best Practices
- Keep dependencies updated
- Review security alerts regularly
- Follow secure coding practices
- Never commit secrets or credentials
- Use environment variables for sensitive data
- Enable two-factor authentication on GitHub

### Security Scanning
This project uses GitHub's built-in security features:
- **Dependabot Alerts**: Monitors for vulnerable dependencies
- **Dependabot Security Updates**: Automated PRs for vulnerability fixes
- **CodeQL**: Runs security analysis on every push and PR
- **Secret Scanning**: Detects secrets in commits and PRs
- **Dependency Review**: Blocks PRs with vulnerable dependencies

### Disclosure Policy
- We follow responsible disclosure practices
- We will credit researchers who report vulnerabilities
- We will work to fix vulnerabilities before public disclosure
- We will announce security updates through GitHub releases

## Security Contacts
- **Security Email**: [INSERT SECURITY EMAIL]
- **GitHub Security**: https://github.com/Sentry01/battleship-game/security

## Additional Resources
- [GitHub Security Documentation](https://docs.github.com/en/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Secure Coding Practices](https://cheatsheetseries.owasp.org/)