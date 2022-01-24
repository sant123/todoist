import sinon from "../../deps/sinon.ts";
import { _wrapRestClient } from "../restClient.ts";

export function setupRestClientMock(
  responseData: unknown,
  status = 200,
) {
  const response = { status, data: responseData };
  return sinon.stub(_wrapRestClient, "request").resolves(response);
}
