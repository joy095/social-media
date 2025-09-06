import mongoose from 'mongoose';
import { Employee } from '../models/Employee.js';
import { Revenue } from '../models/Revenue.js';
const seedAdminAndData = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding');
        // Create default admin account
        const adminExists = await Employee.findOne({ email: 'admin@socialmedia.com' });
        if (!adminExists) {
            const admin = await Employee.create({
                name: 'System Administrator',
                email: 'admin@socialmedia.com',
                mobile: '9999999999',
                password: 'Admin@123',
                role: 'admin'
            });
        }
        else {
            console.log('Admin account already exists');
        }
        // Create default manager account
        const managerExists = await Employee.findOne({ email: 'manager@socialmedia.com' });
        if (!managerExists) {
            const manager = await Employee.create({
                name: 'Content Manager',
                email: 'manager@socialmedia.com',
                mobile: '8888888888',
                password: 'Manager@123',
                role: 'manager'
            });
        }
        else {
            console.log('Manager account already exists');
        }
        // Create default accountant account
        const accountantExists = await Employee.findOne({ email: 'accountant@socialmedia.com' });
        if (!accountantExists) {
            const accountant = await Employee.create({
                name: 'Finance Accountant',
                email: 'accountant@socialmedia.com',
                mobile: '7777777777',
                password: 'Accountant@123',
                role: 'accountant'
            });
        }
        else {
            console.log('ℹ️  Accountant account already exists');
        }
        // Seed default revenue pricing for major cities
        const defaultPricing = [
            { city: 'MUMBAI', pricePerView: 0.05, pricePerLike: 0.10 },
            { city: 'DELHI', pricePerView: 0.04, pricePerLike: 0.08 },
            { city: 'BANGALORE', pricePerView: 0.04, pricePerLike: 0.08 },
            { city: 'HYDERABAD', pricePerView: 0.03, pricePerLike: 0.06 },
            { city: 'CHENNAI', pricePerView: 0.03, pricePerLike: 0.06 },
            { city: 'KOLKATA', pricePerView: 0.03, pricePerLike: 0.06 },
            { city: 'PUNE', pricePerView: 0.03, pricePerLike: 0.06 },
            { city: 'AHMEDABAD', pricePerView: 0.03, pricePerLike: 0.06 },
            { city: 'JAIPUR', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'SURAT', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'LUCKNOW', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'KANPUR', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'NAGPUR', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'INDORE', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'BHOPAL', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'PATNA', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'VADODARA', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'LUDHIANA', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'AGRA', pricePerView: 0.02, pricePerLike: 0.04 },
            { city: 'NASHIK', pricePerView: 0.02, pricePerLike: 0.04 }
        ];
        const admin = await Employee.findOne({ email: 'admin@socialmedia.com' });
        let createdCount = 0;
        for (const pricing of defaultPricing) {
            const exists = await Revenue.findOne({ city: pricing.city });
            if (!exists) {
                await Revenue.create({
                    ...pricing,
                    createdBy: admin?._id
                });
                createdCount++;
            }
        }
        if (createdCount > 0) {
            console.log(`Created default revenue pricing for ${createdCount} cities`);
        }
        else {
            console.log('Revenue pricing already exists for major cities');
        }
    }
    catch (error) {
        console.error('Seeding failed:', error);
    }
    finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
// Run seeding
console.log('Starting database seeding...\n');
seedAdminAndData();
//# sourceMappingURL=seedAdmin.js.map