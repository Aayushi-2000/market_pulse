import { getRabbitMQChannel } from '../config/rabbitmq.js';

export const publishEvent = (routingKey: string, data: any) => {
    const channel = getRabbitMQChannel();
    const payload = Buffer.from(JSON.stringify(data));
    
    channel.publish('order.events', routingKey, payload);
    console.log(`[x] Sent to ${routingKey}:`, data);
};
