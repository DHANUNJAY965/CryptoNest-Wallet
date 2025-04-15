"use client";
import React from "react";
import { SparklesCore } from "./sparkles-core";
import { Wallet, Coins } from "lucide-react";

export function SparklesPreview() {
  return (
    <div className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 relative z-20 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center text-white">
          Crypto<span className="text-gradient">Nest</span>
        </h1>
        
        {/* Wallet manager text positioned below the CryptoNest title */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          <p className="text-base sm:text-lg text-muted-foreground ">
            Your secure multi-chain wallet manager
          </p>
          <Coins className="w-10 h-4 sm:w-14 sm:h-5" />
        </div>
      </div>
    </div>
  );
}