"use client";
import { PaymentMethod } from "@src/interfaces/payment/method";


const paymentOptions = [
    {
        method: "credit_card" as PaymentMethod,
        label: "Tarjeta de Crédito/Débito",
        description: "Paga con tu tarjeta de crédito o débito de forma segura.",
        url_img: "https://www.citypng.com/public/uploads/preview/black-credit-cards-payment-icon-transparent-png-701751695036490lko5ncwol9.png?v=2025082013"
    },
    {
        method: "yape" as PaymentMethod,
        label: "Yape",
        description: "Paga fácilmente usando Yape desde tu celular.",
        url_img: "https://play-lh.googleusercontent.com/y5S3ZIz-ohg3FirlISnk3ca2yQ6cd825OpA0YK9qklc5W8MLSe0NEIEqoV-pZDvO0A8=s256-rw"
    }
]

export default function PaymentSelection ({payment_method, setPaymentMethod, nextPage} : {payment_method: PaymentMethod, setPaymentMethod: (method: PaymentMethod) => void, nextPage: () => void}) {

    const handleSelection = (method: PaymentMethod) => {
        setPaymentMethod(method);
    }

    return (
        <div className="w-full">
            
            <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Selecciona un método de pago</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentOptions.map((option) => (
                        <div
                            key={option.method}
                            className={`border-2 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow border-none ${payment_method === option.method ? 'bg-background-little-2/70' : ''}`}
                            onClick={() => handleSelection(option.method)}
                        >
                           { /* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={option.url_img} alt={option.label} className="w-12 h-12 mb-2 rounded-sm" />
                            <h3 className="text-lg font-semibold">{option.label}</h3>
                            <p className="text-sm text-white">{option.description}</p>
                        </div>
                    ))}

                    <div className="col-span-1 md:col-span-2">
                        <button
                            className={`border-background border w-full py-3 px-6 rounded-2xl  font-bold ${payment_method ? 'text-white bg-background-secondary/80 hover:bg-background-secondary/70 cursor-pointer' : 'bg-gray-400 cursor-not-allowed text-black'} transition-all duration-100`}
                            onClick={nextPage}
                            disabled={!payment_method}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>


        </div>
    );
}