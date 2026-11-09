import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type CoreState = 'idle' | 'listening' | 'processing' | 'speaking';

function Core({ state }: { state: CoreState }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const speed = state === 'processing' ? 1.7 : state === 'listening' ? 1.15 : state === 'speaking' ? 1.35 : 0.42;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * 0.12 * speed;
    if (core.current) {
      const pulse = 1 + Math.sin(t * (state === 'speaking' ? 8 : 2.2)) * (state === 'idle' ? 0.025 : 0.075);
      core.current.scale.setScalar(pulse);
    }
    if (ringA.current) { ringA.current.rotation.x = 0.8 + t * 0.12 * speed; ringA.current.rotation.z = t * 0.08; }
    if (ringB.current) { ringB.current.rotation.y = t * -0.18 * speed; ringB.current.rotation.x = 1.8; }
    if (ringC.current) { ringC.current.rotation.z = t * 0.22 * speed; ringC.current.rotation.x = 0.35; }
  });

  const glow = state === 'listening' ? '#ffdf86' : state === 'processing' ? '#ffb547' : '#d9a84f';
  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.78, 5]} />
        <meshStandardMaterial color="#3a2410" emissive={glow} emissiveIntensity={state === 'processing' ? 2.8 : 1.8} metalness={0.82} roughness={0.18} wireframe />
      </mesh>
      <mesh scale={0.63}>
        <icosahedronGeometry args={[0.78, 4]} />
        <meshBasicMaterial color="#ffdc8a" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[1.22, 0.012, 8, 180]} />
        <meshBasicMaterial color="#e4b75e" transparent opacity={0.85} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[1.48, 0.008, 8, 180]} />
        <meshBasicMaterial color="#b98235" transparent opacity={0.62} />
      </mesh>
      <mesh ref={ringC}>
        <torusGeometry args={[1.72, 0.006, 8, 180]} />
        <meshBasicMaterial color="#f4d58b" transparent opacity={0.42} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 12) * Math.PI * 2) * 1.92, Math.sin((i / 12) * Math.PI * 2) * 1.92, 0]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshBasicMaterial color="#ffdc8a" />
        </mesh>
      ))}
    </group>
  );
}

function StarField({ state }: { state: CoreState }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(720 * 3);
    for (let i = 0; i < 720; i++) {
      data[i * 3] = (Math.random() - 0.5) * 12;
      data[i * 3 + 1] = (Math.random() - 0.5) * 8;
      data[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return data;
  }, []);
  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * (state === 'processing' ? 0.035 : 0.009);
      points.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.12) * 0.025;
    }
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#d8b66f" size={0.018} transparent opacity={0.58} sizeAttenuation />
    </points>
  );
}

export default function OrbScene({ state }: { state: CoreState }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.7], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 2, 4]} intensity={22} color="#ffcf72" />
      <pointLight position={[-3, -2, -2]} intensity={9} color="#9c6329" />
      <StarField state={state} />
      <Core state={state} />
    </Canvas>
  );
}
