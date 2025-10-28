"use client";

import { useState, useRef, useEffect } from "react";
import { X, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

export function ImageCropModal({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffset((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.1));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, prev - 0.1));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Draw the preview
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circle guide
    ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Save context state
    ctx.save();

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotate
    ctx.rotate((rotation * Math.PI) / 180);

    // Scale
    ctx.scale(zoom, zoom);

    // Apply offset
    ctx.translate(offset.x, offset.y);

    // Draw image centered
    const img = imageRef.current;
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

    // Restore context
    ctx.restore();
  }, [zoom, rotation, offset, imageLoaded]);

  const handleCropComplete = () => {
    if (!canvasRef.current) return;

    // Create a circular crop with high quality
    const outputCanvas = document.createElement("canvas");
    const size = 300; // Output size
    outputCanvas.width = size;
    outputCanvas.height = size;

    const octx = outputCanvas.getContext("2d");
    if (!octx) return;

    // Draw circular crop
    octx.fillStyle = "#1a1a1a";
    octx.fillRect(0, 0, size, size);

    // Create circular clipping region
    octx.beginPath();
    octx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    octx.clip();

    // Draw the cropped image
    const srcCanvas = canvasRef.current;
    octx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, size, size);

    // Get the cropped image data
    const croppedImage = outputCanvas.toDataURL("image/png");
    onCropComplete(croppedImage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Crop & Resize Image
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-4">
          {/* Canvas Preview */}
          <div className="flex justify-center">
            <div ref={containerRef} className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="border-2 border-cyan-500/30 rounded-lg cursor-move bg-gray-800"
              />
              {/* Hidden image for reference */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop source"
                onLoad={handleImageLoad}
                className="hidden"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-400">
            <p>🖱️ Drag to move • 🔄 Scroll to zoom • ↻ Rotate image</p>
            <p className="text-xs text-cyan-400 mt-1">Profile picture will be circular</p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Zoom Controls */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-cyan-400 block">
                Zoom
              </label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleZoomOut}
                  className="bg-gray-800 border-cyan-500/20 hover:border-cyan-500/40 h-8 w-8"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="flex-1 bg-gray-800 rounded px-3 py-1 text-center">
                  <span className="text-sm text-white">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleZoomIn}
                  className="bg-gray-800 border-cyan-500/20 hover:border-cyan-500/40 h-8 w-8"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rotation Controls */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-cyan-400 block">
                Rotation
              </label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRotate}
                  className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate 90°
                </Button>
                <div className="bg-gray-800 rounded px-3 py-2 text-sm text-white min-w-16">
                  {rotation}°
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-cyan-500/10">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 bg-gray-800 border-cyan-500/20 hover:border-cyan-500/40 text-gray-300"
            >
              Reset
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-800 border-red-500/20 hover:border-red-500/40 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
