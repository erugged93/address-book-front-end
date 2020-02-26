import { formatFilterForSaving, formatSavedFilterForFiltering } from "./savedFilterUtils";
import { StatusFilter, LocationFilter } from "./Filter";
import { GetLocations } from "../../mocks/mock-data";
import { CreateDateRange } from "./DateRangeFilter";

describe("formatFilterForSaving", () => {
    it("formats filter for saving to database", () => {
        const statusFilter = new StatusFilter({ status: ["confirmed", "tentative"] });
        const locationFilter = new LocationFilter(GetLocations.Locations, {
            location: [GetLocations.Locations[0].id]
        });
        const filters = [statusFilter, locationFilter];
        const formattedFilters = formatFilterForSaving(filters);
        expect(formattedFilters).toEqual({
            location: [GetLocations.Locations[0].id],
            status: ["confirmed", "tentative"]
        });
    });

    it("formats filter with date preset for saving to database", () => {
        const statusFilter = new StatusFilter({ status: ["confirmed", "tentative"] });
        const createdDateFilter = new CreateDateRange({
            created_date_range: ["last24Hr"]
        });
        const filters = [statusFilter, createdDateFilter];
        const formattedFilters = formatFilterForSaving(filters);
        expect(formattedFilters).toEqual({
            created_date_range: ["last24Hr"],
            status: ["confirmed", "tentative"]
        });
    });

    it("formats filter with date range for saving to database", () => {
        const statusFilter = new StatusFilter({ status: ["confirmed", "tentative"] });
        const createdDateFilter = new CreateDateRange({
            created_date_range: ["2019-11-11", "2020-11-11"]
        });
        const filters = [statusFilter, createdDateFilter];
        const formattedFilters = formatFilterForSaving(filters);
        expect(formattedFilters).toEqual({
            created_date_range: [["2019-11-11", "2020-11-11"]],
            status: ["confirmed", "tentative"]
        });
    });
});

describe("formatSavedFilterForFiltering", () => {
    it("formats filter from database", () => {
        const filters = { created_date_range: ["last24Hr"], status: ["confirmed", "tentative"] };

        const formattedFilters = formatSavedFilterForFiltering(filters);
        expect(formattedFilters).toEqual({
            status: [
                { value: "confirmed", displayValue: "" },
                { value: "tentative", displayValue: "" }
            ],
            created_date_range: [{ value: "last24Hr", displayValue: "" }]
        });
    });
});
