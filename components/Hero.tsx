'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Robot3D = dynamic(() => import('./Robot3D'), { ssr: false });

export default function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simplify animations on mobile
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Simple fade in on mobile
        gsap.from([logoRef.current, titleRef.current, subtitleRef.current], {
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.2,
          ease: 'power2.out'
        });
      } else {
        // Smooth animation on desktop
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from(logoRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.3
        })
        .from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1
        }, '-=0.5')
        .from(subtitleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1
        }, '-=0.5');
      }
    }, heroRef);

    // Hide scroll indicator on scroll
    const handleScroll = () => {
      if (scrollIndicatorRef.current) {
        const scrolled = window.scrollY;
        if (scrolled > 50) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="h-screen flex items-start md:items-center justify-center px-6 pt-32 md:pt-0 relative overflow-hidden bg-background"
    >
      {/* 3D Robot - Only visible on desktop, positioned on the right */}
      <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-auto z-10">
        <Robot3D />
      </div>

      {/* Centered content container */}
      <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full px-4 relative z-20">
        <div ref={logoRef} className="mb-8 md:mb-12 mt-8 md:mt-0">
          <Image
            src="/noBgColor.png"
            alt="RuyaTECH Logo"
            width={500}
            height={300}
            priority
            className="w-auto h-24 md:h-40 lg:h-48 mx-auto"
          />
        </div>

        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent leading-tight"
        >
          {t('title')}
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed max-w-4xl"
          style={{ textAlign: 'justify', textAlignLast: 'center', margin: '0 auto' }}
        >
          {t('subtitle')}
        </p>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className="mt-8 md:mt-10 animate-bounce">
          <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center border border-primary/40 hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 cursor-pointer shadow-lg shadow-primary/10">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
