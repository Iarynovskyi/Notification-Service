import { sendReply } from "@/kafka/producer";
import { Message } from 'kafkajs';

interface PasswordResetPayload {
    email: string;
    resetCode: string;
}

export const handlePasswordReset = async (payload: PasswordResetPayload, originalMessage: Message): Promise<void> => {
    const correlationId = originalMessage.headers?.['correlation-id']?.toString();
    const replyTo = originalMessage.headers?.['reply-to']?.toString();

    if (correlationId && replyTo) {
        await sendReply(originalMessage, { success: true, details: 'Password reset email sent.' })
    }
};
