import sinon from "../deps/sinon.ts";
import { assertEquals } from "../deps/testing.ts";

import { TodoistApi } from "../mod.ts";

import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_COMMENT,
  DEFAULT_REQUEST_ID,
  INVALID_ENTITY_ID,
} from "./testUtils/testDefaults.ts";

import {
  API_REST_BASE_URI,
  ENDPOINT_REST_COMMENTS,
} from "./consts/endpoints.ts";

import { setupRestClientMock } from "./testUtils/mocks.ts";
import { assertInputValidationError } from "./testUtils/asserts.ts";

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

const { assert } = sinon;

Deno.test("TodoistApi comment endpoints", async (t) => {
  await t.step("getComments", async (t) => {
    await t.step("calls get request with expected params", async () => {
      const getCommentsArgs = { projectId: 12 };
      const requestMock = setupRestClientMock([DEFAULT_COMMENT]);
      const api = getTarget();

      await api.getComments(getCommentsArgs);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        ENDPOINT_REST_COMMENTS,
        DEFAULT_AUTH_TOKEN,
        getCommentsArgs,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const expectedComments = [DEFAULT_COMMENT];
      const requestMock = setupRestClientMock(expectedComments);
      const api = getTarget();

      const comments = await api.getComments({ taskId: 12 });

      assertEquals(comments, expectedComments);
      requestMock.restore();
    });
  });

  await t.step("getComment", async (t) => {
    await t.step("calls get on expected url", async () => {
      const commentId = 1;
      const requestMock = setupRestClientMock(DEFAULT_COMMENT);
      const api = getTarget();

      await api.getComment(commentId);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "GET",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_COMMENTS}/${commentId}`,
        DEFAULT_AUTH_TOKEN,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const expectedComment = DEFAULT_COMMENT;
      const requestMock = setupRestClientMock(expectedComment);
      const api = getTarget();

      const comment = await api.getComment(1);

      assertEquals(comment, expectedComment);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().getComment(INVALID_ENTITY_ID),
      );
    });
  });

  await t.step("addComment", async (t) => {
    const addCommentArgs = {
      content: "A comment",
      taskId: 123,
    };

    await t.step("makes post request with expected params", async () => {
      const requestMock = setupRestClientMock(DEFAULT_COMMENT);
      const api = getTarget();

      await api.addComment(addCommentArgs, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        API_REST_BASE_URI,
        ENDPOINT_REST_COMMENTS,
        DEFAULT_AUTH_TOKEN,
        addCommentArgs,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns result from rest client", async () => {
      const expectedComment = DEFAULT_COMMENT;
      const requestMock = setupRestClientMock(expectedComment);
      const api = getTarget();

      const comment = await api.addComment(addCommentArgs);

      assertEquals(comment, expectedComment);
      requestMock.restore();
    });
  });

  await t.step("updateComment", async (t) => {
    const updateCommentArgs = {
      content: "Updated comment",
    };

    await t.step("makes post request with expected params", async () => {
      const taskId = 1;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.updateComment(taskId, updateCommentArgs, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "POST",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_COMMENTS}/${taskId}`,
        DEFAULT_AUTH_TOKEN,
        updateCommentArgs,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.updateComment(1, updateCommentArgs);

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () =>
          await getTarget().updateComment(INVALID_ENTITY_ID, updateCommentArgs),
      );
    });
  });

  await t.step("deleteComment", async (t) => {
    await t.step("makes delete request on expected url", async () => {
      const taskId = 1;
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.deleteComment(taskId, DEFAULT_REQUEST_ID);

      assert.calledOnce(requestMock);
      assert.calledWith(
        requestMock,
        "DELETE",
        API_REST_BASE_URI,
        `${ENDPOINT_REST_COMMENTS}/${taskId}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );

      requestMock.restore();
    });

    await t.step("returns success result from rest client", async () => {
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.deleteComment(1);

      assertEquals(result, true);
      requestMock.restore();
    });

    await t.step("throws validation error for invalid id input", async () => {
      await assertInputValidationError(
        async () => await getTarget().deleteComment(INVALID_ENTITY_ID),
      );
    });
  });
});
