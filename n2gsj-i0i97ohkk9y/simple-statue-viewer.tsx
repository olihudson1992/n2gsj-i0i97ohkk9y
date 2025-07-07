"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"

// Simple statue component
function Statue() {
  const meshRef = useRef<THREE.Mesh>(null)

  // For now, let's use a placeholder geometry since .3mf might need special handling
  // You can replace this with the actual model loader once we get the format working
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

// Orange circular light component
function OrangeLight() {
  const lightRef = useRef<THREE.PointLight>(null)

  return (
    <>
      {/* Main orange point light */}
      <pointLight ref={lightRef} position={[2, 3, 2]} color="#FF6B35" intensity={2} distance={10} decay={2} />

      {/* Light helper visualization (optional - remove if you don't want to see it) */}
      <mesh position={[2, 3, 2]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#FF6B35" />
      </mesh>
    </>
  )
}

export default function SimpleStatueViewer() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }} gl={{ antialias: true }}>
        {/* Ambient light for basic visibility */}
        <ambientLight intensity={0.2} />

        {/* Our orange circular light */}
        <OrangeLight />

        {/* The statue */}
        <Statue />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* Camera controls */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
      </Canvas>
    </div>
  )
}
