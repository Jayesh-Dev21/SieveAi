import { motion } from 'framer-motion';

const features = [
  {
    title: '100% Local-First',
    description:
      'Your code never leaves your machine. Uses Ollama for local LLM inference. No external API calls, no data collection, no privacy compromises.',
  },
  {
    title: 'Hybrid AI Engine',
    description:
      'Combines static pattern matching with AI reasoning. Multiple specialized agents for bugs, security vulnerabilities, and style issues work in parallel.',
  },
  {
    title: 'Lightning Fast',
    description:
      'SQLite-based caching system stores previous analyses. Incremental reviews only check what changed. Typical scans complete in under 3 seconds.',
  },
  {
    title: 'Confidence Filtering',
    description:
      'Adjustable confidence threshold (default ≥78%) eliminates false positives. Only see issues the AI is genuinely confident about.',
  },
  {
    title: 'Multi-Agent System',
    description:
      'Specialized AI agents focus on different concerns: BugAgent finds logic errors, SecurityAgent identifies vulnerabilities, StyleAgent improves maintainability.',
  },
  {
    title: 'Flexible Output',
    description:
      'Choose text, JSON, or interactive TUI formats. Integrate with CI/CD pipelines or use as a pre-commit hook. Works with your workflow.',
  },
];

const Features = () => {
  return (
    <section id="features" className="features fade-in-section">
      <div className="container">
        <h2 className="section-title">FILTER THE NOISE</h2>
        <p className="section-subtitle">
          Intelligent analysis powered by hybrid AI. Only the signal that matters.
        </p>

        <div className="feature-grid">
          {features.map((feature, index) => (
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

export default Features;
