import EventSearchLayer from "@src/components/Event/EventSearchLayer";
import { PublicLayer } from "@src/components/Event/PublicLayer";
import { Suspense } from "react";
import OverviewLoading from "@src/components/skeletons/OverviewLoading";


export default async function HomePage({ searchParams }: {
    searchParams?: Promise<{
        page?: string;
        event?: string;
        size?: string;
    }>
}) {

    const sp = await searchParams;

    const page = sp?.page ? parseInt(sp.page) : 0;
    const event = sp?.event;
    const size = sp?.size ? parseInt(sp.size) : 10;

    if (!event){
        return <PublicLayer />
    }

    return <Suspense fallback={<OverviewLoading />}><EventSearchLayer q={event} page={page} size={size} /></Suspense>
}