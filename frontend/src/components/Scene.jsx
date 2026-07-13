import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Floating popcorn/ticket shapes for the background
const FloatingShapes = ({ mousePos }) => {
  const shapes = useRef();

  useFrame(({ clock }) => {
    if (shapes.current) {
      // Base rotation
      shapes.current.rotation.y = clock.getElapsedTime() * 0.05;
      shapes.current.rotation.x = clock.getElapsedTime() * 0.02;

      // Parallax effect based on mouse position
      // Smoothly interpolate current rotation towards target rotation
      const targetX = (mousePos.y - 0.5) * 0.5;
      const targetY = (mousePos.x - 0.5) * 0.5;

      shapes.current.rotation.x += (targetX - shapes.current.rotation.x) * 0.05;
      shapes.current.rotation.y += (targetY - shapes.current.rotation.y) * 0.05;
    }
  });

  // Generate random positions for geometric shapes
  const boxes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20 - 10;
      const scale = Math.random() * 0.5 + 0.1;
      temp.push({ position: [x, y, z], scale });
    }
    return temp;
  }, []);

  return (
    <group ref={shapes}>
      {boxes.map((props, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={3}>
          <mesh position={props.position} scale={props.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#e50914" : "#2a2a2a"}
              wireframe={i % 5 === 0}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export default function Scene() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 bg-brand-black fixed">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#0a0a0a']} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#e50914" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={15} size={3} speed={0.4} opacity={0.3} color="#e50914" />

        <FloatingShapes mousePos={mousePos} />

        {/* Fog to blend the background smoothly */}
        <fog attach="fog" args={['#0a0a0a', 5, 30]} />
      </Canvas>
    </div>
  );
}