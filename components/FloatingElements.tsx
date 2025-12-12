'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const floatingElements = [
  // Robot avatars (geometric style matching logo)
  { type: 'robot', top: '10%', left: '5%', speed: 0.5, size: 80 },
  { type: 'robot', top: '45%', right: '8%', speed: 0.3, size: 100 },
  { type: 'robot', top: '75%', left: '10%', speed: 0.6, size: 90 },
];

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Disable heavy animations on mobile for better scroll performance
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      elementsRef.current.forEach((element, index) => {
        if (!element) return;

        const data = floatingElements[index];
        const speed = data.speed;

        // Only add parallax on desktop
        if (!isMobile) {
          gsap.to(element, {
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1, // Smooth scrub instead of true for better performance
            },
            y: `${speed * 500}px`,
            scale: 1 - (speed * 0.3),
            rotation: speed * 360,
            ease: 'none',
          });
        }

        // Simpler floating animation
        gsap.to(element, {
          y: '+=30',
          x: '+=20',
          duration: 3 + (index * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {floatingElements.map((item, index) => (
        <div
          key={index}
          ref={(el) => { elementsRef.current[index] = el; }}
          className="absolute opacity-30 hover:opacity-60 transition-opacity duration-300"
          style={{
            top: item.top,
            left: 'left' in item ? item.left : undefined,
            right: 'right' in item ? item.right : undefined,
            width: `${item.size}px`,
            height: `${item.size}px`,
          }}
        >
          {item.type === 'robot' ? (
            <div className="relative w-full h-full">
              {/* Geometric robot matching logo style */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                {/* Brain/head circle */}
                <circle cx="50" cy="25" r="15" fill="none" stroke="#b845ff" strokeWidth="3" />
                {/* Eyes */}
                <circle cx="45" cy="22" r="3" fill="#b845ff" />
                <circle cx="55" cy="22" r="3" fill="#b845ff" />
                {/* Body rectangle */}
                <rect x="35" y="45" width="30" height="35" fill="none" stroke="#b845ff" strokeWidth="3" rx="3" />
                {/* Circle detail in body */}
                <circle cx="50" cy="62" r="8" fill="none" stroke="#b845ff" strokeWidth="2" />
                <circle cx="50" cy="62" r="4" fill="#b845ff" />
                {/* Antenna */}
                <line x1="50" y1="10" x2="50" y2="15" stroke="#b845ff" strokeWidth="2" />
                <circle cx="48" cy="10" r="3" fill="#b845ff" />
                <circle cx="52" cy="10" r="3" fill="#b845ff" />
                {/* Legs */}
                <rect x="38" y="80" width="8" height="15" fill="#b845ff" rx="2" />
                <rect x="54" y="80" width="8" height="15" fill="#b845ff" rx="2" />
                {/* Arms */}
                <rect x="25" y="50" width="8" height="20" fill="none" stroke="#b845ff" strokeWidth="2" rx="2" />
                <rect x="67" y="50" width="8" height="20" fill="none" stroke="#b845ff" strokeWidth="2" rx="2" />
              </svg>
            </div>
          ) : (
            <div className="text-center flex items-center justify-center w-full h-full">
              <span
                className="drop-shadow-lg"
                style={{ fontSize: `${item.size * 0.8}px` }}
              >
                {item.emoji}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
