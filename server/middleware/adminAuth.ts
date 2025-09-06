import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Employee } from '../models/Employee.js';

export interface AdminRequest extends Request {
  employee?: any;
}

// Admin authentication middleware
export const adminProtect = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token is for employee
      if (decoded.type !== 'employee') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      // Get employee from token
      const employee = await Employee.findById(decoded.id);
      
      if (!employee) {
        return res.status(401).json({
          success: false,
          message: 'Token is no longer valid'
        });
      }

      // Check if employee account is active
      if (!employee.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Check if account is locked
      if (employee.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is locked'
        });
      }

      req.employee = employee;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Admin protect middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.employee.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!req.employee.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${permission}`
      });
    }

    next();
  };
};

// Admin-only middleware (alias for admin role check)
export const adminOnly = authorize('admin');

// Manager or Admin middleware
export const managerOrAdmin = authorize('admin', 'manager');

// Accountant, Manager or Admin middleware
export const accountantOrAbove = authorize('admin', 'manager', 'accountant');

// Middleware to log admin activities
export const logAdminActivity = (action: string) => {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log successful admin activities
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[ADMIN ACTIVITY] ${req.employee?.name || 'Unknown'} (${req.employee?.role || 'Unknown'}) performed: ${action}`);
        console.log(`[ADMIN ACTIVITY] Details: ${req.method} ${req.originalUrl}`);
        console.log(`[ADMIN ACTIVITY] IP: ${req.ip || req.connection.remoteAddress}`);
        console.log(`[ADMIN ACTIVITY] Timestamp: ${new Date().toISOString()}`);
      }
      
      return originalSend.call(this, data);
    };

    next();
  };
};

// Rate limiting for admin actions (more restrictive than regular users)
export const adminRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  const requests = new Map();

  return (req: AdminRequest, res: Response, next: NextFunction) => {
    const key = req.employee?.id || req.ip;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const requestData = requests.get(key);
    
    if (now > requestData.resetTime) {
      requestData.count = 1;
      requestData.resetTime = now + windowMs;
      return next();
    }

    if (requestData.count >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
      });
    }

    requestData.count++;
    next();
  };
};

// Middleware to validate admin session
export const validateAdminSession = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: 'No active admin session'
      });
    }

    // Update last activity
    req.employee.lastLogin = new Date();
    await req.employee.save({ validateBeforeSave: false });

    next();
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Session validation failed'
    });
  }
};

export default {
  adminProtect,
  authorize,
  requirePermission,
  adminOnly,
  managerOrAdmin,
  accountantOrAbove,
  logAdminActivity,
  adminRateLimit,
  validateAdminSession
};
