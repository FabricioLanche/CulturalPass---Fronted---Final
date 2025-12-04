import { getTokenOfInscription } from "@src/services/token/getToken";
import InscriptionInfo from '@src/components/myevents/InscriptionInfo';
import { redirect } from 'next/navigation';

export default async function EventInscriptionPage ({ params }: { params: Promise<{ idEvent: string }> }){
    const { idEvent } = await params;
    
    try {
        const registration = await getTokenOfInscription(idEvent);
        console.log("Registration Token:", registration);
        
        // Validar que los datos existan
        if (!registration) {
            redirect('/myevents');
        }
        
        // Asegurar que los datos sean serializables
        const serializedRegistration = JSON.parse(JSON.stringify(registration));
        
        return (
            <>
                <InscriptionInfo info={serializedRegistration} />
            </>
        );
    } catch (error) {
        console.error("Error loading inscription:", error);
        redirect('/myevents');
    }
}