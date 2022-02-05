import { urlJoin } from "../deps/url_join.ts";

import { TodoistRequestError } from "./types/errors.ts";

import type {
  HttpClientRequest,
  HttpClientResponse,
  HttpMethod,
} from "./types/http.ts";

import type { PlainObject } from "./types/transformation.ts";
import { randomUUID } from "./utils/randomUuid.ts";

import {
  objectToCamelCase,
  objectToKeyPairString,
  objectToSnakeCase,
} from "./utils/transformation.ts";

const defaultHeaders = {
  "Content-Type": "application/json",
};

function getAuthHeader(apiKey: string) {
  return `Bearer ${apiKey}`;
}

async function getTodoistRequestError(
  error: Error | Response,
): Promise<TodoistRequestError> {
  const message = error instanceof Error ? error.message : error.statusText;
  const requestError = new TodoistRequestError(message);

  if (error instanceof Response) {
    requestError.httpStatusCode = error.status;
    requestError.responseData = await error.text();
  }

  return requestError;
}

function getRequestConfiguration(apiToken?: string, requestId?: string) {
  const authHeader = apiToken
    ? { Authorization: getAuthHeader(apiToken) }
    : undefined;
  const requestIdHeader = requestId ? { "X-Request-Id": requestId } : undefined;
  const headers = { ...defaultHeaders, ...authHeader, ...requestIdHeader };

  return { headers };
}

function getHttpClient<T>(apiToken?: string, requestId?: string) {
  const configuration = getRequestConfiguration(apiToken, requestId);

  return async (
    endpoint: string,
    request: HttpClientRequest,
  ): Promise<HttpClientResponse<T>> => {
    if (request.params) {
      const searchParams = new URLSearchParams(
        objectToKeyPairString(objectToSnakeCase(request.params)),
      );

      endpoint = urlJoin(endpoint, `?${searchParams.toString()}`);
    }

    const response = await fetch(endpoint, {
      ...configuration,
      method: request.method,
      body: request.method === "POST" && request.body
        ? JSON.stringify(objectToSnakeCase(request.body))
        : undefined,
    });

    if (!response.ok) {
      throw response;
    }

    // node-fetch shim has json() as unknown, so needs to be ported to any.
    // deno-lint-ignore no-explicit-any
    let data = await response.json() as any;

    if (Array.isArray(data)) {
      data = data.map(objectToCamelCase);
    } else {
      data = objectToCamelCase(data);
    }

    return { data, status: response.status };
  };
}

export function isSuccess(response: HttpClientResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

// ES Modules cannot be stubbed, so this wrapper solves the issue for Sinon.js
export const _wrapRestClient = {
  request: _request,
};

export function request<T extends unknown>(
  httpMethod: HttpMethod,
  baseUri: string,
  relativePath: string,
  apiToken?: string,
  payload?: PlainObject,
  requestId?: string,
): Promise<HttpClientResponse<T>> {
  return _wrapRestClient.request(
    httpMethod,
    baseUri,
    relativePath,
    apiToken,
    payload,
    requestId,
  );
}

async function _request<T extends unknown>(
  httpMethod: HttpMethod,
  baseUri: string,
  relativePath: string,
  apiToken?: string,
  payload?: PlainObject,
  requestId?: string,
): Promise<HttpClientResponse<T>> {
  try {
    if (httpMethod === "POST" && !requestId) {
      requestId = randomUUID();
    }

    const httpClient = getHttpClient<T>(apiToken, requestId);
    const endpoint = urlJoin(baseUri, relativePath);

    switch (httpMethod) {
      case "GET":
        return await httpClient(endpoint, {
          method: "GET",
          params: payload,
        });
      case "POST":
        return await httpClient(
          endpoint,
          { method: "POST", body: payload },
        );
      case "DELETE":
        return await httpClient(endpoint, { method: "DELETE" });
    }
  } catch (error) {
    if (!(error instanceof Error) && !(error instanceof Response)) {
      throw new Error("An unknown error occurred during the request");
    }

    throw await getTodoistRequestError(error);
  }
}
