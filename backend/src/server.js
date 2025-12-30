require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const departmentRoutes = require('./routes/department.routes');
const shiftRoutes = require('./routes/shift.routes');
const holidayRoutes = require('./routes/holiday.routes');
const reportRoutes = require('./routes/report.routes');
const faceRoutes = require('./routes/face.routes');
const configRoutes = require('./routes/config.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - support multiple origins for Railway deployment
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || 
            origin.endsWith('.railway.app') || 
            origin.endsWith('.up.railway.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}
app.use(requestLogger);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root endpoint - API info
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Raymond Attendance Management API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/users',
            attendance: '/api/attendance',
            leaves: '/api/leaves',
            departments: '/api/departments',
            shifts: '/api/shifts',
            holidays: '/api/holidays',
            reports: '/api/reports',
            face: '/api/face',
            config: '/api/config'
        },
        documentation: 'Use /api/* endpoints to access the API'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Raymond Attendance API',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/config', configRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║     Raymond Lifestyle Ltd. - Attendance Management API     ║
╠════════════════════════════════════════════════════════════╣
║  Server running on port: ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV || 'development'}                            ║
║  API Base URL: http://localhost:${PORT}/api                   ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
