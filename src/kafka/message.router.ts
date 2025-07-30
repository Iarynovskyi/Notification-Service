import { Message } from 'kafkajs';
import { handlePasswordReset } from "@/handlers/auth/changePassword";
import { handleMarketingEmail } from "@/handlers/marketing/marketing";
import { handleError } from "@/handlers/error/error";
import { handleLoginAlert } from "@/handlers/auth/loginAlert";
import { handleConfirmEmail } from "@/handlers/auth/confirmEmail";
import {logger} from "@/utils/logger";

export const routeMessage = async (message: Message): Promise<void> => {
    try {
        if (!message.value) {
            logger.error("Not value in message")
            return;
        }

        const payload = JSON.parse(message.value.toString());
        const messageType = payload.type;

        switch (messageType) {
            case 'PASSWORD_RESET':
                await handlePasswordReset(payload.data, message);
                break;

            case 'CONFIRM_EMAIL':
                await handleConfirmEmail(payload.data, message);
                break;

            case 'LOGIN_ALERT':
                await handleLoginAlert(payload.data, message);
                break;

            case 'EVENT_REMINDER':
                break;

            case 'TICKET_DELIVERY':
                break;

            case 'MARKETING':
                await handleMarketingEmail(payload.data);
                break;

            default:
                await handleError(payload.data)
                break;
        }
    } catch (error) {
        logger.error('ROUTER: Error processing message', error);
    }
};
