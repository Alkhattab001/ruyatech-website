'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function RobotModel() {
  const robotRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/robot.glb');

  useFrame((state) => {
    if (robotRef.current) {
      // Smooth floating animation
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      // Gentle rotation
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <primitive
      ref={robotRef}
      object={scene}
      scale={2.5}
      position={[0, 0, 0]}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#b845ff" wireframe />
    </mesh>
  );
}

export default function Robot3D() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas
        className="!absolute !inset-0"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        {/* Lighting setup for realistic look */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#b845ff" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#b845ff" />

        {/* Environment for reflections */}
        <Environment preset="city" />

        <Suspense fallback={<LoadingFallback />}>
          <RobotModel />
        </Suspense>

        {/* Allow user to rotate the robot */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/robot.glb');
