const Header = () => {
  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo-container">
            <img src="/logo.png" alt="SieveAi Logo" className="logo" />
            <span className="logo-text">sieveAi</span>
          </div>
          <div className="nav-links">
            <a href="#features">FEATURES</a>
            <a href="#architecture">ARCHITECTURE</a>
            <a href="#quickstart">QUICKSTART</a>
            <a
              href="https://github.com/Jayesh-Dev21/SieveAi"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB
            </a>
            <a
              href="https://www.npmjs.com/package/sieveai"
              target="_blank"
              rel="noopener noreferrer"
            >
              NPM
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
