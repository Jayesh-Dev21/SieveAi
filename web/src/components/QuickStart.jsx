import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Install SieveAi',
    description: 'Install globally via npm or locally in your project:',
    code: `# Install globally for CLI usage
npm install -g sieveai

# Or install locally in your project
npm install --save-dev sieveai`,
  },
  {
    number: '02',
    title: 'Setup LLM Backend',
    description:
      'SieveAi uses Ollama for local LLM inference. Install it and pull a supported model:',
    code: `# Install from https://ollama.ai
ollama pull gemma3:latest
# or
ollama pull deepseek-coder:latest`,
  },
  {
    number: '03',
    title: 'Run Your First Review',
    description: 'Navigate to any git repository and run:',
    code: `sieveai check

# Or compare branches
sieveai check --base main --target feature-branch

# Adjust confidence threshold
sieveai check --min-confidence 85

# Output as JSON for CI/CD
sieveai check --format json

# If installed locally:
npx sieveai check`,
  },
];

const QuickStart = () => {
  return (
    <section id="quickstart" className="quickstart fade-in-section">
      <div className="container">
        <h2 className="section-title">GET STARTED IN 60 SECONDS</h2>
        <p className="section-subtitle">Three commands. One powerful tool.</p>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="code-block">
                  <code>{step.code}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStart;
