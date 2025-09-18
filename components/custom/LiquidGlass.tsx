'use client'

import React, { useEffect, useState, useRef } from 'react'

interface LiquidGlassProps {
  className?: string
  width?: number
  height?: number
  radius?: number
  icons?: string[]
  scale?: number
  border?: number
  lightness?: number
  alpha?: number
  blur?: number
  frost?: number
  saturation?: number
  showIcons?: boolean
  displace?: number
  blend?: string
  r?: number
  g?: number
  b?: number
}

export function LiquidGlass({ 
  className = '', 
  width = 336, 
  height = 96, 
  radius = 16,
  scale = -180,
  border = 0.07,
  lightness = 50,
  alpha = 0.93,
  blur = 11,
  frost = 0.05,
  saturation = 1.5,
  showIcons = true,
  displace = 0.7,
  blend = 'difference',
  r = 0,
  g = 10,
  b = 20,
  icons = [
    'https://assets.codepen.io/605876/finder.png',
    'https://assets.codepen.io/605876/launch-control.png', 
    'https://assets.codepen.io/605876/safari.png',
    'https://assets.codepen.io/605876/calendar.png'
  ]
}: LiquidGlassProps) {
  const [displacementImage, setDisplacementImage] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const effectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect iOS
    const detectIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    }
    setIsIOS(detectIOS())
  }, [])

  useEffect(() => {
    // Generate the displacement SVG exactly like the original
    const borderWidth = Math.min(width, height) * (border * 0.5)
    
    const svgContent = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <!-- backdrop -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="black"></rect>
        <!-- red linear -->
        <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="url(#red)" />
        <!-- blue linear -->
        <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="url(#blue)" style="mix-blend-mode: ${blend}" />
        <!-- block out distortion -->
        <rect x="${borderWidth}" y="${borderWidth}" width="${width - borderWidth * 2}" height="${height - borderWidth * 2}" rx="${radius}" fill="hsl(0 0% ${lightness}% / ${alpha})" style="filter:blur(${blur}px)" />
      </svg>
    `
    
    const encoded = encodeURIComponent(svgContent)
    const dataUri = `data:image/svg+xml,${encoded}`
    setDisplacementImage(dataUri)
  }, [width, height, radius, border, lightness, alpha, blur, blend])

  useEffect(() => {
    // Show with delay to simulate original behavior
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`liquid-glass-container ${className}`}>
      {/* SVG Filter Definition - Only render if not iOS for performance */}
      {!isIOS && (
        <svg className="filter" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="filter" colorInterpolationFilters="sRGB">
              {/* The input displacement image */}
              <feImage
                x="0"
                y="0"
                width="100%"
                height="100%"
                result="map"
                href={displacementImage}
              />
              
              {/* RED channel with strongest displacement */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="redchannel"
                xChannelSelector="R"
                yChannelSelector="G"
                scale={scale + r}
                result="dispRed"
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="red"
              />
              
              {/* GREEN channel (reference / least displaced) */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="greenchannel"
                xChannelSelector="R"
                yChannelSelector="G"
                scale={scale + g}
                result="dispGreen"
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="green"
              />
              
              {/* BLUE channel with medium displacement */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="bluechannel"
                xChannelSelector="R"
                yChannelSelector="G"
                scale={scale + b}
                result="dispBlue"
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="blue"
              />
              
              {/* Blend channels back together */}
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              
              {/* Output blur */}
              <feGaussianBlur in="output" stdDeviation={displace} />
            </filter>
          </defs>
        </svg>
      )}

      {/* Glass Effect Container */}
      <div 
        ref={effectRef}
        className={`effect ${isIOS ? 'ios-glass' : ''}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${radius}px`,
          '--frost': frost,
          '--saturation': saturation,
          '--width': width,
          '--height': height,
          '--radius': radius,
          opacity: isVisible ? 1 : 0
        } as React.CSSProperties & { 
          '--frost': number; 
          '--saturation': number;
          '--width': number;
          '--height': number; 
          '--radius': number;
        }}
      >
        <div className="nav-wrap">
          <nav 
            className="glass-nav"
            style={{
              opacity: showIcons ? 1 : 0
            }}
          >
            {icons.map((icon, index) => (
              <img 
                key={index}
                src={icon} 
                alt={`Icon ${index + 1}`}
                className="glass-icon"
                loading="eager"
                decoding="async"
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}