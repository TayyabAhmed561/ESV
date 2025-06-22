import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface Model3DViewerProps {
  modelPath: string;
  className?: string;
}

function Model({ modelPath }: { modelPath: string }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Auto-rotate the model slowly
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

const Model3DViewer: React.FC<Model3DViewerProps> = ({ modelPath, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={`w-full h-full relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <div className="text-center text-red-600">
            <p className="text-sm">Failed to load 3D model</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        onCreated={() => setIsLoading(false)}
        onError={(error) => {
          setError(error.message);
          setIsLoading(false);
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.7} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <spotLight position={[-8, 6, 8]} angle={0.3} penumbra={0.5} intensity={1.2} castShadow />
          <Model modelPath={modelPath} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default Model3DViewer; 