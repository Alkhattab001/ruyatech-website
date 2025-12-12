'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable ScrollTrigger on mobile for better scroll performance
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      gsap.config({ force3D: true });
      ScrollTrigger.config({ limitCallbacks: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
