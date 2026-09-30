import { getRabbitMQChannel } from '../config/rabbitmq.js';
import { Order } from '../models/order.model.js';
import { OrderStatus } from '../types/order.types.js';

export const startOrderSagaConsumer = async () => {
    const channel = getRabbitMQChannel();
    channel.prefetch(10);

    channel.consume('order.saga.queue', async (msg: any) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());
            const { event, orderId, reason } = data;

            console.log(`\n========================================`);
            console.log(`🔄 [Order Saga Consumer] Received Event: ${event} for Order ID: ${orderId}`);

            if (event === 'inventory.failed') {
                // Compensating Transaction: Mark Order CANCELLED due to Out of Stock
                await Order.findByIdAndUpdate(orderId, {
                    status: OrderStatus.CANCELLED,
                });
                console.log(`❌ Order ${orderId} CANCELLED. Reason: ${reason || 'Out of Stock'}`);
            } else if (event === 'payment.failed') {
                // Compensating Transaction: Mark Order CANCELLED due to Payment Failure
                await Order.findByIdAndUpdate(orderId, {
                    status: OrderStatus.CANCELLED,
                });
                console.log(`❌ Order ${orderId} CANCELLED. Reason: ${reason || 'Payment Declined'}`);
            } else if (event === 'payment.succeeded') {
                // Saga Success Path: Mark Order CONFIRMED
                await Order.findByIdAndUpdate(orderId, {
                    status: OrderStatus.CONFIRMED,
                });
                console.log(`✅ Order ${orderId} CONFIRMED! Saga completed successfully.`);
            }

            console.log(`========================================\n`);
            channel.ack(msg);
        } catch (error) {
            console.error('[Order Saga Consumer] Error processing message:', error);
            // channel.nack(msg);
        }
    }, { noAck: false });

    console.log('👷 Order Saga Consumer listening on order.saga.queue...');
};
