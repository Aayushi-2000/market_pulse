import axios from 'axios';
import { publishProductEvent } from '../messaging/publisher.js';
export const syncScrapedProducts = async () => {
    console.log('🔍 Starting Product Scraping Job...');
    try {
        // Fetch products from fake store API (or simulated scraping target)
        const response = await axios.get('https://fakestoreapi.com/products');
        const products = response.data;
        console.log(`📦 Fetched ${products.length} products. Publishing to RabbitMQ...`);
        let publishedCount = 0;
        for (const product of products) {
            publishProductEvent('product.scraped', {
                event: 'product.scraped',
                externalId: String(product.id),
                title: product.title,
                price: product.price,
                description: product.description,
                category: product.category,
                imageUrl: product.image,
                timestamp: new Date().toISOString(),
            });
            publishedCount++;
        }
        console.log(`✅ Successfully published ${publishedCount} product.scraped events!`);
        return { success: true, count: publishedCount };
    }
    catch (error) {
        console.error('❌ Error during product scraping job:', error?.message || error);
        throw error;
    }
};
