import { getFarthest } from "@src/services/event/filters";
import { Suspense } from "react";
import { MiniBannerCard } from '../common/Cards';

export default async function MiniBanner() {
    const farthestEvent = await getFarthest();
    
    return (
        <Suspense fallback={<div>Loading... mini banner</div>}>
            <MiniBannerCard  data={farthestEvent}/>
        </Suspense>
    )
}