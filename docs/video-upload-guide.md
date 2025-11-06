# Video Upload Implementation for Car Listings

## Overview

This document describes the implementation of video upload functionality for car listings in the UCAR Next application.

## Features Implemented

### 1. **Video Upload UI Component**

- Added a new video upload section in the `AddNewCar.tsx` component
- Supports drag-and-drop functionality for video files
- Allows users to upload up to 5 videos per car listing
- Accepts video formats: MP4, WebM, MOV (QuickTime), OGG, MKV, and 3GPP
- Maximum file size: 200MB per video (backend configurable up to 500MB)

### 2. **GraphQL Integration**

- Uses the existing `imagesUploader` mutation with target `"car-video"`
- Uploads videos through Apollo Client with multipart form data
- Stores video paths in the `carVideos` field

### 3. **Data Flow**

- Videos are uploaded to the backend via the GraphQL API
- Backend returns video file paths
- Paths are stored in `insertCarData.carVideos` state
- Included in both `CREATE_CAR` and `UPDATE_CAR` mutations

### 4. **UI Features**

- Visual feedback during drag-over state
- Upload progress indicator ("Uploading videos...")
- Video preview with HTML5 video player (controls enabled)
- "VIDEO" badge overlay on thumbnails
- Remove button (×) for each uploaded video
- Empty state message when no videos uploaded

### 5. **Validation & Error Handling**

- File type validation (MP4, WebM, MOV, OGG, MKV, 3GPP allowed)
- File count validation (max 5 videos)
- File size validation (max 200MB per video, backend supports up to 500MB)
- User-friendly error messages in all 3 languages (EN, KR, RU)

## Files Modified

### 1. `/libs/components/mypage/AddNewCar.tsx`

**Added:**

- `videoRef` useRef for video file input
- `isDragOverVideo` state for drag-over feedback
- `isUploadingVideo` state for upload progress
- `uploadVideos()` function to handle video upload
- `removeCarVideo()` function to remove videos
- Video upload UI section (after 360° images section)
- Updated `insertCarData` initialization to include `carVideos: []`
- Updated `CREATE_CAR` and `UPDATE_CAR` mutations to include `carVideos`

### 2. `/public/locales/en/common.json`

**Added translations:**

```json
"mypage.uploadVideo.title": "Upload videos of your car (Optional)",
"mypage.uploadVideo.noFilesDropped": "No video files were dropped!",
"mypage.uploadVideo.invalidTypes": "{{count}} file(s) rejected. Only MP4, WebM, or MOV files are allowed!",
"mypage.uploadVideo.limit": "Cannot upload more than 3 videos at once!",
"mypage.uploadVideo.maxSize": "{{count}} video file(s) are too large. Maximum file size is 50MB.",
"mypage.uploadVideo.dropError": "Error processing dropped video files: {{message}}",
"mypage.uploadVideo.formatTitle": "Videos must be MP4, WebM, or MOV format (max 50MB each)",
"mypage.uploadVideo.browse": "Browse Video Files",
"mypage.uploadVideo.empty": "No videos uploaded yet",
"mypage.uploadVideo.noServerVideos": "Video upload failed - server returned no videos.",
"mypage.uploadVideo.dragTitleOver": "Drop video files here!",
"mypage.uploadVideo.dragTitleDefault": "Drag and drop videos here",
"mypage.uploadVideo.uploading": "Uploading videos..."
```

### 3. `/public/locales/kr/common.json`

**Added Korean translations** for all video upload keys

### 4. `/public/locales/ru/common.json`

**Added Russian translations** for all video upload keys

## Backend Requirements

### Backend Configuration ✅ COMPLETED

The backend is now configured with upload limits in `main.ts`:

**Default Limits:**

- Maximum file size: 200MB per file
- Maximum files: 10 files per request

**Environment Variables (Optional):**

```bash
# Increase file size limit to 500MB
export UPLOAD_MAX_FILE_SIZE_MB=500

# Limit to 5 files per upload
export UPLOAD_MAX_FILES=5
```

**Supported Video MIME Types:**

- `video/mp4` (.mp4)
- `video/webm` (.webm)
- `video/quicktime` (.mov)
- `video/ogg` (.ogg)
- `video/x-matroska` (.mkv)
- `video/3gpp` (.3gp)

The backend automatically:
✅ Creates upload directories if they don't exist (`mkdirSync`)
✅ Handles both images and videos through `imagesUploader`
✅ Validates file types against `allowedUploadMimeTypes`

### GraphQL Mutation

The backend supports the `imagesUploader` mutation with the `"car-video"` target:

```graphql
mutation VideosUploader($files: [Upload!]!, $target: String!) {
  imagesUploader(files: $files, target: $target)
}
```

### Expected Behavior

1. Accept video files (MP4, WebM, MOV)
2. Store videos in an appropriate directory (e.g., `uploads/cars/videos/`)
3. Return array of video file paths (e.g., `["uploads/cars/videos/123-video1.mp4"]`)
4. Handle the `"car-video"` target separately from image targets

### Schema Updates

The `Car` type should already include `carVideos` field:

```graphql
type Car {
  # ... other fields
  carVideos: [String]
}
```

The `CarInput` and `CarUpdate` types should include:

```graphql
input CarInput {
  # ... other fields
  carVideos: [String]
}

input CarUpdate {
  # ... other fields
  carVideos: [String]
}
```

## Usage Instructions

### For Users:

1. Navigate to "Add Car" or edit an existing car
2. Scroll to the "Upload videos of your car (Optional)" section
3. Either:
   - Click "Browse Video Files" and select up to 3 videos
   - Drag and drop video files into the upload area
4. Wait for upload to complete
5. Preview videos using the built-in player
6. Remove unwanted videos using the × button
7. Submit the form to create/update the car listing

### For Developers:

1. Ensure backend supports video uploads with `"car-video"` target
2. Configure storage directory for video files
3. Set appropriate file size limits (currently 50MB client-side)
4. Consider implementing video transcoding/optimization if needed
5. Test video playback across different browsers

## Technical Details

### Video Upload Function

```typescript
async function uploadVideos() {
  // 1. Validate files (count, type, size)
  // 2. Create FormData with GraphQL operation
  // 3. Map files to variables
  // 4. POST to GraphQL endpoint with multipart/form-data
  // 5. Update state with returned video paths
  // 6. Handle errors with user-friendly messages
}
```

### Data Structure

```typescript
interface CarInput {
  // ... other fields
  carVideos?: string[];
}
```

Videos are stored as an array of file paths that can be loaded using:

```typescript
`${REACT_APP_API_URL}/${videoPath}`;
```

## Future Enhancements

1. **Video Thumbnails**: Generate and display video thumbnails instead of full video players in gallery
2. **Video Compression**: Implement client-side or server-side video compression
3. **Streaming**: Support video streaming for better performance
4. **Progress Bar**: Show detailed upload progress percentage
5. **Preview Modal**: Add full-screen video preview modal
6. **Auto-play**: Add auto-play option for car detail page
7. **Video Duration**: Display video duration on thumbnails
8. **Reordering**: Allow users to reorder videos

## Testing Checklist

- [ ] Upload single video file
- [ ] Upload multiple videos (up to 3)
- [ ] Test with different video formats (MP4, WebM, MOV)
- [ ] Test file size validation (>50MB should fail)
- [ ] Test file count validation (>3 should fail)
- [ ] Test drag-and-drop functionality
- [ ] Test video removal
- [ ] Test video playback in gallery
- [ ] Test form submission with videos
- [ ] Test edit mode (loading existing videos)
- [ ] Test all translations (EN, KR, RU)
- [ ] Test error scenarios (network issues, server errors)

## Notes

- Video upload is **optional** - users can create cars without videos
- Videos are uploaded immediately when selected (not on form submit)
- Videos are validated client-side before upload
- Backend must handle video storage and serving
- Consider implementing CDN for video delivery in production
