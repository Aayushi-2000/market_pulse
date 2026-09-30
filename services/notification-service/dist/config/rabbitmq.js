import amqp from 'amqplib';
let connection = null;
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        console.log('🐰 Notification Service Connected to RabbitMQ');
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
