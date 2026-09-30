import { getRabbitMQChannel } from '../config/rabbitmq.js';

export const startNotificationWorker = async () => {
    const channel = getRabbitMQChannel();


    await channel.assertQueue('notification.queue', { durable: true });

    channel.prefetch(10);

    channel.consume('notification.queue', (msg) => {
        if (msg) {
            try {
                const event = JSON.parse(msg.content.toString());

                console.log(`\n========================================`);
                console.log(`📩 New Message on notification.queue`);
                console.log(`Routing Key: ${msg.fields.routingKey}`);
                console.log(`Event Data:`, JSON.stringify(event, null, 2));

                if (event.event === 'order.created') {
                    console.log(`✉️ Sending order confirmation email for Order ID: ${event.orderId} to User ID: ${event.userId}...`);
                }

                console.log(`✔️ Acknowledging message...`);

                channel.ack(msg);
                console.log(`========================================\n`);

            } catch (error) {
                console.error('[Notification Worker] Error processing message:', error);

            }
        }
    }, { noAck: false });

    console.log('👷 Dedicated Notification Worker listening on notification.queue...');
};
