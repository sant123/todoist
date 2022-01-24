import { assertEquals } from "../../deps/testing.ts";
import { berryRed, charcoal, getColor, taupe } from "./colors.ts";

Deno.test("getColor", async (t) => {
  const colorTheories = [
    [0, charcoal], // out of range, defaulted
    [30, berryRed],
    [49, taupe],
    [999, charcoal], // out of range, defaulted
  ] as const;

  for (const [id, expected] of colorTheories) {
    await t.step(`id ${id} returns color ${expected.name}`, () => {
      const color = getColor(id);
      assertEquals(color, expected);
    });
  }
});
