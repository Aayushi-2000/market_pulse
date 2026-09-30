import amqp from 'amqplib';

let connection: any = null;
let channel: any = null;

export const connectRabbitMQ = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();

        console.log('🐰 Payment Service Connected to RabbitMQ');

        // Assert exchanges
        await channel.assertExchange('payment.events', 'topic', { durable: true });
        await channel.assertExchange('product.events', 'topic', { durable: true });

        // Assert payment queue & bind to product.events (inventory.reserved)
        await channel.assertQueue('payment.queue', { durable: true });
        await channel.bindQueue('payment.queue', 'product.events', 'inventory.*');

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

export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};
