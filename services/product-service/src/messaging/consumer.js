import { getRabbitMQChannel } from '../config/rabbitmq.js';
import { Product } from '../models/product.model.js';
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};
export const startProductWorker = async () => {
    const channel = getRabbitMQChannel();
    channel.prefetch(10);
    channel.consume('product.queue', async (msg) => {
        if (!msg)
            return;
        try {
            const data = JSON.parse(msg.content.toString());
            if (data.event === 'product.scraped') {
                console.log(`\n========================================`);
                console.log(`📦 Received Product Event: product.scraped`);
                console.log(`Title: ${data.title} | Category: ${data.category}`);
                const slug = generateSlug(data.title || `product-${data.externalId}`);
                // Upsert product into MongoDB database
                const updatedProduct = await Product.findOneAndUpdate({ slug }, {
                    name: data.title,
                    slug,
                    description: data.description || 'No description provided',
                    price: data.price || 0,
                    category: data.category || 'General',
                    brand: 'External Store',
                    images: data.imageUrl ? [data.imageUrl] : [],
                    stock: 50, // default stock for scraped items
                    isActive: true,
                }, { upsert: true, new: true, setDefaultsOnInsert: true });
                console.log(`✅ Upserted product into DB (ID: ${updatedProduct._id})`);
                console.log(`========================================\n`);
            }
            channel.ack(msg);
        }
        catch (error) {
            console.error('[Product Worker] Error processing message:', error);
            // channel.nack(msg);
        }
    }, { noAck: false });
    console.log('👷 Product Worker listening on product.queue...');
};
//# sourceMappingURL=consumer.js.map