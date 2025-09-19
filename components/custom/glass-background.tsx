"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlassBackgroundProps {
  className?: string;
  depth?: number;
  blur?: number;
  chromaticAberration?: number;
  strength?: number;
  debug?: boolean;
}

export function GlassBackground({ 
  className,
  depth: baseDepth = 10,
  blur = 1,
  chromaticAberration = 5,
  strength = 100,
  debug = false
}: GlassBackgroundProps) {
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

  const updateGlassEffect = () => {
    if (!elementRef.current) return;
    
    const parent = elementRef.current.parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(parent);
    
    // Extract all border radius values to handle different corner radii
    const borderTopLeftRadius = parseInt(computedStyle.borderTopLeftRadius) || 0;
    const borderTopRightRadius = parseInt(computedStyle.borderTopRightRadius) || 0;
    const borderBottomLeftRadius = parseInt(computedStyle.borderBottomLeftRadius) || 0;
    const borderBottomRightRadius = parseInt(computedStyle.borderBottomRightRadius) || 0;
    
    // Use the maximum radius for the glass effect calculation
    const maxRadius = Math.max(
      borderTopLeftRadius, 
      borderTopRightRadius, 
      borderBottomLeftRadius, 
      borderBottomRightRadius
    );
    
    // Also check for the shorthand border-radius property
    const borderRadius = parseInt(computedStyle.borderRadius) || maxRadius;
    
    console.log('Detected border radius:', borderRadius, 'px from parent element');
    
    const style = `
      backdrop-filter: blur(${blur / 2}px) url('${getDisplacementFilter({
        height: rect.height || 100,
        width: rect.width || 100,
        radius: borderRadius,
        depth: depthRef.current,
        strength,
        chromaticAberration,
      })}') blur(${blur}px) brightness(0.7) saturate(1.5);
      background: rgba(${className?.includes('bright') ? '255, 255, 255' : '0, 0, 0'}, 0.1);
      border-radius: ${computedStyle.borderRadius || `${borderRadius}px`};
    `;

    if (debug) {
      const debugStyle = `
        background: url("${getDisplacementMap({
          height: rect.height || 100,
          width: rect.width || 100,
          radius: borderRadius,
          depth: depthRef.current,
        })}");
        border: 2px solid red;
      `;
      elementRef.current.setAttribute("style", style + debugStyle);
    } else {
      elementRef.current.setAttribute("style", style);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // Add a small delay to ensure CSS has been applied
      setTimeout(updateGlassEffect, 10);
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (elementRef.current && elementRef.current.parentElement) {
      // Observe the parent element for size/style changes
      resizeObserver.observe(elementRef.current.parentElement);
      handleResize();
    }

    // Also listen for style changes on the parent
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          handleResize();
        }
      });
    });

    if (elementRef.current && elementRef.current.parentElement) {
      mutationObserver.observe(elementRef.current.parentElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [blur, chromaticAberration, strength, debug]);

  const handleMouseDown = () => {
    depthRef.current = baseDepth / 0.7;
    updateGlassEffect();
  };

  const handleMouseUp = () => {
    depthRef.current = baseDepth;
    updateGlassEffect();
  };

return (
    <div
        ref={elementRef}
        className={cn(
            "absolute inset-0 pointer-events-none",
            className?.includes('bright') 
                ? "bg-white/10 shadow-[inset_0_0_4px_0px_white]"
                : "bg-black/10 shadow-[inset_0_0_4px_0px_rgba(255,255,255,0.3)]",
            className
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
            zIndex: 0, // Ensure it's behind content
        }}
    />
);
}

// HOC version for easier application
export function withGlassBackground<T extends object>(
  Component: React.ComponentType<T>,
  glassProps?: Partial<GlassBackgroundProps>
) {
  return function GlassWrappedComponent(props: T) {
    return (
      <div className="relative">
        <GlassBackground {...glassProps} />
        <Component {...props} />
      </div>
    );
  };
}