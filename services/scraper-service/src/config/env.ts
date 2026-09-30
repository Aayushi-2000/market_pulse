import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: Number(process.env.PORT) || 4005,
    RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
};
