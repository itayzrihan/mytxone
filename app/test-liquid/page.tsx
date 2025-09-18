// src/components/LiquidGlassPage.tsx

'use client'; // This component is interactive and uses browser-specific APIs.

import React from 'react';

/**
 * A self-contained Next.js component demonstrating a refined liquid glass bubble effect.
 *
 * This version enhances the previous one by making the center of the glass elements
 * very clear, similar to a real bubble, while concentrating the liquid distortion,
 * chromatic aberration, and vibrancy primarily on the borders.
 *
 * Key Features:
 * - Next.js, TypeScript, and Tailwind CSS.
 * - Refined liquid distortion using SVG filters (feTurbulence, feDisplacementMap).
 * - **New:** Masking techniques within the SVG filter to apply distortion only to the border.
 * - Enhanced specular lighting for realistic bubble reflections.
 * - Graceful fallback to a standard frosted glass effect for Safari/Firefox.
 * - Fully responsive and contained within a single file.
 */
const LiquidGlassPage = () => {
  return (
    <div className="relative min-h-screen font-sans bg-gray-900 text-gray-200 overflow-x-hidden">
      {/* ======================================================================
        SVG Filter Definitions
        This SVG block is hidden but defines the powerful filter we apply via CSS.
        The filter creates the liquid distortion, color shifting, and lighting.
        Filter ID: #liquid-glass-bubble
        ======================================================================
      */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-glass-bubble" colorInterpolationFilters="sRGB">
            {/* SourceGraphic is the element the filter is applied to (our glass shape) */}
            {/* SourceAlpha is the alpha channel of the SourceGraphic */}
            
            {/* 1. Create the displacement map (noise) */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.05" // Slightly higher frequency for more detail
              numOctaves="2"
              result="turbulence"
            />
            
            {/* 2. Create a thick border mask. We'll use this to apply distortion only to the edges. */}
            {/* First, expand the shape slightly */}
            <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="dilatedAlpha" /> 
            {/* Then subtract the original shape from the dilated one to get a border */}
            <feComposite in="dilatedAlpha" in2="SourceAlpha" operator="xor" result="borderMask" />
            {/* Blur the border mask slightly to make the transition smoother */}
            <feGaussianBlur in="borderMask" stdDeviation="2" result="softBorderMask" />

            {/* 3. Apply displacement and chromatic aberration only to the border area. */}
            {/* We use SourceGraphic and the turbulence, then mask it with our softBorderMask */}
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="65" xChannelSelector="R" yChannelSelector="A" result="dispRedTemp"/>
            <feComposite in="dispRedTemp" in2="softBorderMask" operator="arithmetic" k2="1" k3="0" k4="0" result="dispRedBorder"/>
            <feColorMatrix in="dispRedBorder" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
            
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="60" xChannelSelector="R" yChannelSelector="G" result="dispGreenTemp"/>
            <feComposite in="dispGreenTemp" in2="softBorderMask" operator="arithmetic" k2="1" k3="0" k4="0" result="dispGreenBorder"/>
            <feColorMatrix in="dispGreenBorder" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>

            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="55" xChannelSelector="R" yChannelSelector="B" result="dispBlueTemp"/>
            <feComposite in="dispBlueTemp" in2="softBorderMask" operator="arithmetic" k2="1" k3="0" k4="0" result="dispBlueBorder"/>
            <feColorMatrix in="dispBlueBorder" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>

            {/* 4. Blend the displaced color channels back together for the chromatic border. */}
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="chromaticBorder" />

            {/* 5. Create the clear center by blurring the original SourceGraphic slightly
                  and making it more transparent. */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" result="blurredCenter" />
            <feColorMatrix in="blurredCenter" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" result="clearCenter"/> {/* Reduced alpha */}

            {/* 6. Combine the chromatic border with the clear center. */}
            <feComposite in="chromaticBorder" in2="clearCenter" operator="over" result="combinedColors" />
            
            {/* 7. Add specular lighting for a wet/bubble look. */}
            <feSpecularLighting in="turbulence" surfaceScale="15" specularConstant="1" specularExponent="80" lightingColor="#FFFFFF" result="specular"> {/* Increased surfaceScale/specularExponent for more intense highlights */}
              <feDistantLight azimuth="135" elevation="40" /> {/* Adjusted elevation for a slightly different highlight position */}
            </feSpecularLighting>

            {/* Use the softBorderMask to apply lighting primarily to the edges of the shape. */}
            <feComposite in="specular" in2="softBorderMask" operator="arithmetic" k2="1" k3="0" k4="0" result="borderSpecular" />

            {/* 8. Composite the lighting on top of the combined image. */}
            <feComposite in="combinedColors" in2="borderSpecular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
      </svg>
      
      {/* ======================================================================
        Global Styles & Compatibility Logic
        This style block applies the `.liquid-glass` class and handles the
        critical fallback for non-supporting browsers like Safari.
        ======================================================================
      */}
      <style jsx global>{`
        .liquid-glass-bubble {
          /* === FALLBACK FOR SAFARI & FIREFOX === */
          /* A standard frosted glass effect that looks great on its own.
             Slightly less blur and more transparency for a clearer center. */
          -webkit-backdrop-filter: blur(8px) saturate(150%) brightness(1.1);
          backdrop-filter: blur(8px) saturate(150%) brightness(1.1);
          background-color: rgba(255, 255, 255, 0.08); /* More transparent background */
          border: 1px solid rgba(255, 255, 255, 0.15); /* Clearer border */
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* === ENHANCEMENT FOR CHROME & EDGE === */
        /* This @supports rule checks if the browser can handle url() in backdrop-filter. */
        @supports (backdrop-filter: url('#')) or (-webkit-backdrop-filter: url('#')) {
          .liquid-glass-bubble {
            /* We replace the simple fallback with our complex SVG filter. */
            -webkit-backdrop-filter: url(#liquid-glass-bubble);
            backdrop-filter: url(#liquid-glass-bubble);
            
            /* The SVG filter handles the look, so we can remove the fallback styles. */
            background-color: transparent;
            border: none;
            
            /* The gradient border is now handled primarily by the SVG filter's lighting and displacement. */
            /* We can keep a subtle outer shadow for depth if desired. */
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
      
      {/* ======================================================================
        Fixed Glass Elements
        This container is fixed to the viewport and holds our three glass shapes.
        ======================================================================
      */}
      <div className="fixed inset-0 z-10 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 pointer-events-none">
        <div className="liquid-glass-bubble w-56 h-32 rounded-3xl pointer-events-auto" />
        <div className="liquid-glass-bubble w-40 h-40 rounded-full pointer-events-auto" />
        <div className="liquid-glass-bubble w-24 h-64 rounded-full pointer-events-auto" />
      </div>
      
      {/* ======================================================================
        Background Content
        This is the scrollable content that will be distorted by the glass.
        ======================================================================
      */}
      <main className="max-w-4xl mx-auto px-6 py-24 min-h-[200vh]">
        <div className="space-y-12">
          <header>
            <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-purple-400 mb-4">
              Liquid Glass Bubble Effect
            </h1>
            <p className="text-xl text-gray-400">
              Scroll down to see text and elements morph behind the fixed shapes,
              with a clear center like a real bubble and liquid effects concentrated on the borders.
            </p>
          </header>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-bold border-b border-gray-700 pb-2">How It Works (Enhanced) 🤔</h2>
            <p>This enhanced version uses a sophisticated SVG filter, <code className="bg-gray-800 px-1 rounded-md text-sm">#liquid-glass-bubble</code>, to achieve a more realistic bubble effect.</p>
            <ul className="list-disc list-inside text-gray-400">
                <li>We create an **isolated border mask** within the SVG filter using <code className="bg-gray-800 px-1 rounded-md text-sm">feMorphology</code> and <code className="bg-gray-800 px-1 rounded-md text-sm">feComposite</code>.</li>
                <li>The **liquid distortion** and **chromatic aberration** are then applied *only* to this border mask.</li>
                <li>The **center of the shape** is treated separately: a very subtle blur and increased transparency create the clear, bubble-like appearance.</li>
                <li>**Specular lighting** is intensified and also concentrated on the borders to mimic the reflections of a real bubble.</li>
                <li>For Safari, the <code className="bg-gray-800 px-1 rounded-md text-sm">@supports</code> rule provides a slightly refined frosted glass fallback.</li>
            </ul>
          </section>

          <section className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Primary Button</button>
            <button className="px-6 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Secondary Action</button>
          </section>

          <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:text-gray-100">
            <h3>Lorem Ipsum Dolor Sit Amet</h3>
            <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-5xl font-bold">
                {i}
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:text-gray-100">
            <h3>Neque Porro Quisquam Est</h3>
            <p>Qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse cillum dolore eu fugiat quo voluptas nulla pariatur?</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiquidGlassPage;