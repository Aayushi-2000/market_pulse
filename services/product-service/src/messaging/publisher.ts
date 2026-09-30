import { getRabbitMQChannel } from '../config/rabbitmq.js';

export const publishProductEvent = (routingKey: string, payload: object) => {
    try {
        const channel = getRabbitMQChannel();
        const exchange = 'product.events';

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
        });

        console.log(`📤 [Product Publisher] Published event '${routingKey}' to exchange '${exchange}'`);
    } catch (error) {
        console.error('[Product Publisher] Error publishing event:', error);
    }
};
