import moment from "moment";
import { PackableType } from "../Graphql";

export const RESERVATION_DATE_FORMAT = "YYYY-MM-DD";
export const DATEFILTER_DATE_FORMAT = "YYYY-MM-DD";
export const SHORT_RESERVATION_DATE_FORMAT = "MMM. D, YYYY";
export const DATE_PLACEHOLDER = "mm/dd/yy";

export const formatDate = (startDate: string, endDate?: string) => {
    if (!endDate || startDate === endDate) {
        return moment(startDate).format(SHORT_RESERVATION_DATE_FORMAT);
    }

    return formatDateRange([startDate, endDate]);
};

const formatDateRange = ([startDate, endDate]: [string, string]) => {
    const startDateFormatted = moment(startDate).format("MMM. D");
    const endDateFormatted = moment(endDate).format("MMM D, YYYY");

    return startDateFormatted + " - " + endDateFormatted;
};

export const formatTime = (time: string) => {
    return moment(time, "HH:mm").format("h:mma");
};

export const formatDateForDb = (date: Date | string) => {
    return moment(date).format(RESERVATION_DATE_FORMAT);
};

export const formatTimeForDb = (time: Date | string) => {
    return moment(time).format("HH:mm");
};

export const formatPackableType = (type: PackableType) => {
    if (type === PackableType.NonFood) return "Non-Food";
    return type.toString();
};

export const buildTime = (reservation: {
    allDay?: boolean | undefined | null;
    startTime: string;
    endTime: string;
    timezone: string;
}) => {
    // TODO: update timezone format - APP-4499
    const { allDay, startTime, endTime, timezone } = reservation;
    if (allDay) {
        return `ALL DAY - ${timezone}`;
    } else if (!endTime) {
        return "";
    } else {
        const midnight = "00:00";
        return `${formatTime(startTime || midnight)} - ${formatTime(endTime)} ${timezone}`;
    }
};

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

export interface AddressWithLocale {
    city: string;
    addressFulltext: string;
    line1: string;
    line2: string;
    state: string;
    zipcode: string;
    localePreset: string;
}

export const formatAddress = ({
    city,
    addressFulltext,
    line1,
    line2,
    state,
    zipcode,
    localePreset
}: Nullable<Partial<AddressWithLocale>>) => {
    if (localePreset !== "us") return addressFulltext || "";

    let address = "";

    if (line1) address += `${line1}\n`;
    if (line2) address += `${line2}\n`;
    if (city) address += city;
    if (city && state) address += ", ";
    if (state) address += state;
    if ((state && zipcode) || (city && !state)) address += " ";
    if (zipcode) address += zipcode;

    return address;
};

export const formatPrice = (price: number, priceInCents = true) => {
    const dollarAmount = priceInCents ? price / 100 : price;
    const formattedPrice = `$${(dollarAmount || 0).toFixed(2)}`;
    const priceWithThousandsSeparators = `${formattedPrice.replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    return priceWithThousandsSeparators;
};

export const formatCamelCaseToSpace = (camelCaseString: string, lowerCase = false) => {
    const stringWithSpaces = camelCaseString
        .replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
    return lowerCase ? stringWithSpaces.toLowerCase() : stringWithSpaces;
};
