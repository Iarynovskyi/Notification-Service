import { logger } from "@/utils/logger.js";
import nodemailer from "nodemailer"
import { weAreConfig, mailerConfig } from "@/config"

const transporter = nodemailer.createTransport(mailerConfig);

export const sendEmail = async (to: string, subject: string, html: any) => {
    try {
        await transporter.sendMail({
            from: `"${weAreConfig} <${mailerConfig.auth.user}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        logger.error({ err: error }, 'Failed to send email');
        throw error;
    }
};
