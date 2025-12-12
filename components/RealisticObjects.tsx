'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import RobotMessages from './RobotMessages'; // REMOVED - will add back with new robot

export default function RealisticObjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentEra, setCurrentEra] = useState<'vintage' | 'transition' | 'modern'>('vintage');
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const startTime = useRef(Date.now());
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    oldComputer: THREE.Group | null;
  } | null>(null);

  // Track scroll for era changes and scroll speed
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = window.scrollY / totalHeight;

          setScrollProgress(progress);

          if (progress < 0.15) setCurrentEra('vintage');
          else if (progress < 0.4) setCurrentEra('transition');
          else setCurrentEra('modern');

          // Calculate scroll speed
          const now = Date.now();
          const deltaY = Math.abs(window.scrollY - lastScrollY.current);
          const deltaTime = now - lastScrollTime.current;
          const speed = deltaTime > 0 ? deltaY / deltaTime : 0;

          setScrollSpeed(speed);
          lastScrollY.current = window.scrollY;
          lastScrollTime.current = now;

          // Decay scroll speed over time
          setTimeout(() => {
            setScrollSpeed((prev) => prev * 0.9);
          }, 100);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Renderer - optimize for mobile performance
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2)); // Lower pixel ratio on mobile
    renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    // No tone mapping - preserve original colors exactly
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // Simple lighting to preserve true colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Store loaded models
    let oldComputerModel: THREE.Group | null = null;

    // Test cube removed - 3D scene is working fine

    // GLTF Loader
    const loader = new GLTFLoader();

    // OLD COMPUTER REMOVED
    // To add it back, uncomment the code below
    /*
    loader.load(
      '/models/old-computer.glb',
      (gltf) => {
        oldComputerModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(oldComputerModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        oldComputerModel.scale.set(scale, scale, scale);
        oldComputerModel.position.set(-3, -1, 0);
        oldComputerModel.rotation.y = Math.PI / 6;
        oldComputerModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(oldComputerModel);
        if (sceneRef.current) {
          sceneRef.current.oldComputer = oldComputerModel;
        }
      },
      (progress) => console.log('Loading computer:', (progress.loaded / progress.total * 100).toFixed(2) + '%'),
      (error) => console.error('Error loading old computer:', error)
    );
    */

    // ROBOT REMOVED - User preference
    // To add it back, uncomment the robot loading code below

    sceneRef.current = {
      scene,
      camera,
      renderer,
      oldComputer: null,
    };

    // Animation loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  // Era-based effects (models removed, keeping for future use)
  useEffect(() => {
    if (!sceneRef.current) return;
    // When models are added back, this will control their visibility based on scroll
  }, [currentEra]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }} // Low z-index, behind content
    />
  );
}
