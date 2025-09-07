import fs from "fs";
import path from "path";
import { fileTypeFromFile } from "file-type";

// Custom error classes
class LocalStorageError extends Error {
  constructor(message: string, public httpCode?: number) {
    super(message);
    this.name = "LocalStorageError";
  }
}

class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
    this.name = "FileNotFoundError";
  }
}

class InvalidFileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFileTypeError";
  }
}

// Helper to validate file path
const validateFilePath = async (filePath: string): Promise<void> => {
  const resolvedPath = path.resolve(filePath);

  // Prevent directory traversal
  if (!resolvedPath.startsWith(process.cwd())) {
    throw new Error("Invalid file path - directory traversal detected");
  }

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch {
    throw new FileNotFoundError(filePath);
  }
};

// Helper to get file stats
const getFileStats = async (filePath: string) => {
  const stats = await fs.promises.stat(filePath);
  return stats;
};

// Helper to validate file content type
const validateFileType = async (filePath: string): Promise<void> => {
  try {
    const fileType = await fileTypeFromFile(filePath);

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm"
    ];

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      throw new InvalidFileTypeError(`File type not allowed: ${fileType?.mime || 'unknown'}`);
    }
  } catch (error: any) {
    if (error instanceof InvalidFileTypeError) {
      throw error;
    }
    throw new InvalidFileTypeError(`Unable to determine file type: ${error.message || error}`);
  }
};

// Helper to convert any value to a proper Error instance
const ensureError = (error: any): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const message = error.message || JSON.stringify(error);
    const httpCode = error.http_code || error.statusCode || error.httpCode;
    const properError = new Error(message);
    (properError as any).http_code = httpCode;
    (properError as any).originalObject = error;
    return properError;
  }

  return new Error(String(error));
};

// Generate unique filename for local storage
const generateUniqueFilename = (originalPath: string, folder: string = "uploads"): string => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const extension = path.extname(originalPath);
  const filename = `${timestamp}-${random}${extension}`;
  return path.join(folder, filename);
};

// Ensure directory exists
const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
};

// Upload file to local storage (moves file from temp to permanent location)
export const uploadToLocal = async (
  filePath: string,
  folder: string = "uploads"
): Promise<any> => {
  try {
    await validateFilePath(filePath);
    await validateFileType(filePath);

    const stats = await getFileStats(filePath);
    const filename = generateUniqueFilename(filePath, folder);
    const fullPath = path.join(process.cwd(), filename);
    
    // Ensure directory exists
    await ensureDirectoryExists(path.dirname(fullPath));
    
    // Determine content type
    const fileType = await fileTypeFromFile(filePath);
    const contentType = fileType?.mime || 'application/octet-stream';

    console.log(`Moving file: ${filePath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB) to local storage`);

    // Move file to permanent location
    await fs.promises.rename(filePath, fullPath);
    
    // Return result in similar format to R2/Cloudinary
    return {
      public_id: filename,
      secure_url: `/uploads/${path.basename(filename)}`,
      url: `/uploads/${path.basename(filename)}`,
      format: fileType?.ext || path.extname(filePath).slice(1),
      resource_type: fileType?.mime?.startsWith('video/') ? 'video' : 'image',
      bytes: stats.size,
      width: null, // Local storage doesn't provide image dimensions
      height: null,
      created_at: new Date().toISOString(),
      localPath: fullPath,
    };
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("✗ Local storage upload failed:", {
      message: properError.message,
      http_code: (properError as any).http_code,
      name: properError.name,
    });

    if (properError instanceof LocalStorageError) {
      throw properError;
    }

    const errorMessage = properError.message || 'Unknown error occurred';
    const httpCode = (properError as any).http_code || (properError as any).statusCode;
    throw new LocalStorageError(`Local storage upload failed: ${errorMessage}`, httpCode);
  }
};

// Upload video to local storage (alias for uploadToLocal)
export const uploadVideoToLocal = async (
  filePath: string,
  folder: string = "uploads"
): Promise<any> => {
  return uploadToLocal(filePath, `${folder}/videos`);
};

// Delete file from local storage
export const deleteFromLocal = async (
  filePath: string
): Promise<any> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Validate path to prevent directory traversal
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error("Invalid file path - directory traversal detected");
    }

    await fs.promises.access(fullPath, fs.constants.F_OK);
    await fs.promises.unlink(fullPath);
    console.log(`✓ Deleted file from local storage: ${filePath}`);
    
    return { result: 'ok' };
  } catch (error: any) {
    const properError = ensureError(error);
    console.error(`✗ Failed to delete file ${filePath} from local storage:`, properError.message);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new LocalStorageError(`Failed to delete file from local storage: ${errorMessage}`);
  }
};

// Get optimized image URL (for local storage, we just return the public URL)
export const getOptimizedImageUrl = (
  filePath: string,
  options: any = {}
): string => {
  // For local storage, we just return the public URL
  // You could implement image processing here if needed
  return `/uploads/${path.basename(filePath)}`;
};

// Get video thumbnail URL (placeholder - would need separate thumbnail generation)
export const getVideoThumbnail = (
  filePath: string,
  options: any = {}
): string => {
  // For local storage, you'd need to generate thumbnails separately
  // This is a placeholder that returns the video URL
  return `/uploads/${path.basename(filePath)}`;
};

// Upload multiple files to local storage
export const uploadMultipleToLocal = async (
  filePaths: string[],
  folder: string = "uploads"
): Promise<any[]> => {
  const uploadPromises = filePaths.map(async (filePath) => {
    try {
      await validateFilePath(filePath);
      await validateFileType(filePath);

      // Determine if it's an image or video based on file extension
      const isVideo = /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(filePath);

      if (isVideo) {
        return uploadVideoToLocal(filePath, `${folder}/videos`);
      } else {
        return uploadToLocal(filePath, `${folder}/images`);
      }
    } catch (error: any) {
      const properError = ensureError(error);
      console.error(`Failed to process file ${filePath}:`, properError.message);
      throw properError;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("Multiple upload error:", properError.message);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new LocalStorageError(`Failed to upload multiple files to local storage: ${errorMessage}`);
  }
};

// Validate file before upload
export const validateFile = (
  file: any
): { isValid: boolean; error?: string } => {
  try {
    // Check file size (50MB max for images, 100MB for videos)
    const maxSize = file.mimetype?.startsWith("video/")
      ? 100 * 1024 * 1024
      : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size too large. Maximum size is ${file.mimetype?.startsWith("video/") ? "100MB" : "50MB"}.`,
      };
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm",
    ];

    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: "File type not allowed. Please upload an image or video file.",
      };
    }

    return { isValid: true };
  } catch (error: any) {
    return {
      isValid: false,
      error: `Validation error: ${error.message || 'Unknown error'}`
    };
  }
};

// Clean up local files after upload
export const cleanupLocalFiles = async (filePaths: string[]): Promise<void> => {
  const cleanupPromises = filePaths.map(async (filePath) => {
    try {
      await fs.promises.access(filePath);
      await fs.promises.unlink(filePath);
      console.log(`Cleaned up local file: ${filePath}`);
    } catch (error) {
      console.error(`Error cleaning up file ${filePath}:`, error);
    }
  });

  await Promise.allSettled(cleanupPromises);
};

// Get file info from local storage
export const getLocalFileInfo = async (
  filePath: string
): Promise<any> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Validate path to prevent directory traversal
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error("Invalid file path - directory traversal detected");
    }

    const stats = await fs.promises.stat(fullPath);
    
    return {
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime,
      url: `/uploads/${path.basename(filePath)}`,
    };
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("Error getting file info from local storage:", properError.message);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new LocalStorageError(`Failed to get file information from local storage: ${errorMessage}`);
  }
};

// Test local storage connection (always returns true for local storage)
export const testLocalStorageConnection = async (): Promise<boolean> => {
  try {
    // Test if we can create and delete a test file
    const testDir = path.join(process.cwd(), 'uploads', 'test');
    await ensureDirectoryExists(testDir);
    
    const testFile = path.join(testDir, 'test.txt');
    await fs.promises.writeFile(testFile, 'test');
    await fs.promises.unlink(testFile);
    
    return true;
  } catch (error: any) {
    console.error('Local storage connection test failed:', error.message);
    return false;
  }
};

export default {
  uploadToLocal,
  uploadVideoToLocal,
  deleteFromLocal,
  getOptimizedImageUrl,
  getVideoThumbnail,
  uploadMultipleToLocal,
  validateFile,
  cleanupLocalFiles,
  getLocalFileInfo,
  testLocalStorageConnection,
};

