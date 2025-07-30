import {logger} from "./utils/logger";
import {kafkaConfig} from "./config";
import { connectConsumer, disconnect, consumer} from "./kafka";
import { routeMessage } from "./kafka/message.router";

const startService = async () => {
    logger.info('Starting Notification Service...');
    await connectConsumer();
    await consumer.subscribe({ topic: kafkaConfig.requestTopic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ message }) => {
            await routeMessage(message);
        },
    });
};

startService().catch((err) => {
    logger.fatal({ err }, 'Service failed to start');
    process.exit(1);
});

const gracefulShutdown = async () => {
    logger.info('Gracefully shutting down...');
    await disconnect();
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
