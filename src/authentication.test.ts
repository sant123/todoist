import sinon from "../deps/sinon.ts";
import { toString } from "../deps/ramda.ts";
import { assertEquals } from "../deps/testing.ts";

import {
  getAuthorizationUrl,
  getAuthToken,
  type Permission,
  revokeAuthToken,
} from "./authentication.ts";

import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInstance } from "./testUtils/asserts.ts";
import { TodoistRequestError } from "./types/mod.ts";

const { assert } = sinon;

Deno.test("authentication", async (t) => {
  await t.step("getAuthorizationUrl", async (t) => {
    const authUrlTheories = [
      [
        "SomeId",
        "SomeState",
        ["data:read_write"] as Permission[],
        "https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read_write&state=SomeState",
      ],
      [
        "SomeId",
        "SomeState",
        ["data:read", "project:delete"] as Permission[],
        "https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read,project:delete&state=SomeState",
      ],
    ] as const;

    for (const [clientId, state, permissions, expected] of authUrlTheories) {
      await t.step(
        `Formatting ${clientId} with arguments ${state} returns ${
          toString(permissions)
        }`,
        () => {
          const url = getAuthorizationUrl(clientId, permissions, state);
          assertEquals(url, expected);
        },
      );
    }

    await t.step("throws error if no permissions requested", () => {
      try {
        getAuthorizationUrl("SomeId", [], "SomeState");
      } catch (e: unknown) {
        assertInstance(e, Error);
        assertEquals(
          e.message,
          "At least one scope value should be passed for permissions.",
        );
      }
    });
  });

  await t.step("getAuthToken", async (t) => {
    const defaultAuthRequest = {
      clientId: "SomeId",
      clientSecret: "ASecret",
      code: "TheCode",
    };

    const successfulTokenResponse = {
      accessToken: "AToken",
      state: "AState",
    };

    await t.step("calls request with expected values", async () => {
      const requestMock = setupRestClientMock(successfulTokenResponse);

      await getAuthToken(defaultAuthRequest);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        "https://todoist.com/oauth/",
        "access_token",
        undefined,
        defaultAuthRequest,
      );

      requestMock.restore();
    });

    await t.step("returns values from successful request", async () => {
      const requestMock = setupRestClientMock(successfulTokenResponse);

      const tokenResponse = await getAuthToken(defaultAuthRequest);

      assertEquals(tokenResponse, successfulTokenResponse);

      requestMock.restore();
    });

    await t.step("throws error if non 200 response", async () => {
      const failureStatus = 400;
      const requestMock = setupRestClientMock(undefined, failureStatus);

      try {
        await getAuthToken(defaultAuthRequest);
      } catch (e: unknown) {
        assertInstance(e, TodoistRequestError);
        assertEquals(e.message, "Authentication token exchange failed.");
        assertEquals(e.httpStatusCode, failureStatus);
        assertEquals(e.responseData, undefined);
      } finally {
        requestMock.restore();
      }
    });

    await t.step("throws error if token not present in response", async () => {
      const missingTokenResponse = {
        accessToken: undefined,
        state: "AState",
      };

      const requestMock = setupRestClientMock(missingTokenResponse);

      try {
        await getAuthToken(defaultAuthRequest);
      } catch (e: unknown) {
        assertInstance(e, TodoistRequestError);
        assertEquals(e.message, "Authentication token exchange failed.");
        assertEquals(e.responseData, missingTokenResponse);
      } finally {
        requestMock.restore();
      }
    });
  });

  await t.step("revokeAuthToken", async (t) => {
    const revokeTokenRequest = {
      clientId: "SomeId",
      clientSecret: "ASecret",
      accessToken: "AToken",
    };

    await t.step("calls request with expected values", async () => {
      const requestMock = setupRestClientMock(undefined, 200);

      const isSuccess = await revokeAuthToken(revokeTokenRequest);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        "https://api.todoist.com/sync/v8/",
        "access_tokens/revoke",
        undefined,
        revokeTokenRequest,
      );
      assertEquals(isSuccess, true);

      requestMock.restore();
    });
  });
});
