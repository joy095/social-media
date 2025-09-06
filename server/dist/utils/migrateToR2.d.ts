/**
 * Migration script to help transition from Cloudinary to Cloudflare R2
 * This script provides utilities to:
 * 1. Test R2 connection
 * 2. Clean up old Cloudinary references
 * 3. Validate R2 configuration
 */
declare class R2MigrationHelper {
    private r2Client;
    constructor();
    /**
     * Test R2 connection and configuration
     */
    testConnection(): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * List all files in R2 bucket
     */
    listR2Files(): Promise<string[]>;
    /**
     * Count files in database that reference Cloudinary URLs
     */
    countCloudinaryReferences(): Promise<{
        posts: number;
        users: number;
        total: number;
    }>;
    /**
     * Validate environment variables
     */
    validateEnvironment(): {
        isValid: boolean;
        missing: string[];
    };
    /**
     * Clean up orphaned files in R2 (files not referenced in database)
     */
    cleanupOrphanedFiles(): Promise<{
        deleted: number;
        errors: string[];
    }>;
    /**
     * Generate migration report
     */
    generateReport(): Promise<void>;
}
export default R2MigrationHelper;
//# sourceMappingURL=migrateToR2.d.ts.map