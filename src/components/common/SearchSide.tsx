"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon } from '../lib/icons';

const SearchSide = ({ placeholder }: { placeholder: string }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(String(searchParams ?? ""));
        params.set('page', '0');

        if (term) {
            params.set('event', term);
        } else {
            params.delete('event');
        }
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex items-center p-1 w-full max-w-lg mx-auto">
            <input
                aria-label={placeholder}
                className="block w-full rounded-3xl shadow-sm pl-4 pr-12 placeholder:text-[#bdbdbc] placeholder:font-semibold bg-bg-alternative text-black py-2 text-left text-sm"
                name='search'
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('event')?.toString()}
            />

            <SearchIcon className="absolute right-4 h-5 text-background-secondary pointer-events-none" />

        </div>
    );

}


export default SearchSide