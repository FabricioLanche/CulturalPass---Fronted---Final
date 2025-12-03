import { EventSection } from "@src/components/payment/EventSection";
import PaymentSlidesOrq from "@src/components/payment/PaymentSlidesOrq";
import { getEventById } from "@src/services/event/getById";


export default async function EventIndividualPaymentPage({ params }: { params: Promise<{ idEvent: string }> }) {
    const { idEvent } = await params;
    const data = await getEventById(idEvent);
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-background-secondary/85 shadow-2xl shadow-background-secondary/85 p-6 md:p-10 rounded-3xl flex flex-col md:flex-row gap-6">
                    <aside className="w-full md:w-1/3">
                        <EventSection event={data} />
                    </aside>

                    <main className="w-full md:w-2/3 overflow-hidden">
                        <PaymentSlidesOrq idEvent={idEvent} />
                    </main>
                </div>
            </div>
        </div>
    );
}
