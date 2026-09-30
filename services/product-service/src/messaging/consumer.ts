import { getRabbitMQChannel } from '../config/rabbitmq.js';
import { publishProductEvent } from './publisher.js';
import { Product } from '../models/product.model.js';

const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const startProductWorker = async () => {
    const channel = getRabbitMQChannel();
    channel.prefetch(10);

    // 1. Listen for scraped product items
    channel.consume('product.queue', async (msg: any) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());

            if (data.event === 'product.scraped') {
                console.log(`\n========================================`);
                console.log(`📦 Received Product Event: product.scraped`);
                console.log(`Title: ${data.title} | Category: ${data.category}`);

                const slug = generateSlug(data.title || `product-${data.externalId}`);

                const updatedProduct = await Product.findOneAndUpdate(
                    { slug },
                    {
                        name: data.title,
                        slug,
                        description: data.description || 'No description provided',
                        price: data.price || 0,
                        category: data.category || 'General',
                        brand: 'External Store',
                        images: data.imageUrl ? [data.imageUrl] : [],
                        stock: 50, // default stock for scraped items
                        isActive: true,
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );

                console.log(`✅ Upserted product into DB (ID: ${updatedProduct._id})`);
                console.log(`========================================\n`);
            }

            channel.ack(msg);
        } catch (error) {
            console.error('[Product Worker] Error processing scraped product:', error);
        }
    }, { noAck: false });

    // 2. Listen for Saga events (order.created & payment.failed rollback)
    channel.consume('product.saga.queue', async (msg: any) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());
            const { event, orderId, items } = data;

            if (event === 'order.created') {
                console.log(`\n========================================`);
                console.log(`🔄 [Saga Inventory Check] Received order.created for Order ID: ${orderId}`);

                let allStockAvailable = true;

                // Check stock for each item in the order
                if (items && Array.isArray(items)) {
                    for (const item of items) {
                        const product = await Product.findById(item.productId);
                        if (!product || product.stock < item.quantity) {
                            allStockAvailable = false;
                            console.warn(`⚠️ Insufficient stock for product: ${item.name} (Required: ${item.quantity}, Available: ${product?.stock || 0})`);
                            break;
                        }
                    }

                    if (allStockAvailable) {
                        // Reserve stock in MongoDB
                        for (const item of items) {
                            await Product.findByIdAndUpdate(item.productId, {
                                $inc: { stock: -item.quantity }
                            });
                        }

                        console.log(`✅ Inventory Reserved for Order ID: ${orderId}`);
                        publishProductEvent('inventory.reserved', {
                            event: 'inventory.reserved',
                            orderId,
                            userId: data.userId,
                            totalAmount: data.totalAmount,
                            items,
                        });
                    } else {
                        console.error(`❌ Inventory Check Failed for Order ID: ${orderId}`);
                        publishProductEvent('inventory.failed', {
                            event: 'inventory.failed',
                            orderId,
                            reason: 'Insufficient stock in inventory',
                        });
                    }
                }
                console.log(`========================================\n`);
            } else if (event === 'payment.failed') {
                // COMPENSATING TRANSACTION: Restore deducted stock to MongoDB!
                console.log(`\n========================================`);
                console.log(`🔄 [Saga Compensating Rollback] Payment Failed for Order ID: ${orderId}. Restoring stock...`);

                if (items && Array.isArray(items)) {
                    for (const item of items) {
                        await Product.findByIdAndUpdate(item.productId, {
                            $inc: { stock: item.quantity }
                        });
                        console.log(`♻️ Restored ${item.quantity} units of ${item.name} to MongoDB stock.`);
                    }
                }
                console.log(`========================================\n`);
            }

            channel.ack(msg);
        } catch (error) {
            console.error('[Product Saga Worker] Error processing message:', error);
        }
    }, { noAck: false });

    console.log('👷 Product Workers listening on product.queue and product.saga.queue...');
};
