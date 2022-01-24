import { assertEquals, assertThrows } from "../../deps/testing.ts";

import {
  DEFAULT_COMMENT,
  DEFAULT_LABEL,
  DEFAULT_PROJECT,
  DEFAULT_SECTION,
  DEFAULT_TASK,
  DEFAULT_USER,
  INVALID_COMMENT,
  INVALID_LABEL,
  INVALID_PROJECT,
  INVALID_SECTION,
  INVALID_TASK,
  INVALID_USER,
} from "../testUtils/testDefaults.ts";

import {
  validateComment,
  validateCommentArray,
  validateLabel,
  validateLabelArray,
  validateProject,
  validateProjectArray,
  validateSection,
  validateSectionArray,
  validateTask,
  validateTaskArray,
  validateUser,
  validateUserArray,
} from "./validators.ts";

import { ValidationError } from "../../deps/runtypes.ts";

Deno.test("validators", async (t) => {
  await t.step("validateTask", async (t) => {
    await t.step("validation passes for a valid task", () => {
      const result = validateTask(DEFAULT_TASK);
      assertEquals(result, DEFAULT_TASK);
    });

    await t.step("validation throws error for an invalid task", () => {
      assertThrows(() => {
        validateTask(INVALID_TASK);
      }, ValidationError);
    });
  });

  await t.step("validateTaskArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateTaskArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid task array", () => {
      const result = validateTaskArray([DEFAULT_TASK]);
      assertEquals(result, [DEFAULT_TASK]);
    });

    await t.step("validation throws error for an invalid task array ", () => {
      assertThrows(() => {
        validateTaskArray([INVALID_TASK]);
      }, ValidationError);
    });
  });

  await t.step("validateProject", async (t) => {
    await t.step("validation passes for a valid project", () => {
      const result = validateProject(DEFAULT_PROJECT);
      assertEquals(result, DEFAULT_PROJECT);
    });

    await t.step("validation throws error for an invalid project", () => {
      assertThrows(() => {
        validateProject(INVALID_PROJECT);
      }, ValidationError);
    });
  });

  await t.step("validateProjectArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateProjectArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid project array", () => {
      const result = validateProjectArray([DEFAULT_PROJECT]);
      assertEquals(result, [DEFAULT_PROJECT]);
    });

    await t.step(
      "validation throws error for an invalid project array ",
      () => {
        assertThrows(() => {
          validateProjectArray([INVALID_PROJECT]);
        }, ValidationError);
      },
    );
  });

  await t.step("validateSection", async (t) => {
    await t.step("validation passes for a valid section", () => {
      const result = validateSection(DEFAULT_SECTION);
      assertEquals(result, DEFAULT_SECTION);
    });

    await t.step("validation throws error for an invalid section", () => {
      assertThrows(() => {
        validateSection(INVALID_SECTION);
      }, ValidationError);
    });
  });

  await t.step("validateSectionArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateSectionArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid section array", () => {
      const result = validateSectionArray([DEFAULT_SECTION]);
      assertEquals(result, [DEFAULT_SECTION]);
    });

    await t.step(
      "validation throws error for an invalid section array ",
      () => {
        assertThrows(() => {
          validateSectionArray([INVALID_SECTION]);
        }, ValidationError);
      },
    );
  });

  await t.step("validateLabel", async (t) => {
    await t.step("validation passes for a valid label", () => {
      const result = validateLabel(DEFAULT_LABEL);
      assertEquals(result, DEFAULT_LABEL);
    });

    await t.step("validation throws error for an invalid label", () => {
      assertThrows(() => {
        validateLabel(INVALID_LABEL);
      }, ValidationError);
    });
  });

  await t.step("validateLabelArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateLabelArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid label array", () => {
      const result = validateLabelArray([DEFAULT_LABEL]);
      assertEquals(result, [DEFAULT_LABEL]);
    });

    await t.step("validation throws error for an invalid label array ", () => {
      assertThrows(() => {
        validateLabelArray([INVALID_LABEL]);
      }, ValidationError);
    });
  });

  await t.step("validateComment", async (t) => {
    await t.step("validation passes for a valid comment", () => {
      const result = validateComment(DEFAULT_COMMENT);
      assertEquals(result, DEFAULT_COMMENT);
    });

    await t.step("validation throws error for an invalid comment", () => {
      assertThrows(() => {
        validateComment(INVALID_COMMENT);
      }, ValidationError);
    });
  });

  await t.step("validateCommentArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateCommentArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid comment array", () => {
      const result = validateCommentArray([DEFAULT_COMMENT]);
      assertEquals(result, [DEFAULT_COMMENT]);
    });

    await t.step(
      "validation throws error for an invalid comment array ",
      () => {
        assertThrows(() => {
          validateCommentArray([INVALID_COMMENT]);
        }, ValidationError);
      },
    );
  });

  await t.step("validateUser", async (t) => {
    await t.step("validation passes for a valid user", () => {
      const result = validateUser(DEFAULT_USER);
      assertEquals(result, DEFAULT_USER);
    });

    await t.step("validation throws error for an invalid user", () => {
      assertThrows(() => {
        validateUser(INVALID_USER);
      }, ValidationError);
    });
  });

  await t.step("validateUserArray", async (t) => {
    await t.step("validation passes for empty array", () => {
      const result = validateUserArray([]);
      assertEquals(result, []);
    });

    await t.step("validation passes for valid comment user", () => {
      const result = validateUserArray([DEFAULT_USER]);
      assertEquals(result, [DEFAULT_USER]);
    });

    await t.step("validation throws error for an invalid user array ", () => {
      assertThrows(() => {
        validateUserArray([INVALID_USER]);
      }, ValidationError);
    });
  });
});
