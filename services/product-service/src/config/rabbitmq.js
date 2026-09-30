import amqp from 'amqplib';
let connection = null;
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        console.log('🐰 Product Service Connected to RabbitMQ');
        // Assert product events exchange
        await channel.assertExchange('product.events', 'topic', { durable: true });
        // Assert product queue & bind to product.events
        await channel.assertQueue('product.queue', { durable: true });
        await channel.bindQueue('product.queue', 'product.events', 'product.*');
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
//# sourceMappingURL=rabbitmq.js.map