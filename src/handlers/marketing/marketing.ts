interface MarketingPayload {
    email: string;
    campaign: string;
}

export const handleMarketingEmail = async (payload: MarketingPayload): Promise<void> => {
    console.log(`HANDLER: Sending marketing campaign "${payload.campaign}" to ${payload.email}`);
};