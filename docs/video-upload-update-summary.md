# Video Upload Update Summary

## What Changed (Frontend)

### 1. **Increased Upload Limits**

- **File Count:** 3 → **5 videos** per car listing
- **File Size:** 50MB → **200MB** per video
- **Backend Support:** Up to 500MB configurable via env

### 2. **Expanded Video Format Support**

**Before:**

- MP4, WebM, MOV

**After:**

- MP4 (video/mp4)
- WebM (video/webm)
- MOV (video/quicktime)
- OGG (video/ogg)
- MKV (video/x-matroska)
- 3GPP (video/3gpp)

### 3. **Files Updated**

#### `/libs/components/mypage/AddNewCar.tsx`

```diff
- if (selectedFiles.length > 3) {
+ if (selectedFiles.length > 5) {

- // Check file sizes (50MB max per video)
- const maxSize = 50 * 1024 * 1024;
+ // Check file sizes (200MB max per video - backend configurable)
+ const maxSize = 200 * 1024 * 1024;

- accept="video/mp4, video/webm, video/quicktime"
+ accept="video/mp4, video/webm, video/quicktime, video/ogg, video/x-matroska, video/3gpp, .mp4, .webm, .mov, .ogg, .mkv, .3gp"
```

#### Translation Files (`en`, `kr`, `ru`)

```diff
- "mypage.uploadVideo.invalidTypes": "... Only MP4, WebM, or MOV files are allowed!"
+ "mypage.uploadVideo.invalidTypes": "... Only MP4, WebM, MOV, OGG, or MKV files are allowed!"

- "mypage.uploadVideo.limit": "Cannot upload more than 3 videos at once!"
+ "mypage.uploadVideo.limit": "Cannot upload more than 5 videos at once!"

- "mypage.uploadVideo.maxSize": "... Maximum file size is 50MB."
+ "mypage.uploadVideo.maxSize": "... Maximum file size is 200MB."

- "mypage.uploadVideo.formatTitle": "... (max 50MB each)"
+ "mypage.uploadVideo.formatTitle": "... (max 200MB each)"
```

## Backend Configuration (Already Done by You)

### `main.ts` Updates

```typescript
// Default: 200MB per file, 10 files
// Configurable via environment variables:
// - UPLOAD_MAX_FILE_SIZE_MB (e.g., 500)
// - UPLOAD_MAX_FILES (e.g., 5)
```

### Features

✅ Accepts video MIME types (mp4/webm/mov/ogg/mkv/3gpp)  
✅ Auto-creates upload target directories  
✅ `imagesUploader` works for both images and videos  
✅ File size configurable up to 500MB

## How to Test

1. **Start the application:**

```bash
npm run dev
```

2. **Navigate to Add Car page:**

   - Login as AGENT
   - Go to "Add Car" or edit existing car

3. **Test video upload:**

   - Upload 1-5 videos (any combination of MP4, WebM, MOV, OGG, MKV, 3GP)
   - Files up to 200MB should work
   - Drag-and-drop or browse files

4. **Verify backend limits (optional):**

```bash
# Test with 500MB limit
export UPLOAD_MAX_FILE_SIZE_MB=500
# Restart backend
```

## Expected Results

✅ Videos up to 200MB upload successfully  
✅ All 6 video formats accepted  
✅ Can upload up to 5 videos per car  
✅ Progress indicator shows "Uploading videos..."  
✅ Videos preview with HTML5 player  
✅ Videos saved to database and display on car detail page

## Troubleshooting

### Still getting "server returned no videos" error?

1. Check backend logs for upload errors
2. Verify `car-video` target is handled in upload resolver
3. Confirm video MIME types in `allowedUploadMimeTypes`
4. Check file permissions on upload directory

### Videos not playing?

- Ensure backend serves video files correctly
- Check CORS settings for video URLs
- Verify video codec compatibility (H.264 recommended)

### File size limit errors?

- Frontend limit: 200MB (change in `AddNewCar.tsx`)
- Backend limit: Set via `UPLOAD_MAX_FILE_SIZE_MB` env variable
- Both must be aligned for large uploads

## Migration Notes

No database migration needed - `carVideos` field already exists in:

- `Car` type
- `CarInput` type
- `CarUpdate` type

Existing cars without videos will show empty state: "No videos uploaded yet"

## Next Steps

1. ✅ Test video upload with various formats
2. ✅ Verify videos display on car detail page
3. ⚠️ Consider video compression/optimization for storage
4. ⚠️ Add video thumbnail generation (future enhancement)
5. ⚠️ Implement video streaming for better performance

---

**Status:** ✅ Ready to test  
**Last Updated:** November 6, 2025
