import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CreatorCard = ({ onClose }) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    // Fetch GitHub avatar
    fetch('https://api.github.com/users/Jayesh-Dev21')
      .then((res) => res.json())
      .then((data) => {
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      })
      .catch(() => {
        // Fallback to default GitHub avatar
        setAvatarUrl('https://github.com/Jayesh-Dev21.png');
      });
  }, []);

  return (
    <motion.div
      className="creator-card-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="creator-card"
        initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.6,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="card-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="card-header">
          <motion.div
            className="card-avatar-wrapper"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {avatarUrl && <img src={avatarUrl} alt="Jayesh Puri" className="card-avatar" />}
          </motion.div>
          <h3 className="card-title">Made by</h3>
          <h2 className="card-name">Jayesh Puri</h2>
          <p className="card-username">@Jayesh-Dev21</p>
        </div>

        <div className="card-content">
          <p className="card-description">
            Full-stack developer passionate about building developer tools and AI-powered
            applications.
          </p>
        </div>

        <div className="card-links">
          <motion.a
            href="https://github.com/Jayesh-Dev21"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link card-link-github"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </motion.a>

          <motion.a
            href="https://jayeshpuri.me"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link card-link-website"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Website
          </motion.a>
        </div>

        <div className="card-footer">
          <p>Thank you for discovering this easter egg!</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatorCard;
