'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModernEra, setIsModernEra] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    shapes: THREE.Mesh[];
  } | null>(null);

  // Check if we're in the modern era (40%+ scroll)
  // Disable on mobile for better performance
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsModernEra(false);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setIsModernEra(progress >= 0.4);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isModernEra) return;

    // Reduce complexity on mobile for better performance
    const isMobile = window.innerWidth < 768;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, isMobile ? 0.012 : 0.008); // More fog on mobile for simpler rendering

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create particle field - reduced for subtlety and mobile performance
    const particleCount = isMobile ? 400 : 800; // Fewer particles on mobile
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position particles in a tunnel formation
      const radius = Math.random() * 15 + 2;
      const angle = Math.random() * Math.PI * 2;
      const depth = Math.random() * 100 - 50;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = depth;

      // Purple color variations
      const colorVariation = Math.random() * 0.3 + 0.7;
      colors[i3] = 0.72 * colorVariation;     // R
      colors[i3 + 1] = 0.27 * colorVariation; // G
      colors[i3 + 2] = 1.0 * colorVariation;  // B
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1, // Smaller particles
      vertexColors: true,
      transparent: true,
      opacity: 0.4, // More subtle
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create geometric shapes
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.4),
    ];

    const shapeCount = isMobile ? 6 : 12; // Even fewer shapes on mobile
    for (let i = 0; i < shapeCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xb845ff),
        wireframe: true,
        transparent: true,
        opacity: 0.25, // More transparent
      });

      const mesh = new THREE.Mesh(geometry, material);

      const radius = Math.random() * 10 + 5;
      const angle = Math.random() * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 10,
        Math.random() * 50 - 25
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shapes.push(mesh);
      scene.add(mesh);
    }

    sceneRef.current = { scene, camera, renderer, particles, shapes };

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
        shape.rotation.y += 0.002 * (index % 3 === 0 ? 1 : -1);
      });

      // Rotate particle field slowly
      particles.rotation.z += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Scroll handler - optimized with requestAnimationFrame
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollProgress = window.scrollY / (window.innerHeight * 2);

          // Move camera forward (dive effect)
          camera.position.z = 5 - scrollProgress * 30;

          // Add rotation for more dynamic feel
          camera.rotation.z = scrollProgress * 0.2;

          // Move shapes backwards (relative to camera)
          shapes.forEach((shape, index) => {
            shape.position.z = (shape.position.z + scrollProgress * 0.5) % 50 - 25;
          });

          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      geometries.forEach(geo => geo.dispose());
      shapes.forEach(shape => {
        if (shape.geometry) shape.geometry.dispose();
        if (shape.material) (shape.material as THREE.Material).dispose();
      });
    };
  }, [isModernEra]);

  if (!isModernEra) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
      style={{ zIndex: 0, opacity: isModernEra ? 1 : 0 }}
    />
  );
}
