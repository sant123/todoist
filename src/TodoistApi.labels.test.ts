import sinon from "../deps/sinon.ts";
import { assertEquals } from "../deps/testing.ts";

import { TodoistApi } from "../mod.ts";

import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_LABEL,
  DEFAULT_REQUEST_ID,
  INVALID_ENTITY_ID,
} from "./testUtils/testDefaults.ts";

import { API_REST_BASE_URI, ENDPOINT_REST_LABELS } from "./consts/endpoints.ts";
import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInputValidationError } from "./testUtils/asserts.ts";

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

const { assert } = sinon;

Deno.test("TodoistApi label endpoints", async (t) => {
  await t.step("getLabel", async (t) => {
    await t.step("calls get request with expected url", async () => {
      const labelId = 12;
      const requestMock = setupRestClientMock(DEFAULT_LABEL);
      const api = getTarget();

      await api.getLabel(labelId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_LABELS}/${labelId}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_LABEL);
      const api = getTarget();

      const label = await api.getLabel(123);

      assertEquals(label, DEFAULT_LABEL);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().getLabel(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("getLabels", async (t) => {
    await t.step("calls get on labels endpoint", async () => {
      const requestMock = setupRestClientMock([DEFAULT_LABEL]);
      const api = getTarget();

      await api.getLabels();

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        ENDPOINT_REST_LABELS,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const labels = [DEFAULT_LABEL];
      const requestMock = setupRestClientMock(labels);
      const api = getTarget();

      const response = await api.getLabels();

      assertEquals(response, labels);
      requestMock.restore();
    });
  });

  await t.step("addLabel", async (t) => {
    const DEFAULT_ADD_LABEL_ARGS = {
      name: "This is a label",
    };

    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const requestMock = setupRestClientMock(DEFAULT_LABEL);
        const api = getTarget();

        await api.addLabel(DEFAULT_ADD_LABEL_ARGS, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          ENDPOINT_REST_LABELS,
          DEFAULT_AUTH_TOKEN,
          DEFAULT_ADD_LABEL_ARGS,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_LABEL);
      const api = getTarget();

      const label = await api.addLabel(DEFAULT_ADD_LABEL_ARGS);

      assertEquals(label, DEFAULT_LABEL);
      requestMock.restore();
    });
  });

  await t.step("updateLabel", async (t) => {
    const DEFAULT_UPDATE_LABEL_ARGS = {
      name: "A new name",
    };

    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const labelId = 123;
        const requestMock = setupRestClientMock(undefined, 204);
        const api = getTarget();

        await api.updateLabel(
          labelId,
          DEFAULT_UPDATE_LABEL_ARGS,
          DEFAULT_REQUEST_ID,
        );

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          `${ENDPOINT_REST_LABELS}/${labelId}`,
          DEFAULT_AUTH_TOKEN,
          DEFAULT_UPDATE_LABEL_ARGS,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.updateLabel(123, DEFAULT_UPDATE_LABEL_ARGS);

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().updateLabel(
            INVALID_ENTITY_ID,
            DEFAULT_UPDATE_LABEL_ARGS,
          ),
      );
    });
  });

  await t.step("deleteLabel", async (t) => {
    await t.step("calls delete on expected label", async () => {
      const labelId = 123;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.deleteLabel(labelId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "DELETE",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_LABELS}/${labelId}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.deleteLabel(123);

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().deleteLabel(INVALID_ENTITY_ID),
      );
    });
  });
});
