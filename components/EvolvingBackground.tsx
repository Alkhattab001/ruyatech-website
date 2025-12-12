'use client';

import { useEffect, useState } from 'react';

export default function EvolvingBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which era we're in based on scroll
  const getEra = () => {
    if (scrollProgress < 0.15) return 'vintage'; // Hero section
    if (scrollProgress < 0.4) return 'transition'; // About section
    return 'modern'; // Rest of the site
  };

  const era = getEra();

  return (
    <>
      {/* Vintage Era - Subtle professional version */}
      {era === 'vintage' && (
        <div className="fixed inset-0 -z-10">
          {/* Clean dark background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />

          {/* Very subtle grid - professional look */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184, 69, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184, 69, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Minimal accent glow */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent" />

          {/* Vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-40" />
        </div>
      )}

      {/* Transition Era - Subtle professional version */}
      {era === 'transition' && (
        <div className="fixed inset-0 -z-10">
          {/* Smooth gradient transition */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              background: `linear-gradient(180deg,
                rgba(10, 10, 10, 1) 0%,
                rgba(18, 10, 26, 1) 50%,
                rgba(10, 10, 10, 1) 100%
              )`
            }}
          />

          {/* Subtle purple accent */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
          </div>

          {/* Minimal grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184, 69, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184, 69, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          />
        </div>
      )}

      {/* Modern Era - Refined professional version */}
      {era === 'modern' && (
        <div className="fixed inset-0 -z-10">
          {/* Elegant dark base with subtle purple hint */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#12091f] to-[#0a0a0a]" />

          {/* Refined gradient mesh - much more subtle */}
          <div className="absolute inset-0 opacity-30">
            <div className="gradient-blob gradient-blob-1" />
            <div className="gradient-blob gradient-blob-2" />
            <div className="gradient-blob gradient-blob-3" />
          </div>

          {/* Minimal noise texture */}
          <div className="absolute inset-0 opacity-[0.01] mix-blend-soft-light bg-noise" />

          {/* Professional grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184, 69, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184, 69, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '120px 120px'
            }}
          />

          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />
        </div>
      )}

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }

        @keyframes floatTransition {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </>
  );
}
