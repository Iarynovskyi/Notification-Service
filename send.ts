// const { Kafka, Partitioners } = require('kafkajs');
// const { v4: uuidv4 } = require('uuid');
import { Kafka, Partitioners} from "kafkajs";
import { v4 as uuidv4 } from "uuid";

const kafka = new Kafka({
    clientId: 'test-sender',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
const consumer = kafka.consumer({ groupId: 'test-sender-reply-group' });

const runTest = async () => {
    console.log('Connecting sender components...');
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: 'notification-replies', fromBeginning: false });

    const consumerPromise = consumer.run({
        eachMessage: async ({ message }) => {
            const reply = JSON.parse(message.value.toString());
            console.log(`\n✅ <<< SENDER: Received a reply!`);
            console.log(`     CorrelationId: ${message.key.toString()}`);
            console.log(`     Payload:`, reply);
            await shutdown();
        },
    });

    console.log('Sending CONFIRM_EMAIL request...');
    const correlationId = uuidv4();
    await producer.send({
        topic: 'notification-requests',
        messages: [
            {
                key: correlationId,
                value: JSON.stringify({
                    type: 'CONFIRM_EMAIL',
                    data: {
                        email: 'dimayar20061@gmail.com',
                        userName: 'Дмитро',
                        confirmationLink: 'http://localhost:3000',
                    },
                }),
                headers: {
                    'correlation-id': correlationId,
                    'reply-to': 'notification-replies',
                },
            },
        ],
    });
    console.log(`🚀 >>> SENDER: Request sent. Waiting for reply...`);

    // Чекаємо, поки консьюмер не завершить роботу (або таймаут)
    await Promise.race([
        consumerPromise,
        new Promise(resolve => setTimeout(resolve, 15000)) // Таймаут 15 сек
    ]).then(shutdown);
};

const shutdown = async () => {
    console.log('Shutting down sender...');
    await producer.disconnect();
    await consumer.disconnect();
}

runTest().catch(async (err) => {
    console.error("Test sender failed:", err);
    await shutdown();
});