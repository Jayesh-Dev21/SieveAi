import { motion } from 'framer-motion';
import Terminal from './Terminal';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            LOCAL-FIRST • AI POWERED • PRIVACY-FOCUSED
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            NOISE OUT.
            <br />
            <span className="highlight">SIGNAL IN.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI code review that never leaves your machine.
          </motion.p>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Hybrid static analysis + local LLM intelligence. Zero external API calls.
          </motion.p>

          <motion.div
            className="cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="#quickstart" className="btn btn-primary">
              GET STARTED
            </a>
            <a
              href="https://github.com/Jayesh-Dev21/SieveAi"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ON GITHUB
            </a>
          </motion.div>
        </div>

        <motion.div
          className="terminal-preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
