'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLDivElement>(null);
  const purposeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable animations on mobile for better scroll performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const title = purposeRef.current?.querySelector('h2');
      const description = purposeRef.current?.querySelector('p');

      gsap.from(title, {
        scrollTrigger: {
          trigger: purposeRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from(description, {
        scrollTrigger: {
          trigger: purposeRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen px-6 relative flex items-center bg-gradient-to-b from-primary/5 to-background"
    >
      <div className="max-w-5xl mx-auto w-full px-4">
        <div ref={purposeRef}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-primary text-center">
            {t('purpose.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed" style={{ textAlign: 'justify', margin: '0 auto' }}>
            {t('purpose.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
