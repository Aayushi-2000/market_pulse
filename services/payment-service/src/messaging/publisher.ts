import { getRabbitMQChannel } from '../config/rabbitmq.js';

export const publishPaymentEvent = (routingKey: string, payload: object) => {
    try {
        const channel = getRabbitMQChannel();
        const exchange = 'payment.events';

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
        });

        console.log(`📤 [Payment Publisher] Published event '${routingKey}' to exchange '${exchange}'`);
    } catch (error) {
        console.error('[Payment Publisher] Error publishing event:', error);
    }
};
