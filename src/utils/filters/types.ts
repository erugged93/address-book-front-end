export interface SelectedFilterItems {
    [key: string]: FilterItem[];
}

export type ParsedValuesFromUrl = { [key: string]: string[] };

export type ValuesForQuery = { [key: string]: string | string[] | undefined };

export enum DateRangeKeys {
    created_date_range = "created_date_range",
    date_range = "date_range"
}

export interface CustomDateOption {
    startDateKey: string;
    endDateKey: string;
}

export interface FilterOption {
    placeholder: string;
    filterDisplay: string;
    filterCategory: string;
    filterItems: FilterItem[];
    isMultiSelect: boolean;
    hasCustomDateOption?: boolean;
}

export interface FilterItem {
    value: string | string[];
    displayValue: string;
}

export interface DateFilterItem {
    value: DatePreset | string[];
    displayValue: string;
}

export enum DatePreset {
    last24Hr = "last24Hr",
    last7Days = "last7Days",
    last14Days = "last14Days",
    last30Days = "last30Days",
    last6Mo = "last6Mo",
    next7Days = "next7Days",
    next14Days = "next14Days",
    next30Days = "next30Days",
    allFuture = "allFuture",
    customDate = "customDate"
}
