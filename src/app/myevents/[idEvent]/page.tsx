import { getTokenOfInscription } from "@src/services/token/getToken";
import InscriptionInfo from '@src/components/myevents/InscriptionInfo';

export default async function EventInscriptionPage ({ params }: { params: Promise<{ idEvent: string }> }){
    const { idEvent } = await params;
    const registration = await getTokenOfInscription(idEvent);
    console.log("Registration Token:", registration);
    return (
        <>
            <InscriptionInfo info={registration} />
        </>
    );
}