import amqp from 'amqplib';
import { env } from './env.js';
let connection = null;
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('🐰 Scraper Service Connected to RabbitMQ');
        // Assert the exchange for product events
        await channel.assertExchange('product.events', 'topic', { durable: true });
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error', err);
        });
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
        });
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        process.exit(1);
    }
};
export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};
