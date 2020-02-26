import {
    buildTime,
    formatTime,
    formatDate,
    formatAddress,
    AddressWithLocale,
    formatPrice,
    formatCamelCaseToSpace
} from "../utils/format";

type ArgumentType<T> = T extends (...args: infer U) => any ? U : never;

describe("format", () => {
    describe("buildTime", () => {
        type BuildTimeInput = ArgumentType<typeof buildTime>[0];

        const createReservation = (input: Partial<BuildTimeInput> = {}) => ({
            allDay: false,
            startTime: "13:00",
            endTime: "14:00",
            timezone: "EST",
            ...input
        });

        it(`should return ALL DAY - EST`, () => {
            const timezone = "EST";
            const reservation = createReservation({ allDay: true, timezone });
            const result = buildTime(reservation);

            expect(result).toBe(`ALL DAY - ${timezone}`);
        });

        it("should return an empty string if there is no end time", () => {
            const reservation = createReservation();
            delete reservation.endTime;
            const result = buildTime(reservation);

            expect(result).toBe("");
        });

        it("should set the start time to midnight if the start time is undefined", () => {
            const midnight = "00:00";
            const endTime = "15:00";
            const timezone = "EST";
            const reservation = createReservation({ endTime, timezone });
            delete reservation.startTime;
            const result = buildTime(reservation);

            const expectedStartTime = formatTime(midnight);
            const expectedEndTime = formatTime(endTime);

            expect(result).toBe(`${expectedStartTime} - ${expectedEndTime} ${timezone}`);
        });

        it("should format the reservation time", () => {
            const timezone = "EST";
            const startTime = "13:00";
            const endTime = "15:00";
            const reservation = createReservation({ startTime, endTime, timezone });
            const result = buildTime(reservation);

            const expectedStartTime = formatTime(startTime);
            const expectedEndTime = formatTime(endTime);

            expect(result).toBe(`${expectedStartTime} - ${expectedEndTime} ${timezone}`);
        });
    });

    describe("formatAddress", () => {
        const getAddress = (address?: Partial<AddressWithLocale>) => ({
            ...address,
            city: "Atlanta",
            addressFulltext: "Fulltext address",
            line1: "123 Test",
            line2: "Apt. 123",
            state: "GA",
            zipcode: "12345",
            localePreset: "us"
        });

        it("should return the fulltext address if the locale preset is not 'us' ", () => {
            const address = getAddress();
            address.localePreset = "de";
            const result = formatAddress(address);

            expect(result).toBe(address.addressFulltext);
        });

        it("should not use the fulltext address if the locale preset is 'us' ", () => {
            const address = getAddress();
            const { line1, line2, city, state, zipcode } = address;
            const expectedResult = `${line1}\n${line2}\n${city}, ${state} ${zipcode}`;
            const result = formatAddress(address);

            expect(result).toBe(expectedResult);
        });

        it("should format the address if fields are missing", () => {
            const address = getAddress();
            delete address.line1;
            delete address.state;

            const { line2, city, zipcode } = address;
            const expectedResult = `${line2}\n${city} ${zipcode}`;
            const result = formatAddress(address);

            expect(result).toBe(expectedResult);
        });
    });

    describe("formatDate", () => {
        const EXPECTED_DATE = "Nov. 1, 2020";
        const EXPECTED_DATE_RANGE = "Nov. 1 - Nov 18, 2020";

        it(`should return ${EXPECTED_DATE}`, () => {
            const result = formatDate("2020-11-01");

            expect(result).toBe(EXPECTED_DATE);
        });

        it(`should return ${EXPECTED_DATE} if start date and end date are the same`, () => {
            const result = formatDate("2020-11-01", "2020-11-01");

            expect(result).toBe(EXPECTED_DATE);
        });

        it(`should return ${EXPECTED_DATE_RANGE}`, () => {
            const result = formatDate("2020-11-01", "2020-11-18");

            expect(result).toBe(EXPECTED_DATE_RANGE);
        });
    });

    describe("formatPrice", () => {
        it("formats an integer to price", () => {
            const storedPrice = 600;
            expect(formatPrice(storedPrice)).toEqual("$6.00");
        });

        it("formats an integer to price with thousands", () => {
            const storedPrice = 2379234;
            expect(formatPrice(storedPrice)).toEqual("$23,792.34");
        });

        it("formats a decimal to price", () => {
            const storedPrice = 123.45;
            expect(formatPrice(storedPrice, false)).toEqual("$123.45");
        });
    });

    describe("formatCamelCaseToSpace", () => {
        it("formats per person camelcase to spaces", () => {
            const serviceType = "PerPerson";
            expect(formatCamelCaseToSpace(serviceType)).toEqual("Per Person");
        });

        it("formats a la carte camelcase to spaces", () => {
            const serviceType = "ALaCarte";
            expect(formatCamelCaseToSpace(serviceType)).toEqual("A La Carte");
        });
    });
});
