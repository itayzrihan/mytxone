// src/components/BackgroundGlow.tsx
"use client";
import React from "react";

const BackgroundGlow = () => {
  return (
    <>
      <div className="background-glow">
        <div className="gradient" />
      </div>
      <style jsx>{`
        .background-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          transform: translate(-50%, -50%);
          z-index: -1; /* Behind your content */
          pointer-events: none;
          overflow: hidden;
          background-color: black; /* Adding black background */
        }
        .gradient {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          filter: blur(50px);
          background-image: linear-gradient(45deg,rgb(0, 98, 246),rgb(15, 93, 105),rgb(33, 35, 148));
          border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
          /* Center the gradient */
          transform: translate(-50%, -50%);
          animation: 
            rotate 10s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite,
            breathe 8s ease-in-out infinite; /* Add breathing animation */
          mix-blend-mode: lighten; /* This helps the glow blend with the dark background */
        }
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
          }
        }
        /* New breathing animation */
        @keyframes breathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
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
