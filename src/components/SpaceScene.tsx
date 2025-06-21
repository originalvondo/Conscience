import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animated nebula particles
function NebulaParticles({ isDark }: { isDark: boolean }) {
  const mesh = useRef<THREE.Points>(null);
  const count = 1000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      if (isDark) {
        // Purple/blue nebula colors for dark mode
        colors[i * 3] = Math.random() * 0.5 + 0.5; // R
        colors[i * 3 + 1] = Math.random() * 0.3 + 0.2; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.8; // B
      } else {
        // Darker colors for light mode
        colors[i * 3] = Math.random() * 0.3; // R
        colors[i * 3 + 1] = Math.random() * 0.3; // G
        colors[i * 3 + 2] = Math.random() * 0.3; // B
      }
    }
    
    return { positions, colors };
  }, [count, isDark]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      mesh.current.rotation.y += 0.002;
      mesh.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Animated camera controller with scroll integration
function CameraController({ scrollY }: { scrollY: number }) {
  useFrame((state) => {
    // Base rotation from time
    const time = state.clock.elapsedTime * 0.1;
    
    // Add scroll influence to camera position - now affects Y position (vertical movement)
    const scrollInfluence = scrollY * 0.005; // Reduced multiplier for smoother movement

    state.camera.position.x = Math.sin(time) * 8;
    state.camera.position.z = Math.cos(time) * 8;
    state.camera.position.y = Math.sin(time * 0.5) * 2 + scrollInfluence; // Vertical scroll movement

    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Floating geometric shapes
function FloatingShapes({ isDark }: { isDark: boolean }) {
  const shapes = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shapes.current) {
      shapes.current.rotation.x += 0.001;
      shapes.current.rotation.y += 0.002;
      shapes.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  const shapeColor1 = isDark ? "#4f46e5" : "#1e293b";
  const shapeColor2 = isDark ? "#7c3aed" : "#334155";
  const shapeColor3 = isDark ? "#ec4899" : "#475569";

  return (
    <group ref={shapes}>
      {/* Torus */}
      <mesh position={[-5, 0, -5]}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshBasicMaterial color={shapeColor1} transparent opacity={0.3} wireframe />
      </mesh>
      
      {/* Octahedron */}
      <mesh position={[5, 2, -3]}>
        <octahedronGeometry args={[1]} />
        <meshBasicMaterial color={shapeColor2} transparent opacity={0.3} wireframe />
      </mesh>
      
      {/* Dodecahedron */}
      <mesh position={[3, -2, 5]}>
        <dodecahedronGeometry args={[0.8]} />
        <meshBasicMaterial color={shapeColor3} transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}

interface SpaceSceneProps {
  scrollY?: number;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({ scrollY = 0 }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const backgroundColor = isDark 
    ? 'linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)'
    : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: backgroundColor }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Stars background */}
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
                fade={isDark}
        speed={1}
      />
      
      {/* Animated nebula particles */}
      <NebulaParticles isDark={isDark} />
      
      {/* Floating geometric shapes */}
      <FloatingShapes isDark={isDark} />
      
      {/* Camera animation controller with scroll */}
      <CameraController scrollY={scrollY} />
    </Canvas>
  );
};

export default SpaceScene;