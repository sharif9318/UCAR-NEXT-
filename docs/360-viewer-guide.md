# 360° Image Viewer Documentation

This project now includes a complete 360° image viewing system built with Three.js for immersive car interior photography.

## Components

### 1. Panorama360Viewer

The core viewer component that renders 360° images using Three.js.

**Props:**

- `images: string[]` - Array of image paths for 360° images
- `width?: number` - Viewer width (default: 800)
- `height?: number` - Viewer height (default: 600)
- `onClose?: () => void` - Optional close callback

**Features:**

- Mouse/touch drag to look around
- Scroll to zoom in/out
- Multiple image navigation
- Loading states and error handling
- Responsive design

### 2. Panorama360Modal

A modal wrapper for the 360° viewer that displays in fullscreen.

**Props:**

- `open: boolean` - Modal open state
- `onClose: () => void` - Close callback
- `images: string[]` - Array of 360° image paths

### 3. Car360Viewer

A reusable component for displaying 360° car images with different variants.

**Props:**

- `car360Images: string[]` - Array of 360° image paths
- `buttonText?: string` - Custom button text (default: "View 360°")
- `variant?: "button" | "thumbnail"` - Display variant

## Usage Examples

### In AddNewCar Component (already implemented)

```tsx
import Panorama360Modal from "../common/Panorama360Modal";

// State
const [show360Modal, setShow360Modal] = useState(false);

// Render
{
  insertCarData?.car360Images && insertCarData.car360Images.length > 0 && (
    <Button onClick={() => setShow360Modal(true)}>Preview 360° View</Button>
  );
}

<Panorama360Modal
  open={show360Modal}
  onClose={() => setShow360Modal(false)}
  images={insertCarData?.car360Images || []}
/>;
```

### In Car Detail Pages

```tsx
import Car360Viewer from "../components/car/Car360Viewer";

// Simple button
<Car360Viewer
  car360Images={carData.car360Images}
  buttonText="Experience Interior 360°"
/>

// Thumbnail variant
<Car360Viewer
  car360Images={carData.car360Images}
  variant="thumbnail"
/>
```

### Direct Usage

```tsx
import Panorama360Viewer from "../components/common/Panorama360Viewer";

<Panorama360Viewer
  images={["path/to/360/image1.jpg", "path/to/360/image2.jpg"]}
  width={1000}
  height={600}
  onClose={() => console.log("Viewer closed")}
/>;
```

## Image Requirements

### Format Support

- JPEG, JPG, PNG, AVIF formats supported
- Recommended: JPEG for best performance/quality balance

### Image Specifications

- **Resolution:** Minimum 2048x1024 pixels (2:1 aspect ratio)
- **Recommended:** 4096x2048 or 8192x4096 for high quality
- **Projection:** Equirectangular projection (360° panoramic)
- **File Size:** Optimize for web (typically 1-5MB per image)

### Creating 360° Images

1. Use a 360° camera (Ricoh Theta, Insta360, etc.)
2. Use smartphone apps with 360° photo mode
3. Convert from multiple photos using panorama stitching software
4. Ensure proper equirectangular projection

## Controls

### Mouse/Desktop

- **Drag:** Look around the 360° environment
- **Scroll:** Zoom in/out (FOV: 10° to 75°)
- **Arrow Keys:** Navigate between images (if multiple)

### Touch/Mobile

- **Drag:** Look around the 360° environment
- **Pinch:** Zoom in/out
- **Tap Controls:** Navigate between images

## Browser Support

### Required Features

- WebGL support (all modern browsers)
- ES6+ JavaScript support
- Canvas API support

### Tested Browsers

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## Performance Considerations

### Optimization Tips

1. **Image Compression:** Use appropriate JPEG quality (70-85%)
2. **Progressive Loading:** Large images load progressively
3. **Texture Memory:** Limit concurrent 360° viewers
4. **Mobile Performance:** Consider lower resolution images for mobile

### Memory Usage

- Each 360° image uses WebGL texture memory
- 4K images: ~64MB texture memory
- 8K images: ~256MB texture memory
- Monitor memory usage with multiple images

## Styling

### CSS Classes

- `.panorama-viewer` - Main viewer container
- `.panorama-viewer canvas` - Three.js canvas element
- `.panorama-viewer .controls` - Navigation controls
- `.panorama-viewer .loading-overlay` - Loading state overlay

### Customization

```scss
.panorama-viewer {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.panorama-viewer .control-button {
  background-color: your-brand-color;
}
```

## Integration with Backend

### Upload Endpoint

The existing image upload system supports 360° images:

```typescript
// Target: "car360" for 360° images vs "car" for regular images
formData.append(
  "variables",
  JSON.stringify({
    target: "car360",
  })
);
```

### Database Schema

Ensure your car schema includes:

```typescript
interface CarInput {
  // ... existing fields
  car360Images?: string[]; // Array of 360° image paths
}
```

## Troubleshooting

### Common Issues

1. **Images not loading**

   - Check image paths and CORS settings
   - Verify image format is supported
   - Check browser console for errors

2. **Performance issues**

   - Reduce image resolution
   - Limit number of concurrent viewers
   - Check WebGL capabilities

3. **Controls not working**
   - Ensure WebGL is enabled
   - Check for JavaScript errors
   - Verify event listeners are attached

### Debug Mode

Add debug logging by modifying the viewer component:

```typescript
console.log("Loading 360° image:", imagePath);
console.log("Camera position:", camera.position);
console.log("Texture loaded:", texture.image.width, "x", texture.image.height);
```

## Future Enhancements

### Planned Features

- VR mode support (WebXR)
- Hotspot annotations
- Transition animations between images
- Touch gesture improvements
- Gyroscope support for mobile

### Integration Possibilities

- Virtual car showroom tours
- Interior feature highlighting
- AR overlay integration
- Social sharing of 360° views
