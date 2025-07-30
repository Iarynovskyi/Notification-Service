import { Kafka, Message } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const kafka = new Kafka({ clientId: 'test-sender', brokers: ['localhost:9092'] });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-sender-reply-group' });

const runTest = async () => {
    const testType = process.argv[2]; // Отримуємо тип тесту з командного рядка

    if (!testType) {
        console.error('Please specify test type: "password" or "marketing"');
        process.exit(1);
    }

    // --- Підключаємось ---
    await producer.connect();
    await consumer.connect();

    // --- Готуємось отримувати відповідь (для тесту пароля) ---
    await consumer.subscribe({ topic: 'auth_replies', fromBeginning: false });
    const consumerPromise = consumer.run({
        eachMessage: async ({ message }) => {
            const reply = JSON.parse(message.value.toString());
            console.log(`\n<<< SENDER: Received a reply! CorrelationId: ${message.key.toString()}`);
            console.log('<<< SENDER: Reply payload:', reply);
            // Зупиняємо консьюмера після отримання відповіді
            await consumer.disconnect();
        },
    });

    // --- Відправляємо тестове повідомлення ---
    if (testType === 'password') {
        const correlationId = uuidv4();
        const message: Message = {
            key: correlationId,
            value: JSON.stringify({
                type: 'PASSWORD_RESE',
                data: { email: 'user-to-reset@test.com', resetCode: 'ABC-123' }
            }),
            headers: {
                'correlation-id': correlationId,
                'reply-to': 'auth_replies'
            }
        };
        await producer.send({ topic: 'notification-requests', messages: [message] });
        console.log(`>>> SENDER: Sent 'PASSWORD_RESET' request with correlationId: ${correlationId}`);

        // Чекаємо на відповідь певний час
        await new Promise(resolve => setTimeout(resolve, 5000));

    } else if (testType === 'marketing') {
        const message: Message = {
            value: JSON.stringify({
                type: 'MARKETING_NEWSLETTER',
                data: { email: 'customer@test.com', campaign: 'Summer Sale 2025' }
            })
        };
        await producer.send({ topic: 'notification-requests', messages: [message] });
        console.log(">>> SENDER: Sent 'MARKETING_NEWSLETTER' request (fire and forget).");

    } else {
        console.error(`Unknown test type: ${testType}`);
    }

    await producer.disconnect();
    // Для маркетингу, де ми не чекаємо відповіді, також зупиняємо консьюмера
    if (testType !== 'password') {
        await consumer.disconnect();
    }
};

runTest().catch(console.error);