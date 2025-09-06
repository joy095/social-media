interface ProcessedVideo {
    videoPath: string;
    thumbnailPath: string;
    duration: number;
}
export declare const processVideo: (inputPath: string) => Promise<ProcessedVideo>;
export declare const getVideoDuration: (videoPath: string) => Promise<number>;
export declare const generateThumbnail: (videoPath: string, timestamp?: number, outputPath?: string) => Promise<string>;
export declare const compressVideo: (inputPath: string, outputPath?: string, quality?: "low" | "medium" | "high") => Promise<string>;
export declare const convertVideoFormat: (inputPath: string, outputFormat: string, outputPath?: string) => Promise<string>;
export declare const cleanupVideoFiles: (filePaths: string[]) => void;
declare const _default: {
    processVideo: (inputPath: string) => Promise<ProcessedVideo>;
    getVideoDuration: (videoPath: string) => Promise<number>;
    generateThumbnail: (videoPath: string, timestamp?: number, outputPath?: string) => Promise<string>;
    compressVideo: (inputPath: string, outputPath?: string, quality?: "low" | "medium" | "high") => Promise<string>;
    convertVideoFormat: (inputPath: string, outputFormat: string, outputPath?: string) => Promise<string>;
    cleanupVideoFiles: (filePaths: string[]) => void;
};
export default _default;
//# sourceMappingURL=videoProcessor.d.ts.map