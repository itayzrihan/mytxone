# Image Crop & Resize Modal - Implementation Guide

## Overview
A custom-built image cropping and resizing modal has been integrated into the profile system. It allows users to crop, zoom, and rotate images before uploading profile pictures.

## Features

### Core Functionality
- ✅ **Drag to Pan**: Click and drag to reposition the image
- ✅ **Zoom Control**: 
  - Scroll wheel to zoom in/out
  - Buttons to adjust zoom incrementally
  - Range slider for precise control
  - Zoom range: 50% - 300%
- ✅ **Rotate**: 90° rotation button
- ✅ **Circular Preview**: Shows how the circular profile picture will look
- ✅ **Reset**: Restore original state
- ✅ **Real-time Preview**: See changes instantly on canvas

### UI Components
- Modal overlay with semi-transparent backdrop
- Canvas preview (400x400px preview area)
- Control panel with zoom and rotation controls
- Range slider for smooth zoom adjustment
- Reset, Cancel, and Apply Crop buttons
- Visual guides and instructions

## File Structure

```
components/custom/
├── image-crop-modal.tsx       # Cropping modal component
└── user-menu.tsx              # Updated with profile link

app/user/[username]/
└── page.tsx                   # Profile page with modal integration
```

## How It Works

### 1. User Selects Image
- Click on profile picture upload button
- Select an image file (max 5MB)
- Modal automatically opens with preview

### 2. Crop & Adjust
- **Drag**: Click and drag the image to reposition
- **Zoom**: Scroll wheel or use ±/+ buttons (50-300%)
- **Rotate**: Click "Rotate 90°" button to rotate
- **Reset**: Click "Reset" to start over

### 3. Apply Changes
- Click "Apply Crop" to confirm
- Image is converted to PNG (300x300px circular)
- Circular crop is applied automatically
- Preview updates immediately

### 4. Save to Profile
- Cropped image is converted to File format
- Ready to be uploaded with profile update
- Shows in profile picture preview

## Technical Implementation

### Image Processing
```typescript
// Canvas-based image processing
- Draw to canvas with transformations
- Apply rotation using ctx.rotate()
- Apply zoom using ctx.scale()
- Apply pan using ctx.translate()
- Create circular clipping region for final output
```

### State Management
```typescript
- zoom: 0.5 - 3.0 (50% - 300%)
- rotation: 0, 90, 180, 270 degrees
- offset: { x, y } for pan position
- isDragging: boolean for mouse tracking
- imageLoaded: boolean for image readiness
```

### Output
- **Format**: PNG (lossless quality)
- **Size**: 300x300 pixels
- **Shape**: Circular with transparent background
- **Encoding**: Base64 data URI

## User Experience Flow

```
1. User clicks profile image upload button
   ↓
2. File picker opens
   ↓
3. User selects image
   ↓
4. Crop modal appears with preview
   ↓
5. User adjusts image (drag/zoom/rotate)
   ↓
6. User clicks "Apply Crop"
   ↓
7. Modal closes, preview shows cropped circular image
   ↓
8. User clicks "Save Changes" on profile form
   ↓
9. Cropped image uploaded to database
```

## Styling

### Color Scheme
- **Borders**: Cyan gradient with opacity
- **Background**: Dark gray (gray-900)
- **Text**: Cyan for labels, white for values
- **Buttons**: Gradient backgrounds with hover states
- **Canvas**: Gray-800 background

### Responsive Design
- Works on desktop and tablet
- Touch-friendly on mobile
- Modal centers on screen
- Controls stack responsively

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

Requires:
- Canvas API support
- FileReader API
- Blob API

## Performance Considerations
- Canvas redraws only when state changes
- Debounced mouse move for smooth dragging
- Efficient memory usage (no external libraries)
- Fast image processing (local, no API calls)

## Limitations & Considerations

### Current Limitations
- Image must be less than 5MB
- Output is always 300x300px PNG
- Circular crop is always applied
- No filter adjustments (brightness, saturation, etc.)

### Future Enhancements
- Multiple crop shape options (square, rectangle, custom)
- Filter adjustments (brightness, contrast, saturation)
- Undo/redo history
- Keyboard shortcuts
- Touch gestures for mobile (pinch zoom)
- Preview at different DPI settings

## Code Example: Using the Component

```typescript
import { ImageCropModal } from "@/components/custom/image-crop-modal";

// In your component:
const [isCropModalOpen, setIsCropModalOpen] = useState(false);
const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImageUrl(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  }
};

const handleCropComplete = (croppedImage: string) => {
  // Use croppedImage (base64 PNG data)
  setImagePreview(croppedImage);
};

// In JSX:
<ImageCropModal
  isOpen={isCropModalOpen}
  imageUrl={tempImageUrl || ""}
  onClose={() => setIsCropModalOpen(false)}
  onCropComplete={handleCropComplete}
/>
```

## Troubleshooting

### Modal doesn't appear
- Check if `isCropModalOpen` state is true
- Verify `tempImageUrl` has a valid data URI

### Image preview is blank
- Ensure image is loaded (check `imageLoaded` state)
- Verify canvas has proper dimensions
- Check browser console for errors

### Dragging doesn't work
- Mouse events must be attached to canvas
- Verify `onMouseDown`, `onMouseMove`, `onMouseUp` handlers

### Cropped image is blurry
- Ensure output canvas is 300x300px
- Check zoom level (may be too zoomed out)
- Verify image quality isn't degraded

## Dependencies
- **None** - Built with native Canvas API
- Uses React hooks for state management
- Integrates with existing UI components (Button, etc.)

## Security
- All image processing happens client-side
- No image data sent to backend until user confirms
- Images validated for size before processing
- Circular crop applied for privacy/consistency
