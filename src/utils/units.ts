import { MeasureType, UnitType } from "../Graphql";

export const getUnitSelectOptions = (measureType: MeasureType) =>
    unitsForMeasureType(measureType).map((value) => {
        return {
            value,
            displayValue: unitAbbreviations[value]
        };
    });

export const getSingleSelectOption = (unitType: UnitType) => {
    return {
        value: unitType,
        displayValue: unitAbbreviations[unitType]
    };
};

type UnitAppreviation = {
    [key in UnitType]: string;
};

export const unitAbbreviations: UnitAppreviation = {
    [UnitType.Ounce]: "oz",
    [UnitType.Pound]: "lb",
    [UnitType.Milligram]: "mg",
    [UnitType.Gram]: "g",
    [UnitType.Kilogram]: "kg",
    [UnitType.Teaspoon]: "tsp",
    [UnitType.Tablespoon]: "tbsp",
    [UnitType.Pint]: "pt",
    [UnitType.Quart]: "qt",
    [UnitType.Gallon]: "gal",
    [UnitType.Milliliter]: "ml",
    [UnitType.Liter]: "L",
    [UnitType.Inch]: "in",
    [UnitType.Foot]: "ft",
    [UnitType.Yard]: "yd",
    [UnitType.Centimeter]: "cm",
    [UnitType.Meter]: "m",
    [UnitType.Count]: "ct",
    [UnitType.FluidOunce]: "fl oz"
};

export function unitsForMeasureType(input: MeasureType): UnitType[] {
    switch (input) {
        case MeasureType.Length:
            return [
                UnitType.Inch,
                UnitType.Foot,
                UnitType.Yard,
                UnitType.Centimeter,
                UnitType.Meter
            ];

        case MeasureType.Volume:
            return [
                UnitType.FluidOunce,
                UnitType.Teaspoon,
                UnitType.Tablespoon,
                UnitType.Pint,
                UnitType.Quart,
                UnitType.Gallon,
                UnitType.Milliliter,
                UnitType.Liter
            ];

        case MeasureType.Weight:
            return [
                UnitType.Ounce,
                UnitType.Pound,
                UnitType.Milligram,
                UnitType.Gram,
                UnitType.Kilogram
            ];

        case MeasureType.Quantity:
            return [UnitType.Count];
    }
}
