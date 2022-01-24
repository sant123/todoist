import { assertEquals, assertObjectMatch } from "../deps/testing.ts";
import sinon from "../deps/sinon.ts";

import { isSuccess, request } from "./restClient.ts";
import { TodoistRequestError } from "./types/errors.ts";
import { assertInstance } from "./testUtils/asserts.ts";
import { DEFAULT_REQUEST_ID } from "./testUtils/testDefaults.ts";

import {
  objectToKeyPairString,
  objectToSnakeCase,
} from "./utils/transformation.ts";

import type { HttpClientResponse } from "./types/http.ts";

const DEFAULT_BASE_URI = "https://someapi.com/";
const DEFAULT_ENDPOINT = "endpoint";
const DEFAULT_ENDPOINT_FAIL = "endpoint_fail";
const DEFAULT_AUTH_TOKEN = "AToken";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const AUTHORIZATION_HEADERS = {
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${DEFAULT_AUTH_TOKEN}`,
};

const HEADERS_WITH_REQUEST_ID = {
  ...DEFAULT_HEADERS,
  "X-Request-Id": DEFAULT_REQUEST_ID,
};

const DEFAULT_PAYLOAD = {
  someKey: "someValue",
};

const DEFAULT_RESPONSE = {
  data: DEFAULT_PAYLOAD,
};

const DEFAULT_JSON_RESPONSE = JSON.stringify(DEFAULT_PAYLOAD);
const DEFAULT_ERROR_MESSAGE = "There was an error";

const { assert, match, stub } = sinon;

Deno.test("restClient", async (t) => {
  const stubFetch = stub(globalThis, "fetch");

  stubFetch.callsFake((endpoint) => {
    const isForbidden = endpoint === DEFAULT_BASE_URI + DEFAULT_ENDPOINT_FAIL;

    const status = isForbidden ? 403 : 200;
    const statusText = isForbidden ? "Forbidden" : "OK";
    const body = isForbidden ? DEFAULT_ERROR_MESSAGE : DEFAULT_JSON_RESPONSE;

    return Promise.resolve(new Response(body, { status, statusText }));
  });

  await t.step(
    "request creates fetch client with default headers",
    async () => {
      await request("GET", DEFAULT_BASE_URI, DEFAULT_ENDPOINT);

      assert.calledOnce(stubFetch);
      assert.calledWith(
        stubFetch,
        match.string,
        match({ headers: DEFAULT_HEADERS, method: "GET" }),
      );
    },
  );

  stubFetch.resetHistory();

  await t.step(
    "request adds authorization header to config if token is passed",
    async () => {
      await request(
        "GET",
        DEFAULT_BASE_URI,
        DEFAULT_ENDPOINT,
        DEFAULT_AUTH_TOKEN,
      );

      assert.calledOnce(stubFetch);
      assert.calledWith(
        stubFetch,
        match.string,
        match({ headers: AUTHORIZATION_HEADERS, method: "GET" }),
      );
    },
  );

  stubFetch.resetHistory();

  await t.step(
    "request adds request ID header to config if ID is passed",
    async () => {
      await request(
        "GET",
        DEFAULT_BASE_URI,
        DEFAULT_ENDPOINT,
        undefined,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      assert.calledOnce(stubFetch);
      assert.calledWith(
        stubFetch,
        match.string,
        match({ headers: HEADERS_WITH_REQUEST_ID, method: "GET" }),
      );
    },
  );

  stubFetch.resetHistory();

  await t.step("get calls fetch with expected endpoint", async () => {
    await request(
      "GET",
      DEFAULT_BASE_URI,
      DEFAULT_ENDPOINT,
      DEFAULT_AUTH_TOKEN,
    );

    assert.calledOnce(stubFetch);
    assert.calledWith(
      stubFetch,
      DEFAULT_BASE_URI + DEFAULT_ENDPOINT,
      match({ method: "GET" }),
    );
  });

  stubFetch.resetHistory();

  await t.step("get passes params to fetch", async () => {
    await request(
      "GET",
      DEFAULT_BASE_URI,
      DEFAULT_ENDPOINT,
      DEFAULT_AUTH_TOKEN,
      DEFAULT_PAYLOAD,
    );

    const params = objectToKeyPairString(objectToSnakeCase(DEFAULT_PAYLOAD));

    assert.calledOnce(stubFetch);
    assert.calledWith(
      stubFetch,
      `${DEFAULT_BASE_URI + DEFAULT_ENDPOINT}?${new URLSearchParams(params)}`,
      match({ method: "GET" }),
    );
  });

  stubFetch.resetHistory();

  await t.step("get returns response from fetch", async () => {
    const result = await request(
      "GET",
      DEFAULT_BASE_URI,
      DEFAULT_ENDPOINT,
      DEFAULT_AUTH_TOKEN,
    );

    assert.calledOnce(stubFetch);
    assertObjectMatch(result, DEFAULT_RESPONSE);
  });

  stubFetch.resetHistory();

  await t.step(
    "post sends expected endpoint and payload to fetch",
    async () => {
      await request(
        "POST",
        DEFAULT_BASE_URI,
        DEFAULT_ENDPOINT,
        DEFAULT_AUTH_TOKEN,
        DEFAULT_PAYLOAD,
      );

      assert.calledOnce(stubFetch);
      assert.calledWith(
        stubFetch,
        DEFAULT_BASE_URI + DEFAULT_ENDPOINT,
        match({
          body: JSON.stringify(objectToSnakeCase(DEFAULT_PAYLOAD)),
          method: "POST",
        }),
      );
    },
  );

  stubFetch.resetHistory();

  await t.step("post returns response from fetch", async () => {
    const result = await request(
      "POST",
      DEFAULT_BASE_URI,
      DEFAULT_ENDPOINT,
      DEFAULT_AUTH_TOKEN,
      DEFAULT_PAYLOAD,
    );

    assert.calledOnce(stubFetch);
    assertObjectMatch(result, DEFAULT_RESPONSE);
  });

  stubFetch.resetHistory();

  await t.step(
    "random request ID is created if none provided for POST request",
    async () => {
      const RANDOM_ID = "SomethingRandom";
      const stubUuid = stub(crypto, "randomUUID").returns(RANDOM_ID);

      await request(
        "POST",
        DEFAULT_BASE_URI,
        DEFAULT_ENDPOINT,
        DEFAULT_AUTH_TOKEN,
        DEFAULT_PAYLOAD,
      );

      assert.calledWith(
        stubFetch,
        match.string,
        match({
          headers: { ...AUTHORIZATION_HEADERS, "X-Request-Id": RANDOM_ID },
          method: "POST",
        }),
      );

      stubUuid.restore();
    },
  );

  stubFetch.resetHistory();

  await t.step("delete calls fetch with expected endpoint", async () => {
    await request(
      "DELETE",
      DEFAULT_BASE_URI,
      DEFAULT_ENDPOINT,
      DEFAULT_AUTH_TOKEN,
    );

    assert.calledOnce(stubFetch);
    assert.calledWith(
      stubFetch,
      DEFAULT_BASE_URI + DEFAULT_ENDPOINT,
      match({ method: "DELETE" }),
    );
  });

  stubFetch.resetHistory();

  await t.step(
    "request throws TodoistRequestError on fetch error with expected values",
    async () => {
      try {
        await request(
          "GET",
          DEFAULT_BASE_URI,
          DEFAULT_ENDPOINT_FAIL,
          DEFAULT_AUTH_TOKEN,
        );
      } catch (e: unknown) {
        assertInstance(e, TodoistRequestError);
        assertEquals(e.message, "Forbidden");
        assertEquals(e.httpStatusCode, 403);
        assertEquals(e.responseData, DEFAULT_ERROR_MESSAGE);
      }
    },
  );

  await t.step(
    "TodoistRequestError reports isAuthenticationError for relevant status codes",
    () => {
      const statusCode = 403;

      const requestError = new TodoistRequestError(
        "An Error",
        statusCode,
        undefined,
      );
      assertEquals(requestError.isAuthenticationError(), true);
    },
  );

  const responseStatusTheories = [
    [100, false],
    [200, true],
    [299, true],
    [300, false],
  ] as const;

  for (const [status, expected] of responseStatusTheories) {
    await t.step(`status code ${status} returns isSuccess ${expected}`, () => {
      const response: HttpClientResponse = { data: null, status };
      const success = isSuccess(response);
      assertEquals(success, expected);
    });
  }

  stubFetch.restore();
});
