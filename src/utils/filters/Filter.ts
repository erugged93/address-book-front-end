import { FilterItem, ParsedValuesFromUrl, ValuesForQuery } from "./types";

export abstract class Filter {
    abstract slug: string;
    abstract name: string;
    abstract isMultiSelect: boolean;
    abstract placeholder: string;
    public defaultFilterItem?: FilterItem;
    public filterOptions: FilterItem[] = [];
    public value?: FilterItem[];

    public mapForValues = (
        dataArray: any[],
        displayValueKeys: string[],
        valueKey: string
    ): FilterItem[] => {
        return dataArray.map((dataItem) => {
            const displayValues = displayValueKeys.map((displayKey) => dataItem[displayKey]);
            return {
                displayValue: displayValues.join(" "),
                value: dataItem[valueKey]
            };
        });
    };

    public getValueForQuery(): ValuesForQuery {
        if (!this.value) return { [this.slug]: undefined };
        const value = this.value.map((val) => {
            return val.value as string;
        });
        return { [this.slug]: value };
    }

    public validateUrlValues(values: string[], options: FilterItem[]) {
        return values.reduce((acc: FilterItem[], value) => {
            const matchingFilter = this.validateValue(options, value);
            if (!!matchingFilter) acc.push(matchingFilter);
            return acc;
        }, []);
    }

    public validateValue(options: FilterItem[], value: string) {
        return options.find((option) => option.value === value);
    }

    public isValidForUrl(newValue: FilterItem[] | undefined) {
        return true;
    }

    public getFlattenedValues(newValue: FilterItem[] | undefined): string[] {
        const values = newValue ? newValue.map((val) => val.value) : [];
        return values.reduce((acc: string[], val) => acc.concat(val), []);
    }

    public isDefaultValue(value: FilterItem[] | undefined) {
        if (!value || !value.length) return false;

        const [val] = value;

        return val && val.value === "";
    }
}

export class StatusFilter extends Filter {
    slug = "status";
    name = "Status";
    isMultiSelect = true;
    placeholder = "Status";
    filterOptions = [
        {
            displayValue: "Confirmed",
            value: "confirmed"
        },
        {
            displayValue: "Tentative",
            value: "tentative"
        },
        {
            displayValue: "Prospect",
            value: "prospect"
        },
        {
            displayValue: "Canceled",
            value: "canceled"
        },
        {
            displayValue: "Closed",
            value: "closed"
        }
    ];

    constructor(allParsedValues: ParsedValuesFromUrl) {
        super();
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}

export class LocationFilter extends Filter {
    slug = "location";
    name = "Location";
    isMultiSelect = true;
    placeholder = "Search by Location";

    constructor(data: any[], allParsedValues: ParsedValuesFromUrl) {
        super();
        this.filterOptions = this.mapForValues(data, ["name"], "id");
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}

export class OwnerFilter extends Filter {
    slug = "owner";
    name = "Owner";
    isMultiSelect = true;
    placeholder = "Search by Owner";

    constructor(data: any[], allParsedValues: ParsedValuesFromUrl) {
        super();
        this.filterOptions = this.mapForValues(data, ["firstName", "lastName"], "id");
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}

export class RoomFilter extends Filter {
    slug = "room";
    name = "Room";
    isMultiSelect = true;
    placeholder = "Search by Room";

    constructor(data: any[], allParsedValues: ParsedValuesFromUrl) {
        super();
        this.filterOptions = this.mapForValues(data, ["name"], "id");
        const values = allParsedValues[this.slug] || [];
        this.value = this.validateUrlValues(values, this.filterOptions);
    }
}
