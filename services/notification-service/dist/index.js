import dotenv from 'dotenv';
dotenv.config();
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startNotificationWorker } from './services/notification.service.js';
const startMicroservice = async () => {
    console.log('Starting Notification Microservice...');
    await connectRabbitMQ();
    await startNotificationWorker();
    process.on('SIGINT', () => {
        console.log('Shutting down gracefully...');
        process.exit(0);
    });
};
startMicroservice().catch(error => {
    console.error('Fatal error during startup:', error);
    process.exit(1);
});
