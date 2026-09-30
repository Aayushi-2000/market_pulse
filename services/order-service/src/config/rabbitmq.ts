import amqp from 'amqplib';

let connection: any = null;
let channel: any = null;

export const connectRabbitMQ = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();

        console.log('🐰 Order Service Connected to RabbitMQ');

        // Assert exchanges
        await channel.assertExchange('order.events', 'topic', { durable: true });
        await channel.assertExchange('product.events', 'topic', { durable: true });
        await channel.assertExchange('payment.events', 'topic', { durable: true });

        // Assert queues for notifications & saga responses
        await channel.assertQueue('notification.queue', { durable: true });
        await channel.bindQueue('notification.queue', 'order.events', 'order.*');

        await channel.assertQueue('order.saga.queue', { durable: true });
        await channel.bindQueue('order.saga.queue', 'product.events', 'inventory.*');
        await channel.bindQueue('order.saga.queue', 'payment.events', 'payment.*');

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

export const getRabbitMQChannel = (): amqp.Channel => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};
