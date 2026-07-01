import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";
import { Stars } from "@react-three/drei";

function Globe() {
  const ref = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
    if (wire.current) wire.current.rotation.y -= dt * 0.05;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          color="#0b1226"
          emissive="#1e3a8a"
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>
      <mesh ref={wire} scale={1.02}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh scale={1.18}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function Ring({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * speed;
      ref.current.rotation.y += dt * speed * 0.6;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

export function Globe3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#60a5fa" intensity={2} />
      <pointLight position={[-5, -3, -2]} color="#a78bfa" intensity={1.5} />
      <Suspense fallback={null}>
        <Globe />
        <Ring radius={2.2} speed={0.4} color="#22d3ee" />
        <Ring radius={2.5} speed={-0.3} color="#a78bfa" />
        <Ring radius={2.8} speed={0.25} color="#60a5fa" />
        <Stars radius={40} depth={30} count={2000} factor={3} fade speed={0.8} />
      </Suspense>
    </Canvas>
  );
}
