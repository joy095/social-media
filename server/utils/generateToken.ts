import jwt from 'jsonwebtoken';
import { Response } from 'express';

// Generate JWT Token
export const generateToken = (id: string, type: 'user' | 'employee' = 'user') => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(
    { id, type },
    jwtSecret,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Send token response
export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  message: string = 'Success'
) => {
  // Create token
  const token = generateToken(user._id, 'user');

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        user,
        token
      }
    });
};
