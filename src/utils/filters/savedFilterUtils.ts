import { Filter } from "./Filter";
import { getCurrentFilters } from "./index";
import { SelectedFilterItems } from "./types";
import { FilterContext } from "contexts/filterContext";

export type FilterFormatForSaving = { [key: string]: Array<string | string[]> };

export const formatFilterForSaving = (filters: FilterContext["filters"]): FilterFormatForSaving => {
    const currentFilters = getCurrentFilters(filters);
    return Object.keys(currentFilters).reduce((acc: FilterFormatForSaving, filterKey) => {
        acc[filterKey] = currentFilters[filterKey].map((values) => values.value);
        return acc;
    }, {});
};

export const formatSavedFilterForFiltering = (
    savedFilters: FilterFormatForSaving
): SelectedFilterItems => {
    return Object.keys(savedFilters).reduce((acc: SelectedFilterItems, filterKey) => {
        acc[filterKey] = savedFilters[filterKey].map((value) => {
            return { value, displayValue: "" };
        });
        return acc;
    }, {});
};
