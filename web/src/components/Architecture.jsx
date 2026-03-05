import { motion } from 'framer-motion';
import { Fragment } from 'react';

const pipelineSteps = [
  'CLI Input',
  'Git Diff',
  'Static Analysis',
  'AI Agents',
  'Confidence Filter',
  'Cache Layer',
  'Report',
];

const architectureFeatures = [
  {
    title: 'Static Analysis Layer',
    description:
      'Fast pattern matching for common issues. Secret scanning, regex-based vulnerability detection, and syntax analysis run instantly before AI agents.',
  },
  {
    title: 'AI Reasoning Layer',
    description:
      'Local LLM provides context-aware analysis. Understands semantic meaning, detects complex logic errors, and suggests intelligent improvements.',
  },
  {
    title: 'Caching Intelligence',
    description:
      'SQLite stores file hashes and previous findings. Unchanged code skips re-analysis. Learning system reduces false positives over time.',
  },
];

const Architecture = () => {
  return (
    <section id="architecture" className="architecture fade-in-section">
      <div className="container">
        <h2 className="section-title">SIGNAL PROCESSING PIPELINE</h2>
        <p className="section-subtitle">From code diff to actionable insights in milliseconds.</p>

        <div className="pipeline">
          {pipelineSteps.map((step, index) => (
            <Fragment key={index}>
              <motion.div
                className="pipeline-step"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {step}
              </motion.div>
              {index < pipelineSteps.length - 1 && (
                <motion.span
                  className="pipeline-arrow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
                >
                  →
                </motion.span>
              )}
            </Fragment>
          ))}
        </div>

        <div className="feature-grid" style={{ marginTop: '4rem' }}>
          {architectureFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
