import amqp from 'amqplib';
import { env } from './env.js';
let connection = null;
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('🐰 Payment Service Connected to RabbitMQ');
        // Explicitly assert the payment queue
        await channel.assertQueue('payment.queue', { durable: true });
        // The original exchange was asserted by order-service as topic
        // Wait, to avoid race conditions, it's safer to assert it here as well
        await channel.assertExchange('order.events', 'topic', { durable: true });
        // Bind the payment queue to the order.events exchange
        await channel.bindQueue('payment.queue', 'order.events', 'order.*');
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
