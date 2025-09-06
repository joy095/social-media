import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
// Socket.io setup
const io = new SocketServer(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// Make io accessible to routes
app.set('socketio', io);
// Security middleware
app.use(helmet());
app.use(compression());
// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Health check endpoint  
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Import routes
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import socialRoutes from './routes/socialRoutes';
import adminRoutes from './routes/adminRoutes';
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);
// Basic test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});
// Database connection
// Database connection
async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || "";
    try {
        await mongoose.connect(mongoUri, {
            dbName: 'social-media',
            autoIndex: true,
        });
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // exit instead of running without DB
    }
}
// Initialize routes and middleware
async function initializeApp() {
    try {
        await connectDB();
        // Initialize socket handlers
        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
        console.log('App initialization complete');
    }
    catch (error) {
        console.error('App initialization failed:', error);
        process.exit(1);
    }
}
// Handle unhandled routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
const PORT = process.env.PORT || 5000;
// Initialize app and start server
initializeApp().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Server ready at http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});
export default app;
//# sourceMappingURL=server.js.map