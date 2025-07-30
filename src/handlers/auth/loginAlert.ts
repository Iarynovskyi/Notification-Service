import { Message } from "kafkajs";
import { sendEmail } from "@/mail/mailer";
import { sendReply } from "@/kafka/producer";
import { logger } from "@/utils/logger";

export const handleLoginAlert = async (payload: any, originalMessage: Message) => {
    const { email, name, confirmationLink } = payload;
    const subject = `Вітаємо, ${name}! Підтвердіть ваш email`;
    const htmlBody = `<h1>Привіт, ${name}!</h1><p>Дякуємо за реєстрацію. Будь ласка, перейдіть за <a href="${confirmationLink}">цим посиланням</a>, щоб підтвердити ваш акаунт.</p>`;

    try {
        await sendEmail(email, subject, htmlBody);
        await sendReply(originalMessage, { success: true, details: `Email successfully sent to ${email}` });
    } catch (error) {
        logger.error({ err: error }, 'Email handler failed');
        await sendReply(originalMessage, { success: false, details: 'Failed to send email.' });
    }
};
