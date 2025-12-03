import { findByTermPaginated } from "@src/services/event/search";
import ResultEvent from "./ResultEvent";

export default async function EventSearchLayer({ q, page, size }: {q: string, page?: number, size?: number}) {
    
    const data = await findByTermPaginated(q, page || 0, size || 10);

    return <ResultEvent event={data} />

}