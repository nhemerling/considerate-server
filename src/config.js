module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://nhemerling@localhost/considerate',
  JWT_SECRET: process.env.JWT_SECRET || 'b4fef35e-9b11-4fad-b98f-39b96b0ced3b',
};
