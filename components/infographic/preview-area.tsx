'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CountdownSettings, CustomSettings, InfographicMode } from './hooks/use-infographic-state';

interface PreviewAreaProps {
  mode: InfographicMode;
  countdownSettings: CountdownSettings;
  customSettings: CustomSettings;
}

export function PreviewArea({ mode, countdownSettings, customSettings }: PreviewAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customPreviewRef = useRef<HTMLDivElement>(null);
  const [previewText, setPreviewText] = useState(countdownSettings.countdown.toString());

  // Canvas drawing functions
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (countdownSettings.backgroundType === 'transparent') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (countdownSettings.backgroundType === 'gradient') {
      // Create gradient based on settings
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      countdownSettings.gradientColors.forEach(colorStop => {
        gradient.addColorStop(colorStop.position, colorStop.color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Solid color background
      ctx.fillStyle = countdownSettings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [countdownSettings]);

  const drawText = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string) => {
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate responsive font size
    const baseFontSize = Math.min(canvas.width, canvas.height) / 6;
    ctx.font = `bold ${baseFontSize}px ${countdownSettings.font}`;
    
    // Apply text opacity and blend mode
    const textOpacityValue = countdownSettings.textOpacity / 100;
    ctx.globalAlpha = textOpacityValue;
    ctx.globalCompositeOperation = countdownSettings.textBlendMode as GlobalCompositeOperation;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apply shadow
    ctx.shadowColor = countdownSettings.shadowColor;
    ctx.shadowOffsetX = countdownSettings.shadowOffsetX * (canvas.width / 1920);
    ctx.shadowOffsetY = countdownSettings.shadowOffsetY * (canvas.height / 1080);
    ctx.shadowBlur = countdownSettings.shadowBlur * (Math.min(canvas.width, canvas.height) / 1920);

    // Set text color or gradient
    if (countdownSettings.textStyle === 'gradient') {
      const textMetrics = ctx.measureText(text);
      const textHeight = baseFontSize;
      const textWidth = textMetrics.width;
      
      let textGradient;
      if (countdownSettings.textGradientDirection === 'horizontal') {
        textGradient = ctx.createLinearGradient(
          centerX - textWidth/2, centerY, 
          centerX + textWidth/2, centerY
        );
      } else if (countdownSettings.textGradientDirection === 'vertical') {
        textGradient = ctx.createLinearGradient(
          centerX, centerY - textHeight/2, 
          centerX, centerY + textHeight/2
        );
      } else { // diagonal
        textGradient = ctx.createLinearGradient(
          centerX - textWidth/2, centerY - textHeight/2,
          centerX + textWidth/2, centerY + textHeight/2
        );
      }
      
      textGradient.addColorStop(0, countdownSettings.textGradientStart);
      textGradient.addColorStop(1, countdownSettings.textGradientEnd);
      ctx.fillStyle = textGradient;
    } else {
      ctx.fillStyle = countdownSettings.fontColor;
    }

    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  }, [countdownSettings]);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBackground(ctx, canvas);
    drawText(ctx, canvas, previewText);
  }, [drawBackground, drawText, previewText]);

  const parseUnifiedCode = useCallback((code: string) => {
    // For complete HTML documents, just return the code as-is
    if (code.includes('<!DOCTYPE html>') || code.includes('<html>')) {
      return code;
    }
    
    // For backwards compatibility, try to parse the old format
    let html = '';
    let css = '';
    
    const htmlMatch = code.match(/<!--[\s\S]*?-->([\s\S]*?)(?=\/\*|<style>|\/\/|$)/);
    if (htmlMatch) {
      html = htmlMatch[1].trim();
    }
    
    const cssMatch = code.match(/<style>([\s\S]*?)<\/style>/);
    if (cssMatch) {
      css = cssMatch[1].trim();
    }
    
    // Create a simple HTML document structure
    return `<!DOCTYPE html>
<html>
<head>
<style>
${css}
</style>
</head>
<body>
${html}
</body>
</html>`;
  }, []);

  const previewCustomAnimation = useCallback(() => {
    const customPreview = customPreviewRef.current;
    if (!customPreview) return;
    
    const htmlCode = parseUnifiedCode(customSettings.unifiedCode);
    
    // Clear previous content
    customPreview.innerHTML = '';
    
    // Create an iframe to safely render the HTML
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      width: 100%; 
      height: 100%; 
      border: none; 
      background: white;
      display: block;
    `;
    
    // Inject CSS to make the iframe content fill the viewport
    const modifiedHtmlCode = htmlCode.replace(
      '<head>',
      `<head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        body > * {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          box-sizing: border-box !important;
        }
      </style>`
    );
    
    iframe.srcdoc = modifiedHtmlCode;
    
    // Add iframe directly to preview without scaling container
    customPreview.appendChild(iframe);
  }, [customSettings, parseUnifiedCode]);

  // Update canvas size based on video orientation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (countdownSettings.videoSize === 'horizontal') {
      canvas.width = 1920;
      canvas.height = 1080;
    } else {
      canvas.width = 1080;
      canvas.height = 1920;
    }
    
    drawPreview();
  }, [countdownSettings.videoSize, drawPreview]);

  // Redraw when settings change
  useEffect(() => {
    if (mode === 'countdown') {
      drawPreview();
    }
  }, [countdownSettings, mode, drawPreview]);

  // Update custom preview when settings change
  useEffect(() => {
    if (mode === 'custom') {
      previewCustomAnimation();
    }
  }, [customSettings.orientation, customSettings.unifiedCode, mode, previewCustomAnimation]);

  return (
    <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center">
      <h2 className="text-gray-700 text-2xl mb-6 font-semibold">👀 Live Preview</h2>
      
      {/* Countdown Canvas Preview */}
      {mode === 'countdown' && (
        <canvas
          ref={canvasRef}
          className={`border-4 border-white/30 rounded-2xl bg-gray-100 shadow-xl ${
            countdownSettings.videoSize === 'horizontal'
              ? 'w-full max-w-4xl aspect-video' // 16:9 aspect ratio for horizontal
              : 'w-full max-w-sm aspect-[9/16] mx-auto' // 9:16 aspect ratio for vertical, centered
          }`}
          style={{
            background: `
              repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px,
              #f8fafc
            `
          }}
        />
      )}

      {/* Custom Animation Preview */}
      {mode === 'custom' && (
        <div
          ref={customPreviewRef}
          className={`border-4 border-white/30 rounded-2xl bg-gray-100 relative overflow-hidden shadow-xl ${
            customSettings.orientation === 'horizontal' 
              ? 'w-full max-w-4xl aspect-video' // 16:9 aspect ratio for horizontal
              : 'w-full max-w-sm aspect-[9/16] mx-auto' // 9:16 aspect ratio for vertical, centered
          }`}
          style={{
            background: `
              repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px,
              #ffffff
            `
          }}
        />
      )}

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl text-sm text-gray-600 max-w-2xl">
        {mode === 'countdown' ? (
          <div>
            <strong className="text-blue-800 block mb-2">💡 Pro Tips:</strong>
            <ul className="space-y-1 list-disc list-inside">
              <li>The preview shows how your video will look with {countdownSettings.videoSize === 'horizontal' ? '16:9 (horizontal)' : '9:16 (vertical)'} aspect ratio</li>
              <li>🚀 Instant mode generates faster for quick previews</li>
              <li>🌈 Try gradient backgrounds and text for modern looks</li>
              <li>🔍 Transparent backgrounds are perfect for overlaying</li>
              <li>Horizontal format works best for YouTube/TV</li>
              <li>Vertical format is perfect for TikTok/Instagram Stories</li>
            </ul>
          </div>
        ) : (
          <div>
            <strong className="text-blue-800 block mb-2">🎨 Custom Animation Tips:</strong>
            <ul className="space-y-1 list-disc list-inside">
              <li>Preview shows {customSettings.orientation === 'horizontal' ? '16:9 (horizontal)' : '9:16 (vertical)'} aspect ratio like a real screen</li>
              <li>Use complete HTML documents with embedded CSS and JavaScript</li>
              <li>CSS animations and transitions create smooth effects</li>
              <li>JavaScript can handle complex interactions and timing</li>
              <li>Keep structure simple for better performance</li>
              <li>Test your animation with Preview before generating</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
