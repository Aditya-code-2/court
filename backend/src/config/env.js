import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/court-ai',
  jwtSecret: process.env.JWT_SECRET || 'replace-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001'
};
