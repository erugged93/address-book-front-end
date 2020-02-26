import { UnitType, MeasureType } from "../Graphql";
import {
    getSingleSelectOption,
    unitAbbreviations,
    getUnitSelectOptions,
    unitsForMeasureType
} from "./units";

describe("units", () => {
    it("gets a single select value for a unit", () => {
        for (let unit in UnitType) {
            const unitAsUnitType = unit as UnitType;
            const unitSelectObject = getSingleSelectOption(unitAsUnitType);
            expect(unitSelectObject).toMatchObject({
                value: unitAsUnitType,
                displayValue: unitAbbreviations[unitAsUnitType]
            });
            expect(unitSelectObject.displayValue).not.toBeUndefined();
        }
    });

    it("gets select values based on measurement type", () => {
        for (let measureType in MeasureType) {
            const measureTypeSelects = getUnitSelectOptions(measureType as MeasureType);
            const selectionLength = measureTypeSelects.length;
            expect(selectionLength).not.toBe(0);
            expect(selectionLength).toBe(unitsForMeasureType(measureType as MeasureType).length);
        }
    });
});
