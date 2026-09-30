import amqp from 'amqplib';
let connection = null;
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        console.log('🐰 RabbitMQ Connected Successfully');
        // Define the exchange, queue, and binding
        await channel.assertExchange('order.events', 'topic', { durable: true });
        await channel.assertQueue('notification.queue', { durable: true });
        // Bind the queue with a routing key pattern
        await channel.bindQueue('notification.queue', 'order.events', 'order.*');
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
