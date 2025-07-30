import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const kafkaConfig = {
    brokers: ['localhost:9092'],
    clientId: 'notification-service',
    groupId: 'notification-group',
    requestTopic: 'notification-requests',
    replyTopic: 'notification-replies'
};

export const mailerConfig = {
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
};

export const weAreConfig = process.env.WE_ARE;