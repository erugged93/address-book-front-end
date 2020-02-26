import debounce from "lodash/debounce";
import { navigate, RouteComponentProps } from "@reach/router";
import { SelectedFilterItems } from "../utils/filters/types";
import { Filter } from "../utils/filters/Filter";
import { buildFilterUrlString, toSelectedFilterItems } from "../utils/filters";
import { useState, useEffect } from "react";
import { FilterUpdateRequest, FilterUpdateQueue } from "../utils/filters/FilterUpdateQueue";

const debouncedFilterNavigate = debounce((url: string, emptyQueue: () => void) => {
    navigate(url);
    emptyQueue();
}, 500);

const requestFilterUpdate = (
    selectedItem: SelectedFilterItems,
    currentFilters: Filter[],
    emptyQueue: () => void
) => {
    const url = buildFilterUrlString(selectedItem, currentFilters);
    return debouncedFilterNavigate(url, emptyQueue);
};

export function useFilterQueue(
    currentFilters: Filter[],
    location: RouteComponentProps["location"]
) {
    const { pathname } = location || {};
    const [filterQueue, setFilterQueue] = useState<FilterUpdateRequest[]>([]);
    const [prevFilterQueue, setPrevFilterQueue] = useState<typeof filterQueue>();
    const emptyQueue = () => setFilterQueue([]);

    useEffect(() => {
        if (filterQueue.length) {
            setPrevFilterQueue(filterQueue);
            const updates = toSelectedFilterItems(currentFilters, filterQueue);
            requestFilterUpdate(updates, currentFilters, emptyQueue);
        }
    }, [filterQueue]);

    useEffect(() => {
        debouncedFilterNavigate.cancel();
    }, [pathname]);

    useEffect(() => {
        setPrevFilterQueue([]);
    }, [currentFilters]);

    return new FilterUpdateQueue(filterQueue, setFilterQueue, prevFilterQueue);
}
