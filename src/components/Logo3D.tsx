
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Model component - can be easily swapped for different models
function LogoModel({ modelPath = "/models/logo.glb" }: { modelPath?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Load the 3D model (fallback to a simple geometry if model fails to load)
  let scene;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch (error) {
    // Fallback to a simple 3D shape if model loading fails
    scene = null;
  }

  // Animate the model
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // If model loading failed, render a fallback 3D shape
  if (!scene) {
    return (
      <group ref={meshRef}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color="#4f46e5" 
            metalness={0.7} 
            roughness={0.3} 
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
}

// Fallback loading component
function LogoFallback() {
  return (
    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded animate-pulse" />
  );
}

const Logo3D = ({ modelPath }: { modelPath?: string }) => {
  return (
    <div className="w-12 h-8 cursor-pointer">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <LogoModel modelPath={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo3D;
