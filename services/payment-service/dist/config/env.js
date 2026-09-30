import dotenv from 'dotenv';
dotenv.config();
const required = ['MONGODB_URI'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}
export const env = {
    PORT: Number(process.env.PORT) || 4004,
    MONGODB_URI: process.env.MONGODB_URI,
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
};
