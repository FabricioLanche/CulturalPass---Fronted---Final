export type PaymentMethod = "credit_card" | "yape"  | undefined;


export interface CreditCardInfo {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
    holderName: string;
}


export interface YapeInfo {
    phoneNumber: string;
    otpCode: string;
}