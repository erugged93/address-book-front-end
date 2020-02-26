import moment, { Moment } from "moment";

import { Filter } from "./Filter";
import {
    FilterItem,
    DateRangeKeys,
    ParsedValuesFromUrl,
    ValuesForQuery,
    CustomDateOption,
    DatePreset,
    DateFilterItem
} from "./types";
import { DATEFILTER_DATE_FORMAT } from "../format";
import { isArray } from "util";

export const CUSTOM_DATE_OPTION = { displayValue: "Custom Date", value: DatePreset.customDate };

export const DATE_RANGE_KEYS: { [key: string]: CustomDateOption } = {
    created_date_range: {
        startDateKey: "created_from",
        endDateKey: "created_to"
    },
    date_range: {
        startDateKey: "date_from",
        endDateKey: "date_to"
    }
};

export const getCustomDateText = (startDisplayValue: string, endDisplayValue: string) => {
    if (!startDisplayValue && !endDisplayValue) return "";
    if (startDisplayValue && endDisplayValue) return `${startDisplayValue} to ${endDisplayValue}`;
    if (startDisplayValue) return `From ${startDisplayValue}`;
    return `To ${endDisplayValue}`;
};

export abstract class DateRangeFilter extends Filter {
    abstract slug: DateRangeKeys;
    public filterOptions: DateFilterItem[] = [];

    public validateUrlValues(values: string[], options: FilterItem[]): FilterItem[] {
        const isPreset = values.length === 1;
        const isRange = values.length === 2;

        if (isPreset) {
            const preset = options.find((option) => option.value === values[0]);
            return preset ? [preset] : [];
        } else if (isRange) {
            return [
                {
                    value: values,
                    displayValue: getCustomDateText(values[0] || "", values[1] || "")
                }
            ];
        }
        return [];
    }

    public getValueForQuery(): ValuesForQuery {
        if (!this.value) return { [this.slug]: undefined };
        const convertedFilters: { [key: string]: string } = {};
        this.value.forEach((val) => {
            const isRange =
                val.value.length === 2 &&
                (moment(val.value[0]).isValid() || moment(val.value[1]).isValid());
            const { startDateKey, endDateKey } = DATE_RANGE_KEYS[this.slug];

            if (isRange) {
                convertedFilters[startDateKey] = val.value[0];
                convertedFilters[endDateKey] = val.value[1];
            } else {
                const dateFilters = this.getDateValue(
                    val.value as string,
                    startDateKey,
                    endDateKey
                );
                if (dateFilters) {
                    convertedFilters[startDateKey] = dateFilters[startDateKey];
                    convertedFilters[endDateKey] = dateFilters[endDateKey];
                }
            }
        });
        return convertedFilters;
    }

    private getDateValue(filterValues: string, earlyDateKey: string, laterDateKey: string) {
        const datePresetKey = filterValues;
        const dateFormatFunction =
            filterDateCalculations[datePresetKey as Exclude<DatePreset, DatePreset.customDate>];
        if (!dateFormatFunction) return;
        const [earlyDate, laterDate] = dateFormatFunction(moment());

        return {
            [earlyDateKey]: earlyDate ? earlyDate.format(DATEFILTER_DATE_FORMAT) : "",
            [laterDateKey]: laterDate ? laterDate.format(DATEFILTER_DATE_FORMAT) : ""
        };
    }

    public isValidForUrl(newValue: FilterItem[] | undefined) {
        if (
            newValue &&
            newValue[0] &&
            Array.isArray(newValue[0].value) &&
            newValue[0].value.every((value) => value === "")
        ) {
            return false;
        }
        return true;
    }

    public isDefaultValue(value: FilterItem[] | undefined) {
        if (!value || !value.length) return false;

        const val = value[0].value;

        return val === "" || (isArray(val) && val[0] === "" && val[1] === "");
    }
}

export const filterDateCalculations: {
    [key in Exclude<DatePreset, DatePreset.customDate>]: (
        today: Moment
    ) => [Moment | undefined, Moment | undefined];
} = {
    last24Hr: (today: Moment) => {
        return [moment(today).subtract(1, "day"), today];
    },
    last7Days: (today: Moment) => {
        return [moment(today).subtract(7, "day"), today];
    },
    last14Days: (today: Moment) => {
        return [moment(today).subtract(14, "day"), today];
    },
    last30Days: (today: Moment) => {
        return [moment(today).subtract(30, "day"), today];
    },
    last6Mo: (today: Moment) => {
        return [moment(today).subtract(6, "months"), today];
    },
    next7Days: (today: Moment) => {
        return [today, moment(today).add(7, "days")];
    },
    next14Days: (today: Moment) => {
        return [today, moment(today).add(14, "days")];
    },
    next30Days: (today: Moment) => {
        return [today, moment(today).add(30, "days")];
    },
    allFuture: (today: Moment) => {
        return [today, undefined];
    }
};

export class CreateDateRange extends DateRangeFilter {
    slug = DateRangeKeys.created_date_range;
    name = "Created Date";
    isMultiSelect = false;
    placeholder = "Created Date (Any)";
    defaultFilterItem = {
        displayValue: "Any",
        value: "" as DatePreset
    };

    filterOptions = [
        this.defaultFilterItem,
        {
            displayValue: "Last 24 Hours",
            value: DatePreset.last24Hr
        },
        {
            displayValue: "Last 7 Days",
            value: DatePreset.last7Days
        },
        {
            displayValue: "Last 14 Days",
            value: DatePreset.last14Days
        },
        {
            displayValue: "Last 30 Days",
            value: DatePreset.last30Days
        },
        {
            displayValue: "Last 6 Months",
            value: DatePreset.last6Mo
        },
        CUSTOM_DATE_OPTION
    ];

    constructor(allParsedValues: ParsedValuesFromUrl) {
        super();
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}

export class EventDateRange extends DateRangeFilter {
    slug = DateRangeKeys.date_range;
    name = "Event Date";
    isMultiSelect = false;
    placeholder = "Event Date (Any)";
    defaultFilterItem = {
        displayValue: "Any",
        value: "" as DatePreset
    };
    filterOptions = [
        this.defaultFilterItem,
        {
            displayValue: "Last 30 Days",
            value: DatePreset.last30Days
        },
        {
            displayValue: "Last 6 Months",
            value: DatePreset.last6Mo
        },
        {
            displayValue: "Next 7 Days",
            value: DatePreset.next7Days
        },
        {
            displayValue: "Next 14 Days",
            value: DatePreset.next14Days
        },
        {
            displayValue: "Next 30 Days",
            value: DatePreset.next30Days
        },
        {
            displayValue: "All Future",
            value: DatePreset.allFuture
        },
        CUSTOM_DATE_OPTION
    ];

    constructor(allParsedValues: ParsedValuesFromUrl) {
        super();
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}

export class ReservationDateRange extends DateRangeFilter {
    slug = DateRangeKeys.date_range;
    name = "Reservation Date";
    isMultiSelect = false;
    placeholder = "Reservation Date (Any)";
    defaultFilterItem = {
        displayValue: "Any",
        value: "" as DatePreset
    };
    filterOptions = [
        this.defaultFilterItem,
        {
            displayValue: "Last 30 Days",
            value: DatePreset.last30Days
        },
        {
            displayValue: "Last 6 Months",
            value: DatePreset.last6Mo
        },
        {
            displayValue: "Next 7 Days",
            value: DatePreset.next7Days
        },
        {
            displayValue: "Next 14 Days",
            value: DatePreset.next14Days
        },
        {
            displayValue: "Next 30 Days",
            value: DatePreset.next30Days
        },
        {
            displayValue: "All Future",
            value: DatePreset.allFuture
        },
        CUSTOM_DATE_OPTION
    ];

    constructor(allParsedValues: ParsedValuesFromUrl) {
        super();
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}
