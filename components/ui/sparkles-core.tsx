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

  useEffect(() => {
    const particleCount = particleDensity || 100;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      // Fix: Ensure minSize and maxSize are always defined with defaults
      size: Math.random() * ((maxSize ?? 2) - (minSize ?? 1)) + (minSize ?? 1),
      x: Math.random() * (particlesContainer.current?.offsetWidth || 0),
      y: Math.random() * (particlesContainer.current?.offsetHeight || 0),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    setParticles(newParticles);

    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [particleDensity, maxSize, minSize]);

  useEffect(() => {
    const animate = () => {
      setParticles((currentParticles) =>
        currentParticles.map((particle) => {
          let { x, y, vx, vy } = particle;
          const containerWidth = particlesContainer.current?.offsetWidth || 0;
          const containerHeight = particlesContainer.current?.offsetHeight || 0;

          x += vx;
          y += vy;

          if (x < 0 || x > containerWidth) vx = -vx;
          if (y < 0 || y > containerHeight) vy = -vy;

          // Mouse interaction
          if (mousePosition.x !== null && mousePosition.y !== null) {
            const dx = mousePosition.x - x;
            const dy = mousePosition.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              const angle = Math.atan2(dy, dx);
              const force = (100 - distance) * 0.001;
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
  }, [mousePosition]);

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

