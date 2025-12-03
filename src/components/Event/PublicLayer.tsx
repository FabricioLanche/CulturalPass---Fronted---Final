import { EventCard } from '../common/Cards';
import { EventResponse } from '@src/interfaces/event/EventResponse';
import MiniBanner from '../home/MiniBanner';
import { getNearestConcert, getNearestConference } from '@src/services/event/filters';

export const PublicLayer = async () => {
    //aqui irian los datos fetcheados, pero por implementación se harán con datos estáticos

    let concertNearest: EventResponse[] = [];
    let conferenceNearest: EventResponse[] = [];

    try {
        concertNearest = await getNearestConcert();
    } catch (error) {
        console.error("Failed to load nearest concerts", error);
    }

    try {
        conferenceNearest = await getNearestConference();
    } catch (error) {
        console.error("Failed to load nearest conferences", error);
    }

    return (
        <div className='w-full max-w-7xl mx-auto pt-10'>

            <div className='w-11/12 mx-auto lg:w-full'>
                <MiniBanner />
            </div>

            <div className='text-center text-xl my-10'>
                Descubre lo más reciente en conciertos:
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto mx-auto my-6 pb-4  px-6'>
                {
                    concertNearest.map((event) => (
                        <EventCard key={event.id} data={event as EventResponse} />
                    ))
                }
            </div>
            <div className='text-center text-xl my-10'>
                Descubre lo más reciente en conferencias:
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto mx-auto my-6 pb-4  px-6'>
                {
                    conferenceNearest.map((event) => (
                        <EventCard key={event.id} data={event as EventResponse} />
                    ))
                }
            </div>
        </div>
    )
}
