"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  network: 'Ethereum' | 'Solana';
  onClick?: () => void;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  className,
  network,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl transition-all duration-500",
        className
      )}
    >
      <div
        className={cn(
          "absolute -inset-px rounded-xl transition-all duration-500",
          "bg-gradient-to-r opacity-25 blur-sm group-hover:opacity-100 group-hover:blur-md",
          network === 'Ethereum'
            ? "from-blue-500 via-blue-400 to-blue-500"
            : "from-purple-500 via-purple-400 to-purple-500"
        )}
      />
      
    </div>
  );
};