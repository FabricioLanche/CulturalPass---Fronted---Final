export const payForEvent = async (eventId: string, userId: string): Promise<{ transactionId: string }> => {
    return new Promise((resolve, reject) => {
        console.log(`Processing payment for event ${eventId} by user ${userId}...`);

        setTimeout(() => {
            // Simulate a 10% chance of failure
            const shouldFail = Math.random() < 0.1;

            if (shouldFail) {
                console.error("Payment failed (simulated)");
                reject(new Error("Payment processing failed. Please try again."));
            } else {
                const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;
                console.log(`Payment successful. Transaction ID: ${transactionId}`);
                resolve({ transactionId });
            }
        }, 1500); // 1.5 seconds delay
    });
};
