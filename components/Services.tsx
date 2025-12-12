'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const servicesCount = 6;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const subtitle = sectionRef.current?.querySelector('p');

      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: isMobile ? 30 : 60,
        duration: isMobile ? 0.6 : 1,
        ease: 'power3.out'
      });

      if (subtitle) {
        gsap.from(subtitle, {
          scrollTrigger: {
            trigger: subtitle,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isMobile ? 20 : 40,
          duration: isMobile ? 0.6 : 1,
          delay: 0.2,
          ease: 'power3.out'
        });
      }

      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isMobile ? 30 : 60,
          duration: isMobile ? 0.6 : 1,
          delay: isMobile ? index * 0.08 : index * 0.15,
          ease: 'power3.out'
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen px-6 py-16 relative flex items-center bg-background"
    >
      <div className="max-w-7xl mx-auto w-full px-4">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 text-primary"
        >
          {t('title')}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-foreground/90 mb-8 md:mb-10 max-w-4xl" style={{ textAlign: 'justify', margin: '0 auto 2rem auto' }}>
          {t('subtitle')}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6">
          {Array.from({ length: servicesCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative p-6 md:p-8 rounded-2xl bg-background border border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">
                {t(`items.${index}.title`)}
              </h3>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed" style={{ textAlign: 'justify' }}>
                {t(`items.${index}.description`)}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
