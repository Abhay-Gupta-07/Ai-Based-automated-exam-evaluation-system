import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ParticlesBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8f8f6, 0.008);
    scene.background = new THREE.Color(0xf8f8f6);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 120;

    // Renderer with Anti-Aliasing and High DPR
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Count and Attributes
    const particleCount = 1100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Refined Palette (Graphite, Indigo, Cyan, Pink, Slate)
    const palette = [
      new THREE.Color(0x1e293b), // Slate 800
      new THREE.Color(0x334155), // Slate 700
      new THREE.Color(0x475569), // Slate 600
      new THREE.Color(0x4f46e5), // Indigo 600
      new THREE.Color(0x2563eb), // Blue 600
      new THREE.Color(0x0891b2), // Cyan 600
      new THREE.Color(0xdb2777), // Pink 600
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 320;

      velocities[i * 3] = (Math.random() - 0.5) * 0.04;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High-Resolution Smooth Radial Glow Particle Sprite Canvas (64x64)
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(spriteCanvas);
    tex.needsUpdate = true;

    // Points Material with Anti-Aliasing and Soft Alpha
    const mat = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: tex,
      alphaTest: 0.01,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const pSystem = new THREE.Points(geometry, mat);
    scene.add(pSystem);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.08;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.08;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.08;
        targetMouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.08;
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Particle system subtle rotation
      pSystem.rotation.y += 0.0012;
      pSystem.rotation.x += 0.0006;

      // Animate individual particles position drift
      const posArr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around bounds
        if (Math.abs(posArr[i * 3]) > 160) velocities[i * 3] *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 160) velocities[i * 3 + 1] *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 160) velocities[i * 3 + 2] *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);

      geometry.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    />
  );
};
