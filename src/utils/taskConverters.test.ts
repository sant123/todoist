import { assertEquals } from "../../deps/testing.ts";
import { getTaskFromQuickAddResponse } from "./taskConverters.ts";
import {
  DEFAULT_QUICK_ADD_RESPONSE,
  DEFAULT_TASK,
} from "../testUtils/testDefaults.ts";

Deno.test("getTaskFromQuickAddResponse", async (t) => {
  await t.step("maps sync data to expected task properties", () => {
    const task = getTaskFromQuickAddResponse(DEFAULT_QUICK_ADD_RESPONSE);
    assertEquals(task, DEFAULT_TASK);
  });

  await t.step("converts null sectionId to 0", () => {
    const quickAddResponse = {
      ...DEFAULT_QUICK_ADD_RESPONSE,
      sectionId: null,
    };
    const task = getTaskFromQuickAddResponse(quickAddResponse);
    assertEquals(task.sectionId, 0);
  });

  await t.step("converts null parentId to undefined", () => {
    const quickAddResponse = {
      ...DEFAULT_QUICK_ADD_RESPONSE,
      parentId: null,
    };
    const task = getTaskFromQuickAddResponse(quickAddResponse);
    assertEquals(task.parentId, undefined);
  });

  await t.step("converts null assignee to undefined", () => {
    const quickAddResponse = {
      ...DEFAULT_QUICK_ADD_RESPONSE,
      responsibleUid: null,
    };
    const task = getTaskFromQuickAddResponse(quickAddResponse);
    assertEquals(task.assignee, undefined);
  });

  const completedTheories = [
    [0, false],
    [1, true],
  ] as const;

  for (const [checkedInt, completedBoolean] of completedTheories) {
    await t.step(
      `checked number value: ${checkedInt} converted to completed boolean value: ${completedBoolean}`,
      () => {
        const quickAddResponse = {
          ...DEFAULT_QUICK_ADD_RESPONSE,
          checked: checkedInt,
        };

        const task = getTaskFromQuickAddResponse(quickAddResponse);
        assertEquals(task.completed, completedBoolean);
      },
    );
  }

  await t.step("converts null due date to undefined", () => {
    const quickAddResponse = {
      ...DEFAULT_QUICK_ADD_RESPONSE,
      due: null,
    };
    const task = getTaskFromQuickAddResponse(quickAddResponse);
    assertEquals(task.due, undefined);
  });

  const taskUrlTheories = [
    [1234, null, "https://todoist.com/showTask?id=1234"],
    [1234, 0, "https://todoist.com/showTask?id=1234"],
    [1234, 5678, "https://todoist.com/showTask?id=1234&sync_id=5678"],
  ] as const;

  for (const [id, syncId, url] of taskUrlTheories) {
    await t.step(
      `with id ${id} and syncId ${syncId} returns url ${url}`,
      () => {
        const quickAddResponse = {
          ...DEFAULT_QUICK_ADD_RESPONSE,
          id,
          syncId,
        };
        const task = getTaskFromQuickAddResponse(quickAddResponse);
        assertEquals(task.url, url);
      },
    );
  }
});
