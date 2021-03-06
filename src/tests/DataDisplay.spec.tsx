import { formatLongNumber } from "../DataDisplay";

const testCases: {[key: string]: string} = {
  "1": "1",
  "12": "12",
  "123": "123",
  "1234": "1,234",
  "12345": "12,345",
  "123456": "123,456",
  "1234567": "1,234,567",
  "12345678": "12,345,678",
  "123456789": "123,456,789",
  "1234567890": "1,234,567,890",
};

describe("formatLongNumber", () => {
  it("returns the correct output for the input", () => {
    for (const num in testCases) {
      expect(formatLongNumber("any-key", num)).toEqual(testCases[num]);
    }
  });
});
