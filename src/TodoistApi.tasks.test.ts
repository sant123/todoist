import sinon from "../deps/sinon.ts";
import { assertEquals } from "../deps/testing.ts";

import { _wrapTaskConverters } from "./utils/taskConverters.ts";
import { TodoistApi } from "../mod.ts";
import type { Task } from "./types/mod.ts";

import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_QUICK_ADD_RESPONSE,
  DEFAULT_REQUEST_ID,
  DEFAULT_TASK,
  INVALID_ENTITY_ID,
} from "./testUtils/testDefaults.ts";

import {
  API_REST_BASE_URI,
  API_SYNC_BASE_URI,
  ENDPOINT_REST_TASK_CLOSE,
  ENDPOINT_REST_TASK_REOPEN,
  ENDPOINT_REST_TASKS,
  ENDPOINT_SYNC_QUICK_ADD,
} from "./consts/endpoints.ts";

import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInputValidationError } from "./testUtils/asserts.ts";

function setupSyncTaskConverter(returnedTask: Task) {
  return sinon.stub(_wrapTaskConverters, "getTaskFromQuickAddResponse")
    .returns(returnedTask);
}

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

const { assert } = sinon;

Deno.test("TodoistApi task endpoints", async (t) => {
  await t.step("addTask", async (t) => {
    const DEFAULT_ADD_TASK_ARGS = {
      content: "This is a task",
    };

    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const requestMock = setupRestClientMock(DEFAULT_TASK);
        const api = getTarget();

        await api.addTask(DEFAULT_ADD_TASK_ARGS, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          ENDPOINT_REST_TASKS,
          DEFAULT_AUTH_TOKEN,
          DEFAULT_ADD_TASK_ARGS,
          DEFAULT_REQUEST_ID,
        );

        requestMock.restore();
      },
    );

    await t.step("returns result from rest client", async () => {
      const requestMock = setupRestClientMock(DEFAULT_TASK);
      const api = getTarget();

      const task = await api.addTask(DEFAULT_ADD_TASK_ARGS);

      assertEquals(task, DEFAULT_TASK);
      requestMock.restore();
    });
  });

  await t.step("updateTask", async (t) => {
    await t.step(
      "calls post on restClient with expected parameters",
      async () => {
        const taskId = 123;
        const updateArgs = { content: "some new content" };
        const requestMock = setupRestClientMock(undefined, 204);
        const api = getTarget();

        await api.updateTask(taskId, updateArgs, DEFAULT_REQUEST_ID);

        assert.calledOnce(requestMock);
        assert.calledWith(
          requestMock,
          "POST",
          API_REST_BASE_URI,
          `${ENDPOINT_REST_TASKS}/${taskId}`,
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

      const response = await api.updateTask(123, { content: "some content" });

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().updateTask(INVALID_ENTITY_ID, {
            content: "some content",
          }),
      );
    });
  });

  await t.step("closeTask", async (t) => {
    await t.step("calls post on close endpoint", async () => {
      const taskId = 123;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.closeTask(taskId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_CLOSE}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const response = await api.closeTask(123);

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().closeTask(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("reopenTask", async (t) => {
    await t.step("calls post on reopen endpoint", async () => {
      const taskId = 123;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.reopenTask(taskId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_REOPEN}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const response = await api.reopenTask(123);

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().reopenTask(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("deleteTask", async (t) => {
    await t.step("calls delete on expected task", async () => {
      const taskId = 123;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.deleteTask(taskId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "DELETE",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_TASKS}/${taskId}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const response = await api.deleteTask(123);

      assertEquals(response, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().deleteTask(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("quickAddTask", async (t) => {
    const DEFAULT_QUICK_ADD_ARGS = {
      text: "This is a quick add text",
      note: "This is a note",
      reminder: "tomorrow 5pm",
      autoReminder: true,
    };

    await t.step("calls sync endpoint with expected parameters", async () => {
      const requestMock = setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE);
      const api = getTarget();

      await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        API_SYNC_BASE_URI,
        ENDPOINT_SYNC_QUICK_ADD,
        DEFAULT_AUTH_TOKEN,
        DEFAULT_QUICK_ADD_ARGS,
      );

      requestMock.restore();
    });

    await t.step(
      "calls task converter with response data and returns result",
      async () => {
        const requestMock = setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE);
        const taskConverter = setupSyncTaskConverter(DEFAULT_TASK);
        const api = getTarget();

        const task = await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS);

        assert.calledOnce(taskConverter);
        assert.calledWith(taskConverter, DEFAULT_QUICK_ADD_RESPONSE);
        assertEquals(task, DEFAULT_TASK);

        requestMock.restore();
        taskConverter.restore();
      },
    );
  });

  await t.step("getTask", async (t) => {
    await t.step("calls get request with expected url", async () => {
      const taskId = 12;
      const requestMock = setupRestClientMock(DEFAULT_TASK);
      const api = getTarget();

      await api.getTask(taskId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_TASKS}/${taskId}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().getTask(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("getTasks", async (t) => {
    const DEFAULT_GET_TASKS_ARGS = {
      projectId: 123,
    };

    await t.step("calls get on expected endpoint with args", async () => {
      const requestMock = setupRestClientMock([DEFAULT_TASK]);
      const api = getTarget();

      await api.getTasks(DEFAULT_GET_TASKS_ARGS);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        ENDPOINT_REST_TASKS,
        DEFAULT_AUTH_TOKEN,
        DEFAULT_GET_TASKS_ARGS,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const tasks = [DEFAULT_TASK];
      const requestMock = setupRestClientMock(tasks);
      const api = getTarget();

      const response = await api.getTasks(DEFAULT_GET_TASKS_ARGS);

      assertEquals(response, tasks);
      requestMock.restore();
    });
  });
});
