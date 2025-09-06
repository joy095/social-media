export declare const uploadToR2: (filePath: string, folder?: string) => Promise<any>;
export declare const uploadVideoToR2: (filePath: string, folder?: string) => Promise<any>;
export declare const deleteFromR2: (key: string) => Promise<any>;
export declare const getOptimizedImageUrl: (key: string, options?: any) => string;
export declare const getVideoThumbnail: (key: string, options?: any) => string;
export declare const uploadMultipleToR2: (filePaths: string[], folder?: string) => Promise<any[]>;
export declare const generatePresignedUrl: (key: string, contentType: string, expiresIn?: number) => Promise<string>;
export declare const validateFile: (file: any) => {
    isValid: boolean;
    error?: string;
};
export declare const cleanupLocalFiles: (filePaths: string[]) => Promise<void>;
export declare const getR2FileInfo: (key: string) => Promise<any>;
export declare const getSignedUrl: (key: string, expiresIn?: number) => Promise<string>;
export declare const testR2Connection: () => Promise<boolean>;
declare const _default: {
    uploadToR2: (filePath: string, folder?: string) => Promise<any>;
    uploadVideoToR2: (filePath: string, folder?: string) => Promise<any>;
    deleteFromR2: (key: string) => Promise<any>;
    getOptimizedImageUrl: (key: string, options?: any) => string;
    getVideoThumbnail: (key: string, options?: any) => string;
    uploadMultipleToR2: (filePaths: string[], folder?: string) => Promise<any[]>;
    generatePresignedUrl: (key: string, contentType: string, expiresIn?: number) => Promise<string>;
    validateFile: (file: any) => {
        isValid: boolean;
        error?: string;
    };
    cleanupLocalFiles: (filePaths: string[]) => Promise<void>;
    getR2FileInfo: (key: string) => Promise<any>;
    validateR2Config: () => boolean;
    getSignedUrl: (key: string, expiresIn?: number) => Promise<string>;
    testR2Connection: () => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=r2.d.ts.map