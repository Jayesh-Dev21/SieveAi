const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SieveAi</h3>
            <p style={{ color: 'var(--light-grey)', lineHeight: 1.7 }}>
              Local-first AI code review for developers who value privacy and code quality.
            </p>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <div className="footer-links">
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/blob/master/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/blob/master/docs/ROADMAP.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Roadmap
              </a>
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/blob/master/docs/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contributing
              </a>
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/blob/master/docs/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Security
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Community</h3>
            <div className="footer-links">
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/sieveai"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm Package
              </a>
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report Issues
              </a>
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discussions
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>MIT License © 2024 SieveAi • Made with ❤️ for developers who value privacy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
