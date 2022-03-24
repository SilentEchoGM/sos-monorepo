import { generateNKeysBetween } from "fractional-indexing";
import { moveUp, moveDown } from "../src";

describe("functions", () => {
  test("with no existing indices", () => {
    expect(moveDown([], "a0")).toBe("a0");
    expect(moveDown()).toBe("a0");
    expect(moveUp()).toBe("a0");
  });

  test("with some existing indices", () => {
    const indexes = generateNKeysBetween(null, null, 4);
    expect(moveDown(indexes, "a1")).toBe("a2V");
    expect(moveUp(indexes, "a1")).toBe("Zz");
  });
});
