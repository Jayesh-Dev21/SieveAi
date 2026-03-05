import { useEffect, useRef } from 'react';
import Architecture from './components/Architecture';
import Features from './components/Features';
import Footer from './components/Footer';
import GeometricBackground from './components/GeometricBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickStart from './components/QuickStart';
import './styles/App.css';

function App() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observerRef.current.observe(el);
    });

    // Smooth scroll for anchor links
    const handleClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="app">
      <GeometricBackground />
      <Header />
      <Hero />
      <Features />
      <Architecture />
      <QuickStart />
      <Footer />
    </div>
  );
}

export default App;
