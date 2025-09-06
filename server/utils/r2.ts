import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import { fileTypeFromFile } from "file-type";
import pRetry from "p-retry";

// Validate R2 configuration
const validateR2Config = (): boolean => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    console.error("Missing Cloudflare R2 configuration:");
    if (!accountId) console.error("- CLOUDFLARE_ACCOUNT_ID is missing");
    if (!accessKeyId) console.error("- CLOUDFLARE_R2_ACCESS_KEY_ID is missing");
    if (!secretAccessKey) console.error("- CLOUDFLARE_R2_SECRET_ACCESS_KEY is missing");
    if (!bucketName) console.error("- CLOUDFLARE_R2_BUCKET_NAME is missing");
    if (!publicUrl) console.error("- CLOUDFLARE_R2_PUBLIC_URL is missing");
    return false;
  }

  return true;
};

// Configure R2 client
let isR2Configured = false;
let r2Client: S3Client;

try {
  console.log("Cloudflare R2 Environment Variables:");
  console.log("- CLOUDFLARE_ACCOUNT_ID:", process.env.CLOUDFLARE_ACCOUNT_ID ? "✓ Set" : "✗ Not set");
  console.log("- CLOUDFLARE_R2_ACCESS_KEY_ID:", process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? "✓ Set" : "✗ Not set");
  console.log("- CLOUDFLARE_R2_SECRET_ACCESS_KEY:", process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? "✓ Set" : "✗ Not set");
  console.log("- CLOUDFLARE_R2_BUCKET_NAME:", process.env.CLOUDFLARE_R2_BUCKET_NAME ? "✓ Set" : "✗ Not set");
  console.log("- CLOUDFLARE_R2_PUBLIC_URL:", process.env.CLOUDFLARE_R2_PUBLIC_URL ? "✓ Set" : "✗ Not set");

  if (validateR2Config()) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });
    
    isR2Configured = true;
    console.log("✓ Cloudflare R2 configured successfully");
  } else {
    console.error("✗ Cloudflare R2 configuration validation failed");
    console.error("Please set up your Cloudflare R2 environment variables. See env.example for reference.");
  }
} catch (error) {
  console.error("Error configuring Cloudflare R2:", error);
}

// Custom error classes
class R2UploadError extends Error {
  constructor(message: string, public httpCode?: number) {
    super(message);
    this.name = "R2UploadError";
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

// Generate unique key for R2
const generateKey = (filePath: string, folder: string = "social-media-upload"): string => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const extension = path.extname(filePath);
  const filename = `${timestamp}-${random}${extension}`;
  return `${folder}/${filename}`;
};

// Upload file to R2
export const uploadToR2 = async (
  filePath: string,
  folder: string = "social-media-upload"
): Promise<any> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please set up your R2 environment variables.");
  }

  try {
    await validateFilePath(filePath);
    await validateFileType(filePath);

    const stats = await getFileStats(filePath);
    const key = generateKey(filePath, folder);
    const fileBuffer = await fs.promises.readFile(filePath);
    
    // Determine content type
    const fileType = await fileTypeFromFile(filePath);
    const contentType = fileType?.mime || 'application/octet-stream';

    console.log(`Uploading file: ${filePath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB) to R2`);

    const result = await pRetry(async () => {
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          Metadata: {
            originalName: path.basename(filePath),
            uploadedAt: new Date().toISOString(),
          },
        });

        await r2Client.send(command);
        
        // Return result in similar format to Cloudinary
        return {
          public_id: key,
          secure_url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
          url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
          format: fileType?.ext || path.extname(filePath).slice(1),
          resource_type: fileType?.mime?.startsWith('video/') ? 'video' : 'image',
          bytes: stats.size,
          width: null, // R2 doesn't provide image dimensions
          height: null,
          created_at: new Date().toISOString(),
        };
      } catch (error) {
        throw ensureError(error);
      }
    }, {
      retries: 3,
      onFailedAttempt: (error) => {
        console.log(`Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
        console.log(`Error details: ${error.message}`);
      }
    });

    console.log("✓ File uploaded to R2:", result.secure_url);
    return result;
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("✗ R2 upload failed:", {
      message: properError.message,
      http_code: (properError as any).http_code,
      name: properError.name,
    });

    if (properError instanceof R2UploadError) {
      throw properError;
    }

    const errorMessage = properError.message || 'Unknown error occurred';
    const httpCode = (properError as any).http_code || (properError as any).statusCode;
    throw new R2UploadError(`R2 upload failed: ${errorMessage}`, httpCode);
  }
};

// Upload video to R2 (alias for uploadToR2)
export const uploadVideoToR2 = async (
  filePath: string,
  folder: string = "social-media-upload"
): Promise<any> => {
  return uploadToR2(filePath, `${folder}/videos`);
};

// Delete file from R2
export const deleteFromR2 = async (
  key: string
): Promise<any> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please check your environment variables.");
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`✓ Deleted file from R2: ${key}`);
    
    return { result: 'ok' };
  } catch (error: any) {
    const properError = ensureError(error);
    console.error(`✗ Failed to delete file ${key} from R2:`, properError.message);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new R2UploadError(`Failed to delete file from R2: ${errorMessage}`);
  }
};

// Get optimized image URL (for R2, we just return the public URL)
export const getOptimizedImageUrl = (
  key: string,
  options: any = {}
): string => {
  // R2 doesn't have built-in image transformations like Cloudinary
  // You would need to implement image processing separately if needed
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
};

// Get video thumbnail URL (placeholder - would need separate thumbnail generation)
export const getVideoThumbnail = (
  key: string,
  options: any = {}
): string => {
  // For R2, you'd need to generate thumbnails separately
  // This is a placeholder that returns the video URL
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
};

// Upload multiple files to R2
export const uploadMultipleToR2 = async (
  filePaths: string[],
  folder: string = "social-media-upload"
): Promise<any[]> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please check your environment variables.");
  }

  const uploadPromises = filePaths.map(async (filePath) => {
    try {
      await validateFilePath(filePath);
      await validateFileType(filePath);

      // Determine if it's an image or video based on file extension
      const isVideo = /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(filePath);

      if (isVideo) {
        return uploadVideoToR2(filePath, `${folder}/videos`);
      } else {
        return uploadToR2(filePath, `${folder}/images`);
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
    throw new R2UploadError(`Failed to upload multiple files to R2: ${errorMessage}`);
  }
};

// Generate presigned URL for direct uploads
export const generatePresignedUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please check your environment variables.");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return presignedUrl;
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("Error generating presigned URL:", properError);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new Error(`Failed to generate presigned URL: ${errorMessage}`);
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

// Get file info from R2
export const getR2FileInfo = async (
  key: string
): Promise<any> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please check your environment variables.");
  }

  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
    });

    const result = await r2Client.send(command);
    
    return {
      key,
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      metadata: result.Metadata,
      url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
    };
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("Error getting file info from R2:", properError.message);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new R2UploadError(`Failed to get file information from R2: ${errorMessage}`);
  }
};

// Get signed URL for private content
export const getSignedUrl = async (
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  if (!isR2Configured) {
    throw new Error("Cloudflare R2 is not configured. Please check your environment variables.");
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error: any) {
    const properError = ensureError(error);
    console.error("Error generating signed URL:", properError);
    
    const errorMessage = properError.message || 'Unknown error occurred';
    throw new R2UploadError(`Failed to generate signed URL: ${errorMessage}`);
  }
};

// Test R2 connection
export const testR2Connection = async (): Promise<boolean> => {
  if (!isR2Configured) {
    return false;
  }

  try {
    // Try to list objects (this will fail if bucket doesn't exist or no permissions)
    const command = new HeadObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: 'test-connection',
    });

    await r2Client.send(command);
    return true;
  } catch (error: any) {
    // If it's a 404, the bucket exists but the test key doesn't - that's fine
    if (error.name === 'NotFound') {
      return true;
    }
    console.error('R2 connection test failed:', error.message);
    return false;
  }
};

export default {
  uploadToR2,
  uploadVideoToR2,
  deleteFromR2,
  getOptimizedImageUrl,
  getVideoThumbnail,
  uploadMultipleToR2,
  generatePresignedUrl,
  validateFile,
  cleanupLocalFiles,
  getR2FileInfo,
  validateR2Config,
  getSignedUrl,
  testR2Connection,
};
