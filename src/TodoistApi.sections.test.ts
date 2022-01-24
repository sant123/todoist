import sinon from "../deps/sinon.ts";
import { assertEquals } from "../deps/testing.ts";

import { TodoistApi } from "../mod.ts";

import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_REQUEST_ID,
  DEFAULT_SECTION,
  INVALID_ENTITY_ID,
} from "./testUtils/testDefaults.ts";

import {
  API_REST_BASE_URI,
  ENDPOINT_REST_SECTIONS,
} from "./consts/endpoints.ts";

import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInputValidationError } from "./testUtils/asserts.ts";

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

const { assert } = sinon;

Deno.test("TodoistApi section endpoints", async (t) => {
  await t.step("getSection", async (t) => {
    await t.step("calls get request with expected url", async () => {
      const sectionId = 12;
      const requestMock = setupRestClientMock(DEFAULT_SECTION);
      const api = getTarget();

      await api.getSection(sectionId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_SECTION);
      const api = getTarget();

      const section = await api.getSection(123);

      assertEquals(section, DEFAULT_SECTION);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().getSection(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("getSections", async (t) => {
    await t.step("calls get on sections endpoint", async () => {
      const projectId = 123;
      const requestMock = setupRestClientMock([DEFAULT_SECTION]);
      const api = getTarget();

      await api.getSections(projectId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        ENDPOINT_REST_SECTIONS,
        DEFAULT_AUTH_TOKEN,
        { projectId },
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const sections = [DEFAULT_SECTION];
      const requestMock = setupRestClientMock(sections);
      const api = getTarget();

      const response = await api.getSections();

      assertEquals(response, sections);
      requestMock.restore();
    });
  });

  await t.step("addSection", async (t) => {
    const DEFAULT_ADD_SECTION_ARGS = {
      name: "This is a section",
      projectId: 123,
    };

    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const requestMock = setupRestClientMock(DEFAULT_SECTION);
        const api = getTarget();

        await api.addSection(DEFAULT_ADD_SECTION_ARGS, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          ENDPOINT_REST_SECTIONS,
          DEFAULT_AUTH_TOKEN,
          DEFAULT_ADD_SECTION_ARGS,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_SECTION);
      const api = getTarget();

      const section = await api.addSection(DEFAULT_ADD_SECTION_ARGS);

      assertEquals(section, DEFAULT_SECTION);
      requestMock.restore();
    });
  });

  await t.step("updateSection", async (t) => {
    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const sectionId = 123;
        const updateArgs = { name: "a new name" };
        const requestMock = setupRestClientMock(undefined, 204);
        const api = getTarget();

        await api.updateSection(sectionId, updateArgs, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
          DEFAULT_AUTH_TOKEN,
          updateArgs,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const response = await api.updateSection(123, { name: "a new name" });

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().updateSection(INVALID_ENTITY_ID, {
            name: "a new name",
          }),
      );
    });
  });

  await t.step("deleteSection", async (t) => {
    await t.step("calls delete on expected section", async () => {
      const sectionId = 123;
      const requestMock = setupRestClientMock(true);
      const api = getTarget();

      await api.deleteSection(sectionId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "DELETE",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_SECTIONS}/${sectionId}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const response = await api.deleteSection(123);

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().deleteSection(INVALID_ENTITY_ID),
      );
    });
  });
});
