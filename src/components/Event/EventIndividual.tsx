import { getEventById } from "@src/services/event/getById";
import ResultIndividualPage from './ResultInidividualPage';
import { getIfEnrolled } from "@src/services/user/getIfEnrolled";

export default async function EventIndividualSection({ idEvent }: { idEvent: string }) {
    const dataEvent = await getEventById(idEvent);
    const dataEnrollment = await getIfEnrolled(idEvent);
    console.log("dataEvent", dataEvent);
    console.log("dataEnrollment", dataEnrollment);
    return (
        <>
            <ResultIndividualPage data={dataEvent} dataEnrollment={dataEnrollment} />
        </>
    );
}
