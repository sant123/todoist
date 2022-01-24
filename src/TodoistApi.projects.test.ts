import sinon from "../deps/sinon.ts";
import { assertEquals } from "../deps/testing.ts";

import { TodoistApi } from "../mod.ts";

import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_PROJECT,
  DEFAULT_REQUEST_ID,
  DEFAULT_USER,
  INVALID_ENTITY_ID,
} from "./testUtils/testDefaults.ts";

import {
  API_REST_BASE_URI,
  ENDPOINT_REST_PROJECT_COLLABORATORS,
  ENDPOINT_REST_PROJECTS,
} from "./consts/endpoints.ts";

import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInputValidationError } from "./testUtils/asserts.ts";

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

const { assert } = sinon;

Deno.test("TodoistApi project endpoints", async (t) => {
  await t.step("getProject", async (t) => {
    await t.step("calls get request with expected url", async () => {
      const projectId = 12;
      const requestMock = setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      await api.getProject(projectId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_PROJECTS}/${projectId}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      const project = await api.getProject(123);

      assertEquals(project, DEFAULT_PROJECT);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().getProject(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("getProjects", async (t) => {
    await t.step("calls get on projects endpoint", async () => {
      const requestMock = setupRestClientMock([DEFAULT_PROJECT]);
      const api = getTarget();

      await api.getProjects();

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        ENDPOINT_REST_PROJECTS,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const projects = [DEFAULT_PROJECT];
      const requestMock = setupRestClientMock(projects);
      const api = getTarget();

      const response = await api.getProjects();

      assertEquals(response, projects);
      requestMock.restore();
    });
  });

  await t.step("addProject", async (t) => {
    const DEFAULT_ADD_PROJECT_ARGS = {
      name: "This is a project",
    };

    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const requestMock = setupRestClientMock(DEFAULT_PROJECT);
        const api = getTarget();

        await api.addProject(DEFAULT_ADD_PROJECT_ARGS, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          ENDPOINT_REST_PROJECTS,
          DEFAULT_AUTH_TOKEN,
          DEFAULT_ADD_PROJECT_ARGS,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      const project = await api.addProject(DEFAULT_ADD_PROJECT_ARGS);

      assertEquals(project, DEFAULT_PROJECT);
      requestMock.restore();
    });
  });

  await t.step("updateProject", async (t) => {
    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const projectId = 123;
        const updateArgs = { name: "a new name" };
        const requestMock = setupRestClientMock(undefined, 204);
        const api = getTarget();

        await api.updateProject(projectId, updateArgs, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          `${ENDPOINT_REST_PROJECTS}/${projectId}`,
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

      const result = await api.updateProject(123, { name: "a name" });

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().updateProject(INVALID_ENTITY_ID, {
            name: "a name",
          }),
      );
    });
  });

  await t.step("deleteProject", async (t) => {
    await t.step("calls delete on expected project", async () => {
      const projectId = 123;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.deleteProject(projectId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "DELETE",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_PROJECTS}/${projectId}`,
        DEFAULT_AUTH_TOKEN,
        { requestId: DEFAULT_REQUEST_ID },
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.deleteProject(123);

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().deleteProject(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("getProjectCollaborators", async (t) => {
    const projectId = 123;
    const users = [DEFAULT_USER];

    await t.step("calls get on expected endpoint", async () => {
      const requestMock = setupRestClientMock(users);
      const api = getTarget();

      await api.getProjectCollaborators(projectId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_PROJECTS}/${projectId}/${ENDPOINT_REST_PROJECT_COLLABORATORS}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(users);
      const api = getTarget();

      const returnedUsers = await api.getProjectCollaborators(projectId);

      assertEquals(returnedUsers, users);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().getProjectCollaborators(INVALID_ENTITY_ID),
      );
    });
  });
});
