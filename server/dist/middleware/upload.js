import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const tempDir = path.join(uploadsDir, 'temp');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.fieldname === 'profilePicture') {
        // Only allow images for profile pictures
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Profile picture must be an image file'), false);
        }
    }
    else if (file.fieldname === 'media') {
        // Allow images and videos for post media
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Media files must be images or videos'), false);
        }
    }
    else {
        cb(new Error('Unexpected field'), false);
    }
};
// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 5 // Maximum 5 files at once
    }
});
// Middleware for single profile picture upload
export const uploadProfilePicture = upload.single('profilePicture');
// Middleware for multiple media files (posts)
export const uploadMedia = upload.array('media', 5);
export const uploadPostMedia = uploadMedia; // Alias for posts
// Middleware for single media file
export const uploadSingleMedia = upload.single('media');
// Error handling middleware for multer errors
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File too large. Maximum size is 50MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({
                success: false,
                message: 'Too many files. Maximum 5 files allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field.'
            });
        }
    }
    if (error.message) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next(error);
};
// Cleanup temporary files
export const cleanupTempFiles = (files) => {
    if (!files)
        return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
            fs.unlink(file.path, (err) => {
                if (err)
                    console.error('Error deleting temp file:', err);
            });
        }
    });
};
//# sourceMappingURL=upload.js.map