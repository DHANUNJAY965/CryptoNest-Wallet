"use client";
import { useEffect, useRef, useState } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { motion } from "framer-motion";

export function SparklesCore({
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  className,
  id,
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  className?: string;
  id: string;
}) {
  const [particles, setParticles] = useState<Array<any>>([]);
  const mousePosition = useMousePosition();
  const particlesContainer = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Handle resize for responsiveness
  useEffect(() => {
    const updateSize = () => {
      if (particlesContainer.current) {
        setContainerSize({
          width: particlesContainer.current.offsetWidth,
          height: particlesContainer.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize particles
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    
    // Adjust particle density based on screen size
    const screenFactor = Math.min(containerSize.width, containerSize.height) / 1000;
    const adjustedDensity = Math.max(30, Math.floor((particleDensity || 100) * screenFactor));
    
    const newParticles = Array.from({ length: adjustedDensity }, (_, i) => ({
      id: i,
      size: Math.random() * ((maxSize ?? 2) - (minSize ?? 1)) + (minSize ?? 1),
      x: Math.random() * containerSize.width,
      y: Math.random() * containerSize.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    setParticles(newParticles);

    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [particleDensity, maxSize, minSize, containerSize]);

  // Animation loop
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    
    const animate = () => {
      setParticles((currentParticles) =>
        currentParticles.map((particle) => {
          let { x, y, vx, vy } = particle;
          
          x += vx;
          y += vy;

          if (x < 0 || x > containerSize.width) vx = -vx;
          if (y < 0 || y > containerSize.height) vy = -vy;

          // Mouse interaction - works on both mobile touch and desktop
          if (mousePosition.x !== null && mousePosition.y !== null) {
            const dx = mousePosition.x - x;
            const dy = mousePosition.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const interactionRadius = Math.min(100, containerSize.width / 8);
            
            if (distance < interactionRadius) {
              const angle = Math.atan2(dy, dx);
              const force = (interactionRadius - distance) * 0.001;
              vx -= Math.cos(angle) * force;
              vy -= Math.sin(angle) * force;
            }
          }

          return {
            ...particle,
            x: x,
            y: y,
            vx: vx * 0.99,
            vy: vy * 0.99,
          };
        })
      );

      frame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [mousePosition, containerSize]);

  return (
    <motion.div
      ref={particlesContainer}
      className={className}
      style={{
        position: "relative",
        background: background || "transparent",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            backgroundColor: particleColor || "#fff",
          }}
        />
      ))}
    </motion.div>
  );
}

