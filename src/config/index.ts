import dotenv from 'dotenv';

const envFound = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (envFound.error) {
  // This error should crash whole process
  throw new Error(`⚠️  Couldn't find .env.${process.env.NODE_ENV} file  ⚠️`);
}

export default {
  ENV: process.env.NODE_ENV as string,
  PORT: parseInt(process.env.PORT as string, 10) || 5000,
};
