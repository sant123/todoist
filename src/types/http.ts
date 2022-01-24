import { PlainObject } from "./transformation.ts";

export type HttpMethod = "POST" | "GET" | "DELETE";

export type HttpClientRequest = {
  method: HttpMethod;
  params?: PlainObject;
  body?: PlainObject;
};

export type HttpClientResponse<T = unknown> = {
  data: T;
  status: number;
};
