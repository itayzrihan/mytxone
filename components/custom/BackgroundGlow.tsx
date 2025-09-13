// src/components/BackgroundGlow.tsx
"use client";
import React from "react";

const BackgroundGlow = () => {
  return (
    <>
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundColor: '#000000',
          zIndex: -1
        }}
      >
        <div className="gradient" />
      </div>
      <style jsx>{`
        .gradient {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          filter: blur(50px);
          background-image: linear-gradient(45deg,rgba(0, 98, 246, 0.8),rgba(15, 93, 105, 0.8),rgba(33, 35, 148, 0.9));
          border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
          transform: translate(-50%, -50%);
          animation: 
            rotate 10s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite,
            breathe 200s ease-in-out infinite;
          mix-blend-mode: lighten;
        }
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
          }
        }
        @keyframes breathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
        @media (max-width: 500px) {
          .gradient {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </>
  );
};

export default BackgroundGlow;
