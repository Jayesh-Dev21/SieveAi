import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const GeometricBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    // Generate floating noise particles
    if (bgRef.current) {
      const particles = [];
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'noise-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = 15 + Math.random() * 10 + 's';
        bgRef.current.appendChild(particle);
        particles.push(particle);
      }

      return () => {
        particles.forEach((p) => p.remove());
      };
    }
  }, []);

  return (
    <>
      <div className="geometric-bg" ref={bgRef}>
        <motion.div
          className="geo-line"
          initial={{ x: '-60%', opacity: 0 }}
          animate={{ x: '200vw', opacity: [0, 0.3, 0] }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
            delay: 0,
          }}
          style={{ top: '20%', width: '60%', left: '-60%' }}
        />
        <motion.div
          className="geo-line"
          initial={{ x: '-80%', opacity: 0 }}
          animate={{ x: '200vw', opacity: [0, 0.3, 0] }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
            delay: 2,
          }}
          style={{ top: '50%', width: '80%', right: '-80%' }}
        />
        <motion.div
          className="geo-line"
          initial={{ x: '-50%', opacity: 0 }}
          animate={{ x: '200vw', opacity: [0, 0.3, 0] }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
            delay: 4,
          }}
          style={{ top: '75%', width: '50%', left: '-50%' }}
        />
      </div>
      <div className="diagonal-accent" />
    </>
  );
};

export default GeometricBackground;
