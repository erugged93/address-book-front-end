import { FilterItem } from "./types";

export enum FilterRequestType {
    REMOVE,
    ADD
}

export type AddFilterRequest = {
    type: FilterRequestType.ADD;
    newValues: FilterItem[];
    slug: string;
};

export type RemoveFilterRequest = {
    type: FilterRequestType.REMOVE;
    valuesToRemove: FilterItem[];
    slug: string;
};

export type FilterUpdateRequest = AddFilterRequest | RemoveFilterRequest;

export class FilterUpdateQueue {
    constructor(
        private filterQueue: FilterUpdateRequest[],
        private setFilterQueue: React.Dispatch<React.SetStateAction<FilterUpdateRequest[]>>,
        private prevFilterQueue?: FilterUpdateRequest[]
    ) {}

    public add(request: FilterUpdateRequest) {
        this.setFilterQueue([...this.filterQueue, request]);
    }

    public getPendingUpdates() {
        return [...this.filterQueue];
    }

    public getPreviouslyQueuedUpdates() {
        return this.prevFilterQueue && [...this.prevFilterQueue];
    }

    public size() {
        return this.filterQueue.length;
    }
}
