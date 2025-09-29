"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlassBgProps {
  children?: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  radius?: number;
  depth?: number;
  blur?: number;
  chromaticAberration?: number;
  strength?: number;
  debug?: boolean;
}

export function GlassBg({ 
  children, 
  className,
  width = 200,
  height = 200,
  radius = 50,
  depth: baseDepth = 10,
  blur = 1,
  chromaticAberration = 5,
  strength = 100,
  debug = false
}: GlassBgProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef(baseDepth);

  const getDisplacementMap = ({
    height,
    width,
    radius,
    depth,
  }: {
    height: number;
    width: number;
    radius: number;
    depth: number;
  }) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
          .mix { mix-blend-mode: screen; }
      </style>
      <defs>
          <linearGradient 
            id="Y" 
            x1="0" 
            x2="0" 
            y1="${Math.ceil((radius / height) * 15)}%" 
            y2="${Math.floor(100 - (radius / height) * 15)}%">
              <stop offset="0%" stop-color="#0F0" />
              <stop offset="100%" stop-color="#000" />
          </linearGradient>
          <linearGradient 
            id="X" 
            x1="${Math.ceil((radius / width) * 15)}%" 
            x2="${Math.floor(100 - (radius / width) * 15)}%"
            y1="0" 
            y2="0">
              <stop offset="0%" stop-color="#F00" />
              <stop offset="100%" stop-color="#000" />
          </linearGradient>
      </defs>

      <rect x="0" y="0" height="${height}" width="${width}" fill="#808080" />
      <g filter="blur(1px)">
        <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
        <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#Y)"
            class="mix"
        />
        <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#X)"
            class="mix"
        />
        <rect
            x="${depth}"
            y="${depth}"
            height="${height - 2 * depth}"
            width="${width - 2 * depth}"
            fill="#808080"
            rx="${radius}"
            ry="${radius}"
            filter="blur(${depth}px)"
        />
      </g>
  </svg>`);

  const getDisplacementFilter = ({
    height,
    width,
    radius,
    depth,
    strength = 100,
    chromaticAberration = 0,
  }: {
    height: number;
    width: number;
    radius: number;
    depth: number;
    strength?: number;
    chromaticAberration?: number;
  }) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
          <filter id="displace" color-interpolation-filters="sRGB">
              <feImage x="0" y="0" height="${height}" width="${width}" href="${getDisplacementMap({
      height,
      width,
      radius,
      depth,
    })}" result="displacementMap" />
              
              <!-- Red channel displacement (strongest offset for prismatic effect) -->
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="displacementMap"
                  scale="${strength + chromaticAberration * 4}"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
              <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="displacedR"
                      />
              
              <!-- Green channel displacement (medium offset) -->
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="displacementMap"
                  scale="${strength + chromaticAberration * 2}"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
              <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="displacedG"
                      />
              
              <!-- Blue channel displacement (minimal offset) -->
              <feDisplacementMap
                      in="SourceGraphic"
                      in2="displacementMap"
                      scale="${strength + chromaticAberration * 0.5}"
                      xChannelSelector="R"
                      yChannelSelector="G"
                  />
                  <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0
                          0 0 0 0 0
                          0 0 1 0 0
                          0 0 0 1 0"
                  result="displacedB"
                          />
                          
                <!-- Combine channels for prismatic rainbow effect -->
                <feBlend in="displacedR" in2="displacedG" mode="screen" result="rg"/>
                <feBlend in="rg" in2="displacedB" mode="screen"/>
          </filter>
      </defs>
  </svg>`) +
    "#displace";

  const setStyle = () => {
    if (!elementRef.current) return;
    
    const style = `
      height: ${height}px;
      width: ${width}px;
      border-radius: ${radius}px;
      backdrop-filter: blur(${blur / 2}px) url('${getDisplacementFilter({
        height,
        width,
        radius,
        depth: depthRef.current,
        strength,
        chromaticAberration,
      })}') blur(${blur}px) brightness(1.1) saturate(1.5);
    `;

    if (debug) {
      const debugStyle = `
        background: url("${getDisplacementMap({
          height,
          width,
          radius,
          depth: depthRef.current,
        })}");
        box-shadow: none;
      `;
      elementRef.current.setAttribute("style", style + debugStyle);
    } else {
      elementRef.current.setAttribute("style", style);
    }
  };

  useEffect(() => {
    setStyle();
  }, [height, width, radius, blur, chromaticAberration, strength, debug]);

  const handleMouseDown = () => {
    depthRef.current = baseDepth / 0.7;
    setStyle();
  };

  const handleMouseUp = () => {
    depthRef.current = baseDepth;
    setStyle();
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "glass-element bg-white/40 shadow-[inset_0_0_4px_0px_white] cursor-pointer relative",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset on mouse leave
    >
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  );
}