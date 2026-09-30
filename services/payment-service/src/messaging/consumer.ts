import { getRabbitMQChannel } from '../config/rabbitmq.js';
import { Payment, PaymentStatus } from '../models/payment.model.js';
import crypto from 'crypto';

export const startPaymentWorker = async () => {
    const channel = getRabbitMQChannel();
    
    // Control load using prefetch
    channel.prefetch(5); 

    channel.consume('payment.queue', async (msg: any) => {
        if (!msg) return;

        try {
            const eventData = JSON.parse(msg.content.toString());

            // Only process order created events
            if (eventData.event === 'order.created') {
                console.log(`\n========================================`);
                console.log(`💳 Processing payment for Order ID: ${eventData.orderId}`);
                
                // 1. Create a Payment record in our database
                const existingPayment = await Payment.findOne({ orderId: eventData.orderId });
                if (existingPayment) {
                     console.log(`Payment already initialized for ${eventData.orderId}. Skipping duplicate.`);
                     channel.ack(msg);
                     return;
                }

                const payment = await Payment.create({
                    orderId: eventData.orderId,
                    userId: eventData.userId,
                    amount: eventData.totalAmount,
                    status: PaymentStatus.PENDING,
                });

                // 2. Simulate communicating with Stripe/PayPal (2 second delay)
                console.log(`📡 Contacting payment gateway...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 3. Update database record with mock transaction result
                payment.status = PaymentStatus.COMPLETED;
                payment.transactionId = `txn_${crypto.randomBytes(8).toString('hex')}`;
                await payment.save();

                console.log(`✅ Payment successful! Transaction: ${payment.transactionId}`);
                console.log(`========================================\n`);

                // Wait: In a real system, we'd now publish a 'payment.completed' event back to RabbitMQ
                // So the Order Service knows to mark the order as "CONFIRMED".
                // channel.publish('order.events', 'payment.completed', Buffer.from(JSON.stringify({ ... })));

            }

            // Explicitly acknowledge processed message so it isn't requeued
            channel.ack(msg);
        } catch (error) {
            console.error('[Payment Worker] Error processing payment:', error);
            // channel.nack(msg); // NACK if we want to requeue on failure
        }
    }, { noAck: false }); 

    console.log('👷 Payment Worker listening on payment.queue...');
};
