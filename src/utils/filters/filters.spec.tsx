import moment = require("moment");

import {
    retrieveParsedKeyValues,
    buildFilterUrlString,
    getFiltersForQuery,
    getCurrentFilters,
    areFiltersActive
} from "./index";
import { StatusFilter, LocationFilter } from "./Filter";
import { GetLocations, GetUsers } from "../../mocks/mock-data";
import { EventDateRange, CreateDateRange } from "./DateRangeFilter";
import { ParsedValuesFromUrl, ValuesForQuery } from "./types";
import { DATEFILTER_DATE_FORMAT } from "../format";

export const buildTestFilters = (parsedItems: ParsedValuesFromUrl = {}) => {
    const statusFilter = new StatusFilter(parsedItems);
    const locationFilter = new LocationFilter(GetLocations.Locations, parsedItems);
    const dateRange = new EventDateRange(parsedItems);
    const createdDateRange = new CreateDateRange(parsedItems);
    return [statusFilter, locationFilter, dateRange, createdDateRange];
};

describe("retrieveParsedKeyValues", () => {
    it("should parse a search string into the parameter filters", () => {
        const parsedFilters = {
            status: ["confirmed", "tentative"],
            created_date_range: ["last24Hr"]
        };
        const stringToParse = `?status=confirmed,tentative&created_date_range=last24Hr`;
        const filters = retrieveParsedKeyValues(stringToParse);
        expect(filters).toMatchObject(parsedFilters);
    });

    it("should parse a search string with date ranges into the parameter filters", () => {
        const startDate = "2019-11-11";
        const endDate = "2020-11-11";
        const parsedFilters = {
            status: ["confirmed", "tentative"],
            created_date_range: [startDate, endDate]
        };
        const stringToParse = `?status=confirmed,tentative&created_date_range=${startDate}%2C${endDate}`;
        const filters = retrieveParsedKeyValues(stringToParse);
        expect(filters).toMatchObject(parsedFilters);
    });
});

describe("buildFilterUrlString", () => {
    it("should call the navigation callback with the correct param", () => {
        const filters = buildTestFilters();
        const currentFilters = {
            status: [
                { value: "confirmed", displayValue: "Confirmed" },
                { value: "tentative", displayValue: "Tentative" }
            ],
            location: [
                {
                    value: GetLocations.Locations[0].id,
                    displayValue: GetLocations.Locations[0].name
                }
            ]
        };
        const url = buildFilterUrlString(currentFilters, filters);

        const stringifiedFilters = `?status=confirmed%2Ctentative&location=${GetLocations.Locations[0].id}`;
        expect(url).toBe(stringifiedFilters);
    });

    it("should remove empty date ranges", () => {
        const filters = buildTestFilters();
        const currentFilters = {
            date_range: [{ value: ["", ""], displayValue: "" }]
        };
        const url = buildFilterUrlString(currentFilters, filters);
        expect(url).toBe("?");
    });

    it("should not remove valid date ranges", () => {
        const filters = buildTestFilters();
        const currentFilters = {
            date_range: [{ value: ["2019-11-11", ""], displayValue: "" }]
        };

        const url = buildFilterUrlString(currentFilters, filters);
        expect(url).toBe("?date_range=2019-11-11%2C");
    });
});

describe("getCurrentFilters", () => {
    it("should return the currently selected filters", () => {
        const parsedItems = {
            status: ["confirmed", "tentative"],
            date_range: ["last30Days"],
            created_date_range: ["2019-11-11", "2020-11-11"]
        };
        const filters = buildTestFilters(parsedItems);

        const currentFilters = getCurrentFilters(filters);
        expect(currentFilters).toMatchObject({
            status: [
                { value: "confirmed", displayValue: "Confirmed" },
                { value: "tentative", displayValue: "Tentative" }
            ],
            date_range: [{ value: "last30Days", displayValue: "Last 30 Days" }],
            created_date_range: [
                {
                    value: ["2019-11-11", "2020-11-11"],
                    displayValue: "2019-11-11 to 2020-11-11"
                }
            ]
        });
    });
    it("should return when there are no selected filters", () => {
        const filters = buildTestFilters({});

        const currentFilters = getCurrentFilters(filters);
        expect(currentFilters).toMatchObject({});
    });
});

describe("getFiltersForQuery", () => {
    it("should return a list of filter keys mapped to their values", () => {
        const parsedItems = {
            status: ["confirmed", "tentative"],
            location: [GetLocations.Locations[0].id]
        };
        const filters = buildTestFilters(parsedItems);
        const filterValues = getFiltersForQuery(filters);
        expect(filterValues).toMatchObject({
            status: ["confirmed", "tentative"],
            location: [GetLocations.Locations[0].id]
        });
    });

    it("builds query request correctly with date ranges", () => {
        const startDate = "2019-11-11";
        const endDate = "2020-11-11";
        const parsedItems = {
            created_date_range: [startDate, endDate],
            date_range: [startDate, endDate]
        };
        const filters = buildTestFilters(parsedItems);
        const filterValues = getFiltersForQuery(filters);

        expect(filterValues).toMatchObject({
            created_from: startDate,
            created_to: endDate,
            date_from: startDate,
            date_to: endDate
        });
    });

    it("builds query request correctly with date presets", () => {
        const createdPreset = "last24Hr";
        const datePreset = "last30Days";
        const parsedItems = {
            created_date_range: [createdPreset],
            date_range: [datePreset]
        };
        const filters = buildTestFilters(parsedItems);
        const filterValues = getFiltersForQuery(filters);

        expect(filterValues).toMatchObject({
            created_from: moment()
                .subtract(1, "day")
                .format(DATEFILTER_DATE_FORMAT),
            created_to: moment().format(DATEFILTER_DATE_FORMAT),
            date_from: moment()
                .subtract(30, "day")
                .format(DATEFILTER_DATE_FORMAT),
            date_to: moment().format(DATEFILTER_DATE_FORMAT)
        });
    });
});

describe("areFiltersActive", () => {
    it("should return true if any filter is actively utilized", () => {
        const pageStateFilters: ValuesForQuery = {
            locations: [],
            status: ["closed"],
            dateRange: []
        };
        expect(areFiltersActive(pageStateFilters)).toBe(true);
    });
    it("should return false if no filters are used", () => {
        const pageStateFilters: ValuesForQuery = {
            status: [],
            locations: [],
            dateRange: []
        };
        expect(areFiltersActive(pageStateFilters)).toBe(false);
    });
    it("should return false if no filters available", () => {
        const pageStateFilters: ValuesForQuery = {
            status: undefined,
            locations: undefined,
            dateRange: undefined
        };
        const pageStateFiltersTwo: ValuesForQuery = {};
        expect(areFiltersActive(pageStateFilters)).toBe(false);
        expect(areFiltersActive(pageStateFiltersTwo)).toBe(false);
    });
});
