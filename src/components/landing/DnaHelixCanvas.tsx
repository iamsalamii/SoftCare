import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DnaHelixCanvasProps {
  className?: string;
}

export const DnaHelixCanvas: React.FC<DnaHelixCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for DNA helix
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Geometry & Materials
    const sphereGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const strand1Mat = new THREE.MeshBasicMaterial({ color: 0x00dc82 });
    const strand2Mat = new THREE.MeshBasicMaterial({ color: 0x45f99c });
    const rungMat = new THREE.MeshBasicMaterial({
      color: 0x3fd0c9,
      transparent: true,
      opacity: 0.55,
    });

    const numPoints = 36;
    const radius = 3.6;
    const height = 24;
    const turns = 2.4;

    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Strand 1 node
      const node1 = new THREE.Mesh(sphereGeo, strand1Mat);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(sphereGeo, strand2Mat);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      // Base pair connecting bar (rung)
      const p1 = new THREE.Vector3(x1, y, z1);
      const p2 = new THREE.Vector3(x2, y, z2);
      const distance = p1.distanceTo(p2);
      const rungGeo = new THREE.CylinderGeometry(0.08, 0.08, distance, 8);
      const rung = new THREE.Mesh(rungGeo, rungMat);

      rung.position.copy(p1).add(p2).multiplyScalar(0.5);
      rung.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        p2.clone().sub(p1).normalize()
      );
      dnaGroup.add(rung);
    }

    // Slight initial tilt
    dnaGroup.rotation.z = 0.25;

    // Mouse interaction tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      if (!prefersReducedMotion) {
        dnaGroup.rotation.y += 0.008;
      }
      // Smooth lerp to mouse targets
      dnaGroup.rotation.x += (targetRotationX - dnaGroup.rotation.x) * 0.05;
      dnaGroup.rotation.y += (targetRotationY * 0.02);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      strand1Mat.dispose();
      strand2Mat.dispose();
      rungMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[320px] pointer-events-none ${className}`}
      aria-label="Simulation moléculaire 3D de double hélice ADN pharmacogénétique"
    />
  );
};
