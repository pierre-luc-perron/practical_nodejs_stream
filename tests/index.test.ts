import foo from "../src/index";

describe("foo", () => {
  let spy: any;

  beforeEach(() => {
    spy = jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("makes a single call to console.log", () => {
    expect(spy).not.toHaveBeenCalled();
    foo();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('prints "bar"', () => {
    foo();
    expect(spy).toBeCalledWith("bar");
  });
});
