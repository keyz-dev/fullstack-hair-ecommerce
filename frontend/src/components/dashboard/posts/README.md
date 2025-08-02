# Post Image Upload System

## Overview
The post image upload system has been enhanced to support image captions and ordering, which are required by the backend for proper post creation.

## Features

### 1. Image Upload with Captions
- Users can upload multiple images (up to 10)
- Each image can have a custom caption
- Captions are editable inline with save/cancel functionality
- Captions are displayed as overlays on image previews

### 2. Drag-and-Drop Reordering
- Images can be reordered using drag-and-drop
- Order is automatically maintained and sent to backend
- Visual order indicators show the current sequence

### 3. Enhanced UI/UX
- Drag handles for easy reordering
- Inline caption editing with keyboard shortcuts (Enter to save, Escape to cancel)
- Visual feedback for drag operations
- Order badges on image previews

## Data Structure

### Frontend Image Object
```javascript
{
  id: "unique-id",
  file: File,           // The actual file object
  url: "data-url",      // Preview URL
  name: "filename.jpg", // Original filename
  caption: "Caption",   // User-provided caption
  order: 0             // Position in sequence (0-based)
}
```

### Backend Submission
The system sends three separate arrays to the backend:
- `postImages`: Array of File objects
- `imageCaptions`: Array of caption strings
- `imageOrder`: Array of order numbers

## Usage

### Uploading Images
1. Click "Add Images" or drag files to the upload area
2. Images are automatically assigned order numbers
3. Click the edit icon next to each image to add/edit captions
4. Drag images by the grip handle to reorder them
5. Click "Continue" to proceed to the next step

### Editing Captions
- Click the edit icon (pencil) next to any image
- Type your caption in the input field
- Press Enter or click "Save" to save
- Press Escape or click "Cancel" to cancel

### Reordering Images
- Drag images using the grip handle (⋮⋮) on the left
- Drop them in the desired position
- Order numbers are automatically updated

## Technical Implementation

### Components
- `PostImageUploadModal.jsx`: Main upload interface with drag-and-drop
- `ImageUploadStep.jsx`: Step wrapper with preview functionality
- `CreatePostPage.jsx`: Orchestrates the upload process

### Dependencies
- `react-dropzone`: For drag-and-drop file uploads
- `lucide-react`: For icons (GripVertical, Edit3, etc.)

### Key Functions
- `handleDragStart/handleDrop`: Manages drag-and-drop reordering
- `updateCaption`: Updates image captions
- `removeImage`: Removes images and reorders remaining ones
- `handleImageUpload`: Prepares data for backend submission

## Backend Requirements

The backend expects:
1. `postImages`: Multipart form data array of image files
2. `imageCaptions`: Array of caption strings (one per image)
3. `imageOrder`: Array of order numbers (one per image)

All arrays should have the same length and maintain the same index mapping. 