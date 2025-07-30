import { producer, connectProducer } from './index';
import { Message } from 'kafkajs';

export const sendReply = async (originalMessage: Message, replyPayload: object): Promise<void> => {
    const correlationId = originalMessage.headers?.['correlation-id']?.toString();
    const replyTo = originalMessage.headers?.['reply-to']?.toString();

    if (!correlationId || !replyTo) {
        return;
    }

    await connectProducer();
    await producer.send({
        topic: replyTo,
        messages: [{
            key: correlationId,
            value: JSON.stringify(replyPayload),
            headers: { 'correlation-id': correlationId }
        }]
    });
};
