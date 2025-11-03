import React from "react";
import { Stack, Typography, Box, Divider } from "@mui/material";
import Car360Viewer from "../libs/components/car/Car360Viewer";
import withLayoutBasic from "../libs/components/layout/LayoutBasic";

const Car360Demo = () => {
  // Sample car data with 360° images
  const sampleCar360Images = [
    "sample-360-interior-1.jpg",
    "sample-360-interior-2.jpg",
    "sample-360-interior-3.jpg",
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            360° Car Viewer Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive demonstration of the 360° car interior viewing system
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" gutterBottom>
            1. Button Variant
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Standard button to open 360° viewer modal
          </Typography>
          <Car360Viewer
            car360Images={sampleCar360Images}
            buttonText="Experience Interior 360°"
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" gutterBottom>
            2. Thumbnail Variant
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Clickable thumbnail with 360° indicator overlay
          </Typography>
          <Car360Viewer car360Images={sampleCar360Images} variant="thumbnail" />
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" gutterBottom>
            3. Multiple Variants Together
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            How they appear together in car listings and detail pages
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Car360Viewer
              car360Images={sampleCar360Images}
              buttonText="View 360° Interior"
            />
            <Car360Viewer
              car360Images={sampleCar360Images}
              variant="thumbnail"
            />
            <Typography variant="body2" color="text.secondary">
              {sampleCar360Images.length} 360° image
              {sampleCar360Images.length > 1 ? "s" : ""} available
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" gutterBottom>
            Integration Status
          </Typography>
          <Typography variant="body1" gutterBottom>
            The Car360Viewer has been integrated into:
          </Typography>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              <strong>Car Detail Page:</strong> 360° Interior View section with
              button and thumbnail variants
            </li>
            <li>
              <strong>Car Detail Page:</strong> Image gallery with 360°
              thumbnails alongside regular images
            </li>
            <li>
              <strong>Car Listings (CarCard):</strong> 360° badge indicator
              showing count of available images
            </li>
            <li>
              <strong>Car Listings (CarBigCard):</strong> 360° indicator for
              featured listings
            </li>
            <li>
              <strong>AddNewCar Page:</strong> Preview functionality for
              uploaded 360° images
            </li>
          </ul>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            📱 Usage Instructions:
          </Typography>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>
              <strong>Mouse/Desktop:</strong> Drag to look around • Scroll to
              zoom
            </li>
            <li>
              <strong>Touch/Mobile:</strong> Drag to look around • Pinch to zoom
            </li>
            <li>
              <strong>Navigation:</strong> Use arrow buttons for multiple 360°
              images
            </li>
            <li>
              <strong>Supported Formats:</strong> JPEG, JPG, PNG, AVIF
            </li>
          </ul>
        </Box>

        <Box
          sx={{
            backgroundColor: "#e8f5e8",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            ✅ Ready to Use:
          </Typography>
          <Typography variant="body1">
            The 360° viewing system is fully integrated and ready for production
            use. Users can now upload 360° images through the AddNewCar page and
            viewers will automatically see 360° indicators and interactive
            viewing options throughout the platform.
          </Typography>
        </Box>
      </Stack>
    </div>
  );
};

export default withLayoutBasic(Car360Demo);
