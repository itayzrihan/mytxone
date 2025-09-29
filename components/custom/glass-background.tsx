"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassBackgroundProps {
  className?: string;
  depth?: number;
  blur?: number;
  chromaticAberration?: number;
  strength?: number;
  debug?: boolean;
  // New configurable properties
  brightness?: number;
  saturation?: number;
  contrast?: number;
  opacity?: number;
  redMultiplier?: number;
  greenMultiplier?: number;
  blueMultiplier?: number;
  noiseIntensity?: number;
  distortionScale?: number;
  // New distortion & visual properties
  distortionSmoothness?: number;
  prismaIntensity?: number;
  glowIntensity?: number;
  glowSpread?: number;
  edgeSharpness?: number;
  refractionIndex?: number;
  surfaceRoughness?: number;
  liquidFlow?: number;
}

export function GlassBackground({ 
  className,
  depth: baseDepth = 10,
  blur = 1,
  chromaticAberration = 5,
  strength = 100,
  debug = false,
  // New configurable properties with defaults
  brightness = 0.7,
  saturation = 1.5,
  contrast = 1.0,
  opacity = 0.1,
  redMultiplier = 4,
  greenMultiplier = 2,
  blueMultiplier = 0.5,
  noiseIntensity = 1,
  distortionScale = 1,
  // New distortion & visual properties with defaults
  distortionSmoothness = 1,
  prismaIntensity = 1,
  glowIntensity = 0.3,
  glowSpread = 4,
  edgeSharpness = 1,
  refractionIndex = 1.5,
  surfaceRoughness = 0.5,
  liquidFlow = 1
}: GlassBackgroundProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef(baseDepth);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getDisplacementMap = useCallback(({
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
      <g filter="blur(${noiseIntensity * distortionSmoothness}px)">
        <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
        <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#Y)"
            class="mix"
            opacity="${prismaIntensity}"
        />
        <rect
            x="0"
            y="0"
            height="${height}"
            width="${width}"
            fill="url(#X)"
            class="mix"
            opacity="${prismaIntensity}"
        />
        <rect
            x="${depth * distortionScale * liquidFlow}"
            y="${depth * distortionScale * liquidFlow}"
            height="${height - 2 * depth * distortionScale * liquidFlow}"
            width="${width - 2 * depth * distortionScale * liquidFlow}"
            fill="#808080"
            rx="${radius / edgeSharpness}"
            ry="${radius / edgeSharpness}"
            filter="blur(${depth * distortionScale * surfaceRoughness}px)"
            opacity="${refractionIndex / 2}"
        />
      </g>
  </svg>`), [
    distortionScale,
    distortionSmoothness,
    edgeSharpness,
    liquidFlow,
    noiseIntensity,
    prismaIntensity,
    refractionIndex,
    surfaceRoughness,
  ]);

  const getDisplacementFilter = useCallback(({
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
                  scale="${(strength + chromaticAberration * redMultiplier * prismaIntensity) * distortionScale * refractionIndex}"
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
                  scale="${(strength + chromaticAberration * greenMultiplier * prismaIntensity) * distortionScale * refractionIndex}"
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
                      scale="${(strength + chromaticAberration * blueMultiplier * prismaIntensity) * distortionScale * refractionIndex}"
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
              
              <!-- Add glow effect -->
              <feGaussianBlur in="displacedR" stdDeviation="${glowSpread}" result="glowR"/>
              <feGaussianBlur in="displacedG" stdDeviation="${glowSpread}" result="glowG"/>
              <feGaussianBlur in="displacedB" stdDeviation="${glowSpread}" result="glowB"/>
              
              <feColorMatrix in="glowR" type="matrix" 
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 ${glowIntensity} 0" result="glowRedAdjusted"/>
              <feColorMatrix in="glowG" type="matrix" 
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 ${glowIntensity} 0" result="glowGreenAdjusted"/>
              <feColorMatrix in="glowB" type="matrix" 
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 ${glowIntensity} 0" result="glowBlueAdjusted"/>
                          
                <!-- Combine channels for prismatic rainbow effect with glow -->
                <feBlend in="displacedR" in2="displacedG" mode="screen" result="rg"/>
                <feBlend in="rg" in2="displacedB" mode="screen" result="rgb"/>
                <feBlend in="rgb" in2="glowRedAdjusted" mode="screen" result="rgbGlowR"/>
                <feBlend in="rgbGlowR" in2="glowGreenAdjusted" mode="screen" result="rgbGlowRG"/>
                <feBlend in="rgbGlowRG" in2="glowBlueAdjusted" mode="screen"/>
          </filter>
      </defs>
  </svg>`) +
    "#displace",
  [
    blueMultiplier,
    distortionScale,
    getDisplacementMap,
    glowIntensity,
    glowSpread,
    greenMultiplier,
    prismaIntensity,
    redMultiplier,
    refractionIndex,
  ]);

  const updateGlassEffect = useCallback(() => {
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
    
    // Mobile-optimized fallback style
    if (isMobile) {
      const mobileStyle = `
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, ${opacity * 0.8}) 0%,
          rgba(255, 255, 255, ${opacity * 0.4}) 25%,
          rgba(0, 255, 255, ${opacity * 0.3}) 50%,
          rgba(255, 0, 255, ${opacity * 0.3}) 75%,
          rgba(255, 255, 255, ${opacity * 0.1}) 100%
        );
        backdrop-filter: blur(${Math.min(blur * 2, 8)}px) brightness(${brightness}) saturate(${saturation});
        border-radius: ${computedStyle.borderRadius || `${borderRadius}px`};
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, ${glowIntensity * 0.5}),
          inset 0 0 ${glowSpread}px rgba(255, 255, 255, ${glowIntensity * 0.3}),
          0 0 ${glowSpread * 2}px rgba(255, 255, 255, ${glowIntensity * 0.2});
        border: 1px solid rgba(255, 255, 255, ${opacity * 2});
      `;
      elementRef.current.setAttribute("style", mobileStyle);
      return;
    }

    // Desktop: Full effect with SVG filters
    const style = `
      backdrop-filter: blur(${blur / 2}px) url('${getDisplacementFilter({
        height: rect.height || 100,
        width: rect.width || 100,
        radius: borderRadius,
        depth: depthRef.current,
        strength,
        chromaticAberration,
      })}') blur(${blur * distortionSmoothness}px) brightness(${brightness}) saturate(${saturation}) contrast(${contrast});
      background: rgba(${className?.includes('bright') ? '255, 255, 255' : '0, 0, 0'}, ${opacity});
      border-radius: ${computedStyle.borderRadius || `${borderRadius}px`};
      box-shadow: 
        inset 0 0 ${glowSpread * 2}px rgba(255, 255, 255, ${glowIntensity}),
        inset 0 0 ${glowSpread * 4}px rgba(0, 255, 255, ${glowIntensity * 0.3}),
        inset 0 0 ${glowSpread * 6}px rgba(255, 0, 255, ${glowIntensity * 0.2}),
        0 0 ${glowSpread}px rgba(255, 255, 255, ${glowIntensity * 0.5});
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
  }, [
    blur,
    brightness,
    chromaticAberration,
    className,
    contrast,
    debug,
    distortionSmoothness,
    getDisplacementFilter,
    getDisplacementMap,
    glowIntensity,
    glowSpread,
    isMobile,
    opacity,
    saturation,
    strength,
  ]);

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
  }, [updateGlassEffect]);

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