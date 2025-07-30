import { Message } from "kafkajs";
import { sendEmail } from "@/mail/mailer";
import { sendReply } from "@/kafka/producer";
import { logger } from "@/utils/logger";
import { renderTemplate } from "@/mail/render";

export const handleConfirmEmail = async (payload: any, originalMessage: Message) => {
    const { email, userName, confirmationLink } = payload;
    const htmlBody = await renderTemplate('confirmEmail', {
        userName: userName,
        confirmationLink: confirmationLink,
    });
    if (!htmlBody) {
        await sendReply(originalMessage, { success: false, details: 'Internal server error: failed to render template.' });
        return;
    }
    try {
        const subject = `Event Platform. Confirm email letter`;
        await sendEmail(email, subject, htmlBody);
        await sendReply(originalMessage, { success: true, details: `Email successfully sent to you` });
    } catch (error) {
        logger.error({ err: error }, 'Email handler failed');
        await sendReply(originalMessage, { success: false, details: 'Failed to send email.' });
    }
}
