import { useEffect, useRef, useState } from 'react';
import CreatorCard from './CreatorCard';

const Header = () => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const logoTextRef = useRef(null);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    const logoText = logoTextRef.current;
    if (!logoText) return;

    const handleMouseEnter = () => {
      hoverTimerRef.current = setTimeout(() => {
        // Start ripple
        setRippleActive(true);

        // Show the card after ripple completes
        setTimeout(() => {
          setShowEasterEgg(true);
          setRippleActive(false);
        }, 2000); // 2 seconds for ripple
      }, 3000); // 3 seconds hover
    };

    const handleMouseLeave = () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };

    logoText.addEventListener('mouseenter', handleMouseEnter);
    logoText.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      logoText.removeEventListener('mouseenter', handleMouseEnter);
      logoText.removeEventListener('mouseleave', handleMouseLeave);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleCloseCard = () => {
    setShowEasterEgg(false);
  };

  return (
    <>
      {rippleActive && <div className="ripple-overlay" />}

      <header>
        <div className="container">
          <nav>
            <div className="logo-container">
              <img src="/logo.png" alt="SieveAi Logo" className="logo" />
              <span className="logo-text" ref={logoTextRef}>
                sieveAi
              </span>
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
              <a
                href="https://github.com/Jayesh-Dev21/SieveAi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-star"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                STAR
              </a>
            </div>
          </nav>
        </div>
      </header>

      {showEasterEgg && <CreatorCard onClose={handleCloseCard} />}
    </>
  );
};

export default Header;
