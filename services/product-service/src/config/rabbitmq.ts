import amqp from 'amqplib';

let connection: any = null;
let channel: any = null;

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();

        console.log('🐰 Product Service Connected to RabbitMQ');

        // Assert exchanges
        await channel.assertExchange('product.events', 'topic', { durable: true });
        await channel.assertExchange('order.events', 'topic', { durable: true });
        await channel.assertExchange('payment.events', 'topic', { durable: true });

        // Assert queues & bindings
        await channel.assertQueue('product.queue', { durable: true });
        await channel.bindQueue('product.queue', 'product.events', 'product.*');

        await channel.assertQueue('product.saga.queue', { durable: true });
        await channel.bindQueue('product.saga.queue', 'order.events', 'order.created');
        await channel.bindQueue('product.saga.queue', 'payment.events', 'payment.failed');

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
