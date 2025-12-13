'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Robot3D = dynamic(() => import('./Robot3D'), {
  ssr: false
});

export default function FixedRobot() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '-15%' : '-5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '200px' : '500px',
        height: isMobile ? '300px' : '500px',
        pointerEvents: 'none',
        zIndex: 9999,
        background: 'transparent',
        overflow: 'visible'
      }}
    >
      <Robot3D isMobile={isMobile} />
    </div>
  );
}
