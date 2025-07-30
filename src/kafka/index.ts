import { Kafka } from "kafkajs";
import { logger } from "@/utils/logger";
import { kafkaConfig } from "@/config"

const kafka = new Kafka({
    clientId: kafkaConfig.clientId,
    brokers: kafkaConfig.brokers
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });

let isProducerConnected = false;
let isConsumerConnected = false;

export const connectProducer = async () => {
    if (isProducerConnected) return;
    try {
        await producer.connect();
        isProducerConnected = true;
        logger.info('Producer connected successfully.');
    } catch (error) {
        logger.error({ err: error }, 'Failed to connect producer');
        throw error;
    }
};

export const connectConsumer = async () => {
    if (isConsumerConnected) return;
    try {
        await consumer.connect();
        isConsumerConnected = true;
        logger.info('Consumer connected successfully.');
    } catch (error) {
        logger.error({ err: error }, 'Failed to connect consumer');
        throw error;
    }
};

export const disconnect = async () => {
    if (isProducerConnected) await producer.disconnect();
    if (isConsumerConnected) await consumer.disconnect();
    logger.info('Kafka client disconnected.');
};
