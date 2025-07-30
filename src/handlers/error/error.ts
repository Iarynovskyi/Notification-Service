import { Message } from 'kafkajs';
import { sendReply } from "@/kafka/producer";

export const handleError = async (originalMessage: Message) => {
    const success = false
    await sendReply(originalMessage, {
        success,
        details: 'This router does not exist'
    });
}