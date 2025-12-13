'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Robot({ scrollProgress, isEntering, isMobile }: { scrollProgress: number; isEntering: boolean; isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/robot-new.glb');
  const { actions, names } = useAnimations(animations, group);
  const [enterProgress, setEnterProgress] = useState(0);

  // Adjust scale based on device
  const baseScale = isMobile ? 0.15 : 0.25;

  // Play animations
  useEffect(() => {
    if (actions && names.length > 0) {
      // Play first available animation (usually idle or fly)
      const action = actions['Idle'] || actions['idle'] || actions['Fly'] || actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  // Entrance animation progress - slower for dramatic effect
  useEffect(() => {
    if (isEntering) {
      const interval = setInterval(() => {
        setEnterProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.012; // Slower for more dramatic entrance
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isEntering]);

  useFrame((state) => {
    if (group.current) {
      const time = state.clock.elapsedTime;

      if (isEntering && enterProgress < 1) {
        // ENTRANCE ANIMATION - Different for mobile vs desktop
        const easeOut = 1 - Math.pow(1 - enterProgress, 3);

        if (isMobile) {
          // MOBILE: Simpler, smaller entrance
          if (enterProgress < 0.5) {
            // Phase 1: Fly in from side
            const phase1Progress = enterProgress / 0.5;
            const phase1Ease = 1 - Math.pow(1 - phase1Progress, 2);

            group.current.position.z = THREE.MathUtils.lerp(5, 0.5, phase1Ease);
            group.current.position.y = THREE.MathUtils.lerp(2, 0, phase1Ease);
            group.current.position.x = THREE.MathUtils.lerp(-3, 0, phase1Ease);
            group.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 2, 0, phase1Ease);

            // Moderate size entrance for mobile
            const enterScale = THREE.MathUtils.lerp(0.03, 0.35, phase1Ease);
            group.current.scale.setScalar(enterScale);

          } else {
            // Phase 2: Settle to idle size
            const phase2Progress = (enterProgress - 0.5) / 0.5;
            const phase2Ease = 1 - Math.pow(1 - phase2Progress, 2);

            group.current.position.z = THREE.MathUtils.lerp(0.5, 0, phase2Ease);
            group.current.position.y = 0;
            group.current.position.x = 0;
            group.current.rotation.y = Math.sin(phase2Progress * Math.PI) * 0.2;

            const shrinkScale = THREE.MathUtils.lerp(0.35, baseScale, phase2Ease);
            group.current.scale.setScalar(shrinkScale);
          }

        } else {
          // DESKTOP: Big dramatic entrance
          if (enterProgress < 0.6) {
            const phase1Progress = enterProgress / 0.6;
            const phase1Ease = 1 - Math.pow(1 - phase1Progress, 2);

            group.current.position.z = THREE.MathUtils.lerp(15, 1, phase1Ease);
            group.current.position.y = THREE.MathUtils.lerp(8, 0.5, phase1Ease);
            group.current.position.x = THREE.MathUtils.lerp(-8, 0, phase1Ease);
            group.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 3, 0, phase1Ease);

            const enterScale = THREE.MathUtils.lerp(0.05, 0.9, phase1Ease);
            group.current.scale.setScalar(enterScale);

          } else {
            const phase2Progress = (enterProgress - 0.6) / 0.4;
            const phase2Ease = 1 - Math.pow(1 - phase2Progress, 2);

            group.current.position.z = THREE.MathUtils.lerp(1, 0, phase2Ease);
            group.current.position.y = THREE.MathUtils.lerp(0.5, 0, phase2Ease);
            group.current.position.x = 0;
            group.current.rotation.y = Math.sin(phase2Progress * Math.PI) * 0.3;

            const shrinkScale = THREE.MathUtils.lerp(0.9, baseScale, phase2Ease);
            group.current.scale.setScalar(shrinkScale);
          }
        }

      } else {
        // IDLE STATE ONLY - Robot stays in hero section
        const floatAmount = isMobile ? 0.03 : 0.05;

        // Base floating animation
        const baseY = Math.sin(time * 1.5) * floatAmount;
        const baseX = Math.sin(time * 0.5) * (floatAmount * 0.6);

        // Hide robot completely when scrolled (scale to 0)
        if (scrollProgress > 0.02) {
          group.current.scale.setScalar(0);
        } else {
          // Idle state - gentle floating at hero section only
          group.current.position.y = baseY;
          group.current.position.x = baseX;
          group.current.position.z = 0;
          group.current.rotation.y = Math.sin(time * 0.3) * 0.2;
          group.current.rotation.z = 0;
          group.current.scale.setScalar(baseScale);
        }
      }
    }
  });

  return (
    <group ref={group} scale={baseScale} position={[0, -25, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#b845ff" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#b845ff" />
      <pointLight position={[-3, 0, 3]} intensity={0.4} color="#d175ff" />
    </>
  );
}

export default function Robot3D({ isMobile = false }: { isMobile?: boolean }) {
  const [scroll, setScroll] = useState(0);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    // Start entrance animation
    setIsEntering(true);

    // After entrance, switch to normal mode (longer for dramatic entrance)
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 4500);

    const onScroll = () => {
      const s = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;
      setScroll(h > 0 ? s / h : 0);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, isMobile ? 4 : 3.5], fov: isMobile ? 50 : 55 }}>
        <Lights />

        <Suspense fallback={null}>
          <Robot scrollProgress={scroll} isEntering={isEntering} isMobile={isMobile} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/robot-new.glb');
