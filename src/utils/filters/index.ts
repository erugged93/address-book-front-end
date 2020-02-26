import { stringify, parse } from "qs";

import {
    SelectedFilterItems,
    CustomDateOption,
    DateRangeKeys,
    ValuesForQuery,
    ParsedValuesFromUrl,
    FilterItem
} from "./types";
import { FilterContext } from "../../contexts/filterContext";
import {
    FilterUpdateRequest,
    FilterRequestType,
    AddFilterRequest,
    RemoveFilterRequest,
    FilterUpdateQueue
} from "./FilterUpdateQueue";
import { isArray } from "util";
import { Filter } from "./Filter";

export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export const DATE_RANGE_KEYS: { [key in DateRangeKeys]: CustomDateOption } = {
    created_date_range: {
        startDateKey: "created_from",
        endDateKey: "created_to"
    },
    date_range: {
        startDateKey: "date_from",
        endDateKey: "date_to"
    }
};

export const retrieveParsedKeyValues = (query: string): ParsedValuesFromUrl => {
    const unParsedFilterString = query.substr(1);
    const parsedItems = parse(unParsedFilterString, { comma: true });
    let parsedItemsInArrays: { [key: string]: string[] } = {};
    if (parsedItems) {
        Object.entries(parsedItems).forEach(([key, value]) => {
            parsedItemsInArrays[key] = Array.isArray(value) ? value : [value];
        });
    }
    return parsedItemsInArrays;
};

export const buildFilterUrlString = (
    currentFilters: SelectedFilterItems,
    filters: FilterContext["filters"]
) => {
    const urlObject = filters.reduce((acc: { [key: string]: string | string[] }, filter) => {
        const newValue = currentFilters[filter.slug];
        if (!newValue || !newValue.length) return acc;
        if (filter.isValidForUrl(newValue)) acc[filter.slug] = filter.getFlattenedValues(newValue);
        return acc;
    }, {});
    return `?${stringify(urlObject, { arrayFormat: "comma" })}`;
};

export const getCurrentFilters = (filters: FilterContext["filters"]) => {
    return filters.reduce((acc: SelectedFilterItems, filter) => {
        if (!filter.value) return acc;
        acc[filter.slug] = filter.value;
        return acc;
    }, {});
};

export const areFiltersActive = (filterValues: ValuesForQuery) => {
    return Object.keys(filterValues).some((filter) => {
        return filterValues[filter] && filterValues[filter]!.length > 0;
    });
};

export const getFiltersForQuery = (filters: FilterContext["filters"]): ValuesForQuery => {
    return filters.reduce((acc: ValuesForQuery, filter) => {
        if (!filter.value) return acc;
        return { ...acc, ...filter.getValueForQuery() };
    }, {});
};

export const toSelectedFilterItems = (
    currentFilters: FilterContext["filters"],
    filterUpdates: ReadonlyArray<FilterUpdateRequest>
) => {
    const updates: SelectedFilterItems = {
        ...getCurrentFilters(currentFilters)
    };

    filterUpdates.forEach((update) => {
        const { type, slug } = update;
        if (type === FilterRequestType.ADD) {
            updates[slug] = (update as AddFilterRequest).newValues;
        } else {
            const valuesToRemove = (update as RemoveFilterRequest).valuesToRemove.map(
                (option) => option.value
            );
            const currentValue = updates[slug] || [];
            updates[slug] = currentValue.filter(({ value }) => !valuesToRemove.includes(value));
        }
    });

    return updates;
};

export const createAddFilterHandler = (filterQueue: FilterUpdateQueue, filter: Filter) => (
    newValues: FilterItem[]
) => {
    return filterQueue.add({
        slug: filter.slug,
        type: FilterRequestType.ADD,
        newValues: filter.isDefaultValue(newValues) ? [] : newValues
    });
};

export const createRemoveFilterHandler = (filterQueue: FilterUpdateQueue) => (
    slug: string,
    valuesToRemove: FilterItem[]
) => {
    return filterQueue.add({
        slug,
        type: FilterRequestType.REMOVE,
        valuesToRemove
    });
};
