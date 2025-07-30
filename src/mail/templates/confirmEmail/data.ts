interface ConfirmEmailData {
    userName: string;
    confirmationLink: string;
}

export const prepareData = (data: ConfirmEmailData) => {
    return  {
        userName: data.userName,
        confirmationLink: data.confirmationLink
    }
}