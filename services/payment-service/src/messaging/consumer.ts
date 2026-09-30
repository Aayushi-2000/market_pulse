import { getRabbitMQChannel } from '../config/rabbitmq.js';
import { publishPaymentEvent } from './publisher.js';
import { Payment, PaymentStatus } from '../models/payment.model.js';

export const startPaymentWorker = async () => {
    const channel = getRabbitMQChannel();
    channel.prefetch(10);

    channel.consume('payment.queue', async (msg: any) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());

            if (data.event === 'inventory.reserved') {
                console.log(`\n========================================`);
                console.log(`💳 [Payment Worker] Inventory Reserved for Order ID: ${data.orderId}`);
                console.log(`Processing Payment of $${data.totalAmount}...`);

                // Simulate payment authorization (Fail if totalAmount exceeds 1000 for test simulation)
                const isPaymentSuccessful = data.totalAmount <= 1000;

                const payment = new Payment({
                    orderId: data.orderId,
                    userId: data.userId,
                    amount: data.totalAmount,
                    status: isPaymentSuccessful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
                    transactionId: `TXN-${Date.now()}`,
                });

                await payment.save();

                if (isPaymentSuccessful) {
                    console.log(`✅ Payment COMPLETED for Order ID: ${data.orderId}`);
                    publishPaymentEvent('payment.succeeded', {
                        event: 'payment.succeeded',
                        orderId: data.orderId,
                        userId: data.userId,
                        amount: data.totalAmount,
                        transactionId: payment.transactionId,
                    });
                } else {
                    console.error(`❌ Payment FAILED (Amount $${data.totalAmount} exceeds limit) for Order ID: ${data.orderId}`);
                    publishPaymentEvent('payment.failed', {
                        event: 'payment.failed',
                        orderId: data.orderId,
                        items: data.items, // Pass items so product-service can execute compensating stock restoration
                        reason: 'Payment charge failed: Limit exceeded',
                    });
                }

                console.log(`========================================\n`);
            }

            channel.ack(msg);
        } catch (error) {
            console.error('[Payment Worker] Error processing message:', error);
        }
    }, { noAck: false });

    console.log('👷 Payment Worker listening on payment.queue...');
};
