import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
// Set ffmpeg path if using ffmpeg-static
if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}
export const processVideo = (inputPath) => {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const inputFileName = path.basename(inputPath, path.extname(inputPath));
        const outputDir = path.dirname(inputPath);
        const outputVideoPath = path.join(outputDir, `${inputFileName}_processed_${timestamp}.mp4`);
        const thumbnailPath = path.join(outputDir, `${inputFileName}_thumb_${timestamp}.jpg`);
        // First, get video metadata
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) {
                return reject(new Error(`Failed to probe video: ${err.message}`));
            }
            const originalDuration = metadata.format.duration || 0;
            const targetDuration = Math.min(originalDuration, 60); // Max 1 minute
            // Process video - trim to 60 seconds max
            let videoProcessor = ffmpeg(inputPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .format('mp4')
                .size('?x720') // Max height 720p, maintain aspect ratio
                .videoBitrate('1000k')
                .audioBitrate('128k');
            // If video is longer than 60 seconds, trim it
            if (originalDuration > 60) {
                videoProcessor = videoProcessor.duration(60);
            }
            videoProcessor
                .on('start', (commandLine) => {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
                .on('progress', (progress) => {
                console.log('Processing video: ' + Math.round(progress.percent) + '% done');
            })
                .on('end', () => {
                console.log('Video processing finished successfully');
                // Generate thumbnail at 2-second mark or middle of video if shorter
                const thumbnailTimestamp = Math.min(2, targetDuration / 2);
                ffmpeg(outputVideoPath)
                    .screenshots({
                    timestamps: [thumbnailTimestamp],
                    filename: path.basename(thumbnailPath),
                    folder: outputDir,
                    size: '640x360'
                })
                    .on('end', () => {
                    console.log('Thumbnail generation finished successfully');
                    resolve({
                        videoPath: outputVideoPath,
                        thumbnailPath: thumbnailPath,
                        duration: targetDuration
                    });
                })
                    .on('error', (err) => {
                    console.error('Error generating thumbnail:', err);
                    // Even if thumbnail generation fails, return the processed video
                    resolve({
                        videoPath: outputVideoPath,
                        thumbnailPath: '',
                        duration: targetDuration
                    });
                });
            })
                .on('error', (err) => {
                console.error('Error processing video:', err);
                reject(new Error(`Video processing failed: ${err.message}`));
            })
                .save(outputVideoPath);
        });
    });
};
// Function to get video duration
export const getVideoDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                return reject(new Error(`Failed to get video duration: ${err.message}`));
            }
            const duration = metadata.format.duration || 0;
            resolve(duration);
        });
    });
};
// Function to generate video thumbnail at specific time
export const generateThumbnail = (videoPath, timestamp = 2, outputPath) => {
    return new Promise((resolve, reject) => {
        const outputFileName = outputPath ||
            path.join(path.dirname(videoPath), `${path.basename(videoPath, path.extname(videoPath))}_thumb_${Date.now()}.jpg`);
        ffmpeg(videoPath)
            .screenshots({
            timestamps: [timestamp],
            filename: path.basename(outputFileName),
            folder: path.dirname(outputFileName),
            size: '640x360'
        })
            .on('end', () => {
            resolve(outputFileName);
        })
            .on('error', (err) => {
            reject(new Error(`Thumbnail generation failed: ${err.message}`));
        });
    });
};
// Function to compress video while maintaining quality
export const compressVideo = (inputPath, outputPath, quality = 'medium') => {
    return new Promise((resolve, reject) => {
        const output = outputPath ||
            path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}_compressed_${Date.now()}.mp4`);
        let videoBitrate;
        let audioBitrate;
        let size;
        switch (quality) {
            case 'low':
                videoBitrate = '500k';
                audioBitrate = '64k';
                size = '?x480';
                break;
            case 'high':
                videoBitrate = '2000k';
                audioBitrate = '192k';
                size = '?x1080';
                break;
            default: // medium
                videoBitrate = '1000k';
                audioBitrate = '128k';
                size = '?x720';
        }
        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .videoBitrate(videoBitrate)
            .audioBitrate(audioBitrate)
            .size(size)
            .format('mp4')
            .on('start', (commandLine) => {
            console.log('Compressing video with command: ' + commandLine);
        })
            .on('progress', (progress) => {
            console.log('Compressing: ' + Math.round(progress.percent) + '% done');
        })
            .on('end', () => {
            console.log('Video compression finished successfully');
            resolve(output);
        })
            .on('error', (err) => {
            console.error('Error compressing video:', err);
            reject(new Error(`Video compression failed: ${err.message}`));
        })
            .save(output);
    });
};
// Function to convert video to different format
export const convertVideoFormat = (inputPath, outputFormat, outputPath) => {
    return new Promise((resolve, reject) => {
        const output = outputPath ||
            path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}_converted_${Date.now()}.${outputFormat}`);
        ffmpeg(inputPath)
            .format(outputFormat)
            .on('start', (commandLine) => {
            console.log('Converting video with command: ' + commandLine);
        })
            .on('progress', (progress) => {
            console.log('Converting: ' + Math.round(progress.percent) + '% done');
        })
            .on('end', () => {
            console.log('Video conversion finished successfully');
            resolve(output);
        })
            .on('error', (err) => {
            console.error('Error converting video:', err);
            reject(new Error(`Video conversion failed: ${err.message}`));
        })
            .save(output);
    });
};
// Function to clean up temporary video files
export const cleanupVideoFiles = (filePaths) => {
    filePaths.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up temporary file: ${filePath}`);
            }
        }
        catch (error) {
            console.error(`Error cleaning up file ${filePath}:`, error);
        }
    });
};
export default {
    processVideo,
    getVideoDuration,
    generateThumbnail,
    compressVideo,
    convertVideoFormat,
    cleanupVideoFiles
};
//# sourceMappingURL=videoProcessor.js.map