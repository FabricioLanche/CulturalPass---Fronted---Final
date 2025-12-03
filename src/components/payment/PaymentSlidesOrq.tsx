"use client";

import { CreditCardInfo, PaymentMethod, YapeInfo } from "@src/interfaces/payment/method";
import { PaymentSelection, DataInputs, FinalResult } from "./slides";
import { useState } from "react";
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";


export default function PaymentSlidesOrq({ idEvent }: { idEvent: string }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const {
        register: creditCardRegister,
        handleSubmit: creditCardHandleSubmit,
        formState: { errors: creditCardErrors },
        getValues: creditCardGetValues
    } = useForm<CreditCardInfo>()
    const {
        register: yapeRegister,
        handleSubmit: yapeHandleSubmit,
        formState: { errors: yapeErrors },
        getValues: yapeGetValues
    } = useForm<YapeInfo>()

    const nextSlide = () => setCurrentSlide((prev) => prev + 1);
    const prevSlide = () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
    const slides = [
        <PaymentSelection payment_method={paymentMethod} setPaymentMethod={setPaymentMethod} nextPage={nextSlide} key={0} />,
        <DataInputs selectedMethod={paymentMethod} nextPage={nextSlide} prevPage={prevSlide} creditCardRegister={creditCardRegister} yapeRegister={yapeRegister} key={1} />,
        <FinalResult key={2} idEvent={idEvent} />
    ];
    return (
        <div className="w-full overflow-hidden">
            <motion.ul
                className="w-full flex flex-row"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                animate={{ x: `-${currentSlide * 100}%` }}
                initial={{ x: `-${currentSlide * 100}%` }}
            >
                {slides.map((SlideComponent, index) => {
                    return (
                        <li
                            key={index}
                            className="w-full flex-none basis-full min-w-full will-change-transform"
                        >
                            {SlideComponent}
                        </li>
                    )
                })}
            </motion.ul>
        </div>
    )
}
