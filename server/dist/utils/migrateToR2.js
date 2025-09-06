import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { deleteFromR2, testR2Connection } from "./r2";
/**
 * Migration script to help transition from Cloudinary to Cloudflare R2
 * This script provides utilities to:
 * 1. Test R2 connection
 * 2. Clean up old Cloudinary references
 * 3. Validate R2 configuration
 */
class R2MigrationHelper {
    r2Client;
    constructor() {
        this.r2Client = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            },
        });
    }
    /**
     * Test R2 connection and configuration
     */
    async testConnection() {
        try {
            const isConnected = await testR2Connection();
            if (isConnected) {
                return {
                    success: true,
                    message: "✓ R2 connection successful"
                };
            }
            else {
                return {
                    success: false,
                    message: "✗ R2 connection failed - check your configuration"
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `✗ R2 connection error: ${error.message}`
            };
        }
    }
    /**
     * List all files in R2 bucket
     */
    async listR2Files() {
        try {
            const command = new ListObjectsV2Command({
                Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            });
            const response = await this.r2Client.send(command);
            return response.Contents?.map(obj => obj.Key) || [];
        }
        catch (error) {
            console.error("Error listing R2 files:", error.message);
            return [];
        }
    }
    /**
     * Count files in database that reference Cloudinary URLs
     */
    async countCloudinaryReferences() {
        try {
            // Count posts with Cloudinary URLs
            const postsWithCloudinary = await Post.countDocuments({
                "media.url": { $regex: /cloudinary\.com/ }
            });
            // Count users with Cloudinary profile pictures
            const usersWithCloudinary = await User.countDocuments({
                "profilePicture.url": { $regex: /cloudinary\.com/ }
            });
            return {
                posts: postsWithCloudinary,
                users: usersWithCloudinary,
                total: postsWithCloudinary + usersWithCloudinary
            };
        }
        catch (error) {
            console.error("Error counting Cloudinary references:", error.message);
            return { posts: 0, users: 0, total: 0 };
        }
    }
    /**
     * Validate environment variables
     */
    validateEnvironment() {
        const required = [
            'CLOUDFLARE_ACCOUNT_ID',
            'CLOUDFLARE_R2_ACCESS_KEY_ID',
            'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
            'CLOUDFLARE_R2_BUCKET_NAME',
            'CLOUDFLARE_R2_PUBLIC_URL'
        ];
        const missing = required.filter(key => !process.env[key]);
        return {
            isValid: missing.length === 0,
            missing
        };
    }
    /**
     * Clean up orphaned files in R2 (files not referenced in database)
     */
    async cleanupOrphanedFiles() {
        const deleted = 0;
        const errors = [];
        try {
            // Get all R2 files
            const r2Files = await this.listR2Files();
            // Get all referenced files from database
            const posts = await Post.find({}, { media: 1 });
            const users = await User.find({}, { profilePicture: 1 });
            const referencedFiles = new Set();
            // Collect all referenced file keys
            posts.forEach(post => {
                post.media?.forEach((media) => {
                    if (media.publicId) {
                        referencedFiles.add(media.publicId);
                    }
                });
            });
            users.forEach(user => {
                if (user.profilePicture?.publicId) {
                    referencedFiles.add(user.profilePicture.publicId);
                }
            });
            // Find orphaned files
            const orphanedFiles = r2Files.filter(file => !referencedFiles.has(file));
            // Delete orphaned files
            for (const file of orphanedFiles) {
                try {
                    await deleteFromR2(file);
                    deleted++;
                }
                catch (error) {
                    errors.push(`Failed to delete ${file}: ${error.message}`);
                }
            }
        }
        catch (error) {
            errors.push(`Cleanup error: ${error.message}`);
        }
        return { deleted, errors };
    }
    /**
     * Generate migration report
     */
    async generateReport() {
        console.log("\n=== R2 Migration Report ===\n");
        // Test connection
        const connectionTest = await this.testConnection();
        console.log(`Connection: ${connectionTest.message}`);
        // Validate environment
        const envValidation = this.validateEnvironment();
        if (envValidation.isValid) {
            console.log("Environment: ✓ All required variables are set");
        }
        else {
            console.log(`Environment: ✗ Missing variables: ${envValidation.missing.join(', ')}`);
        }
        // Count Cloudinary references
        const cloudinaryCount = await this.countCloudinaryReferences();
        console.log(`\nCloudinary References:`);
        console.log(`  Posts: ${cloudinaryCount.posts}`);
        console.log(`  Users: ${cloudinaryCount.users}`);
        console.log(`  Total: ${cloudinaryCount.total}`);
        // List R2 files
        const r2Files = await this.listR2Files();
        console.log(`\nR2 Files: ${r2Files.length} files in bucket`);
        // Cleanup report
        if (r2Files.length > 0) {
            const cleanup = await this.cleanupOrphanedFiles();
            console.log(`\nCleanup:`);
            console.log(`  Deleted: ${cleanup.deleted} orphaned files`);
            if (cleanup.errors.length > 0) {
                console.log(`  Errors: ${cleanup.errors.length}`);
                cleanup.errors.forEach(error => console.log(`    - ${error}`));
            }
        }
        console.log("\n=== End Report ===\n");
    }
}
// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const migrationHelper = new R2MigrationHelper();
    const command = process.argv[2];
    switch (command) {
        case 'test':
            migrationHelper.testConnection().then(result => {
                console.log(result.message);
                process.exit(result.success ? 0 : 1);
            });
            break;
        case 'report':
            migrationHelper.generateReport();
            break;
        case 'cleanup':
            migrationHelper.cleanupOrphanedFiles().then(result => {
                console.log(`Deleted ${result.deleted} orphaned files`);
                if (result.errors.length > 0) {
                    console.log('Errors:', result.errors);
                }
            });
            break;
        default:
            console.log('Usage:');
            console.log('  bun migrateToR2.ts test     - Test R2 connection');
            console.log('  bun migrateToR2.ts report   - Generate migration report');
            console.log('  bun migrateToR2.ts cleanup  - Clean up orphaned files');
            break;
    }
}
export default R2MigrationHelper;
//# sourceMappingURL=migrateToR2.js.map