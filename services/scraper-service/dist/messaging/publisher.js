import { getRabbitMQChannel } from '../config/rabbitmq.js';
export const publishProductEvent = (routingKey, data) => {
    const channel = getRabbitMQChannel();
    const payload = Buffer.from(JSON.stringify(data));
    channel.publish('product.events', routingKey, payload);
    console.log(`[Scraper Publisher] 📡 Sent to ${routingKey}:`, data.title || data.id || 'Product event');
};
