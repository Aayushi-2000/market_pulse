import dotenv from 'dotenv';
dotenv.config();
const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}
export const env = {
    PORT: Number(process.env.PORT) || 4003,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
};
