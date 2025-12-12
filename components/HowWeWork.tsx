'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

export default function HowWeWork() {
  const t = useTranslations('howWeWork');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stepsCount = 4;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
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

      stepsRef.current.forEach((step, index) => {
        if (isMobile) {
          // Simpler animation on mobile
          gsap.from(step, {
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
          });
        } else {
          // Full animation on desktop
          const number = step?.querySelector('.text-5xl, .text-7xl, .text-8xl');
          const title = step?.querySelector('h3');
          const description = step?.querySelector('p');

          if (number) {
            gsap.from(number, {
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              },
              opacity: 0,
              x: -50,
              duration: 1,
              ease: 'power3.out'
            });
          }

          if (title) {
            gsap.from(title, {
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              },
              opacity: 0,
              y: 40,
              duration: 1,
              delay: 0.2,
              ease: 'power3.out'
            });
          }

          if (description) {
            gsap.from(description, {
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              },
              opacity: 0,
              y: 30,
              duration: 1,
              delay: 0.3,
              ease: 'power3.out'
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen px-6 py-16 relative bg-background flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full px-4">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-10 text-primary text-center"
        >
          {t('title')}
        </h2>

        <div className="space-y-6 md:space-y-8">
          {Array.from({ length: stepsCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { stepsRef.current[index] = el; }}
              className="flex flex-col md:flex-row gap-4 md:gap-6 items-start group"
            >
              <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors min-w-[80px] md:min-w-[120px]">
                {t(`steps.${index}.number`)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-foreground group-hover:text-primary transition-colors">
                  {t(`steps.${index}.title`)}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-foreground/80 leading-relaxed" style={{ textAlign: 'justify' }}>
                  {t(`steps.${index}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
