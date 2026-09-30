import amqp, { Connection, Channel } from 'amqplib';

let connection: any = null;
let channel: any = null;

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();

        console.log('🐰 Notification Service Connected to RabbitMQ');

        connection.on('error', (err: any) => {
            console.error('RabbitMQ connection error', err);
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        process.exit(1);
    }
};

export const getRabbitMQChannel = (): Channel => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};
