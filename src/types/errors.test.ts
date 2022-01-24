import { assertEquals } from "../../deps/testing.ts";
import { TodoistRequestError } from "./errors.ts";

Deno.test("errors", async (t) => {
  const isAuthenticationErrorTheories = [
    [undefined, false],
    [200, false],
    [401, true],
    [403, true],
    [500, false],
  ] as const;

  for (
    const [statusCode, isAuthenticationError] of isAuthenticationErrorTheories
  ) {
    await t.step(
      `TodoistRequestError for status code ${statusCode} reports isAuthenticationError = ${isAuthenticationError}`,
      () => {
        const requestError = new TodoistRequestError(
          "An Error",
          statusCode,
          undefined,
        );
        assertEquals(
          requestError.isAuthenticationError(),
          isAuthenticationError,
        );
      },
    );
  }

  await t.step(`TodoistRequestError name equals 'TodoistRequestError'`, () => {
    const requestError = new TodoistRequestError("An Error");
    assertEquals(requestError.name, "TodoistRequestError");
  });
});
