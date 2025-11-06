# Video Upload Implementation Summary

## Overview

Updated the application to properly support video files for cars by adding a dedicated `carVideos` field separate from `carImages`.

## Changes Made

### 1. Type Definitions Updated

#### `/libs/types/car/car.ts`

- Added `carVideos?: string[]` field to the `Car` interface

#### `/libs/types/car/car.input.ts`

- Added `carVideos?: string[]` field to the `CarInput` interface

#### `/libs/types/car/car.update.ts`

- Added `carVideos?: string[]` field to the `CarUpdate` interface

### 2. GraphQL Mutations Updated

#### `/apollo/admin/mutation.ts`

- Updated `UPDATE_CAR_BY_ADMIN` mutation to include `carVideos` field
- Updated `REMOVE_CAR_BY_ADMIN` mutation to include `carVideos` field

#### `/apollo/user/mutation.ts`

- Updated `CREATE_CAR` mutation to include `carVideos` field
- Updated `UPDATE_CAR` mutation to include `carVideos` field
- Updated `LIKE_TARGET_CAR` mutation to include `carVideos` field

### 3. GraphQL Queries Updated

#### `/apollo/user/query.ts`

- Updated `GET_CAR` query to include `carVideos` field
- Updated `GET_CARS` query to include `carVideos` field
- Updated `GET_AGENT_CARS` query to include `carVideos` field
- Updated `GET_FAVORITES` query to include `carVideos` field
- Updated `GET_VISITED` query to include `carVideos` field

### 4. Component Updates

#### `/libs/components/Top.tsx`

- Updated `getVideoSource()` function to use `carVideos[0]` instead of checking `carImages` for video files

#### `/pages/car/detail.tsx`

- Updated video detection logic to use `carVideos` field
- Modified main image display to prioritize videos from `carVideos`
- Updated sub-images section to display videos separately from images

#### `/libs/components/homepage/TrendCarCard.tsx`

- Updated to use `carVideos[0]` instead of searching through `carImages` for video files

#### `/libs/components/homepage/TopCarCard.tsx`

- Updated to use `carVideos[0]` instead of searching through `carImages` for video files

#### `/libs/components/homepage/TrendCars.tsx`

- Updated video filtering logic to check `carVideos` field instead of `carImages`

#### `/libs/components/homepage/TopCars.tsx`

- Updated video filtering logic to check `carVideos` field instead of `carImages`

## Next Steps for Complete Implementation

### Backend Requirements

To fully support video uploads, the backend needs to be updated:

1. **Database Schema**

   - Add `carVideos` field to the Car model/schema

2. **GraphQL Schema**

   - Update the Car type definition to include `carVideos: [String]`
   - Update CarInput to include `carVideos: [String]`
   - Update CarUpdate to include `carVideos: [String]`

3. **File Upload Handler**

   - Implement video file upload endpoint
   - Add video validation (file size, format, duration limits)
   - Consider using cloud storage for videos (AWS S3, Cloudinary, etc.)
   - Implement video compression/optimization if needed

4. **API Endpoints**
   - Create/update video upload mutation resolver
   - Handle multipart/form-data for video files
   - Implement streaming for large video files

### Frontend Admin UI (To be implemented)

Create video upload interface in admin car management:

1. **Add Video Upload Component**

   - File picker for video files
   - Upload progress indicator
   - Video preview after upload
   - Support for multiple videos

2. **Update Admin Car Forms**

   - Add video upload section to create car form
   - Add video upload section to edit car form
   - Display existing videos with option to remove

3. **File Handling**
   - Client-side video validation
   - File size limits (e.g., max 100MB per video)
   - Format validation (mp4, webm, mov)
   - Compress videos before upload if needed

## Benefits of This Approach

1. **Separation of Concerns**: Videos and images are now stored separately, making it easier to manage and display them differently
2. **Better Performance**: Can optimize video loading independently from images
3. **Cleaner Code**: No need to check file extensions in multiple places
4. **Scalability**: Easy to add video-specific features (thumbnails, transcoding, etc.)
5. **Type Safety**: TypeScript now properly types videos separately from images

## Testing Checklist

- [ ] Backend schema updated to include carVideos field
- [ ] Video upload endpoint implemented
- [ ] Admin UI for video upload created
- [ ] Video files can be uploaded via admin panel
- [ ] Videos display correctly on car detail page
- [ ] Videos display correctly on homepage (Top/Trend cars)
- [ ] Video rotation works properly in Top.tsx background
- [ ] Multiple videos per car are supported
- [ ] Video deletion works properly
- [ ] Error handling for video upload failures
- [ ] Video file size validation
- [ ] Video format validation
