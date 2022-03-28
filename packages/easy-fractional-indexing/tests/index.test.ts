import { generateNKeysBetween } from "fractional-indexing";
import { append, moveDown, moveUp, prepend } from "../src";

describe("functions", () => {
  test("with no existing indices", () => {
    expect(moveDown([], "a0")).toBe("a0");
    expect(moveDown()).toBe("a0");
    expect(moveUp()).toBe("a0");
    expect(prepend()).toBe("a0");
    expect(append()).toBe("a0");
  });

  test("with some existing indices", () => {
    const indexes = generateNKeysBetween(null, null, 4);
    expect(moveDown(indexes, "a1")).toBe("a2V");
    expect(moveUp(indexes, "a1")).toBe("Zz");
    expect(prepend(indexes)).toBe("Zz");
    expect(append(indexes)).toBe("a4");
  });
});
