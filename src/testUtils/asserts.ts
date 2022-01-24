// deno-lint-ignore-file no-explicit-any
import sinon from "../../deps/sinon.ts";
import { ValidationError } from "../../deps/runtypes.ts";
import { setupRestClientMock } from "./mocks.ts";

const { assert } = sinon;

// Has to use 'any' to express constructor type
export function assertInstance<T extends new (...args: any) => any>(
  value: unknown,
  type: T,
): asserts value is InstanceType<T> {
  if (value instanceof type) {
    return;
  }

  throw new TypeError(`Unexpected type ${typeof value}`);
}

export async function assertInputValidationError(
  apiCall: () => Promise<unknown>,
): Promise<void> {
  const requestMock = setupRestClientMock(undefined);

  try {
    await apiCall();
  } catch (e: unknown) {
    assertInstance(e, ValidationError);
    assert.notCalled(requestMock);
  } finally {
    requestMock.restore();
  }
}
