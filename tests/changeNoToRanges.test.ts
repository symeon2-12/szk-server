import changeNoToRanges from "../utils/changeNoToRanges";

describe("changeNoTorange", () => {
  it("No months", () => {
    const result = changeNoToRanges([]);
    expect(result).toEqual("niedostępne");
  });

  it("All months", () => {
    const result = changeNoToRanges([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(result).toEqual("cały rok");
  });

  it("test 3", () => {
    const result = changeNoToRanges([1, 2]);
    expect(result).toEqual("styczeń-luty");
  });

  it("test 4", () => {
    const result = changeNoToRanges([2, 4, 5]);
    expect(result).toEqual("luty,kwiecień-maj");
  });
  it("test 4", () => {
    const result = changeNoToRanges([1, 4, 10, 11, 12]);
    expect(result).toEqual("styczeń,kwiecień,październik-grudzień");
  });
});
