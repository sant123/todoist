import { assertEquals } from "../../deps/testing.ts";
import { getSanitizedContent, getSanitizedTasks } from "./sanitization.ts";
import { DEFAULT_TASK } from "../testUtils/testDefaults.ts";
import type { Task } from "../types/mod.ts";

Deno.test("getSanitizedContent", async (t) => {
  const sanitizationTheories = [
    [
      "Some text with **Bold 1** and __Bold 2__ and !!Bold 3!!",
      "Some text with Bold 1 and Bold 2 and Bold 3",
    ],
    [
      "Some text with *Italic 1* and _Italic 2_",
      "Some text with Italic 1 and Italic 2",
    ],
    [
      "Some text with ***Bold Italic 1*** and ___Bold Italic 2___ and !!!Bold Italic 3!!!",
      "Some text with Bold Italic 1 and Bold Italic 2 and Bold Italic 3",
    ],
    ["* A fake section", "A fake section"],
    ["Another fake section:", "Another fake section"],
    ["A [markdown](http://someurl.com) link", "A markdown link"],
    ["A http://someurl.com (Todoist) link", "A Todoist link"],
    ["A [[gmail=14c98f1d86e72c05, link from gmail]]", "A link from gmail"],
    [
      "A [[outlook=14c98f1d86e72c05, link from outlook]]",
      "A link from outlook",
    ],
    [
      "A [[thunderbird\nlink from thunderbird\nARANDOMID\n]]",
      "A link from thunderbird",
    ],
    [
      "Some text with `inline code` and ```block code```",
      "Some text with inline code and block code",
    ],
    [
      "Trailing asterisks are left in place*",
      "Trailing asterisks are left in place*",
    ],
  ];

  for (const [input, expected] of sanitizationTheories) {
    await t.step(`input text ${input} is sanitized to ${expected}`, () => {
      const sanitizedContent = getSanitizedContent(input);
      assertEquals(sanitizedContent, expected);
    });
  }
});

Deno.test("getSanitizedTasks", async (t) => {
  await t.step("sanitizes a list of tasks", () => {
    const tasks: Task[] = [
      {
        ...DEFAULT_TASK,
        content: "Some ***bold italic*** text",
      },
      {
        ...DEFAULT_TASK,
        content: "* A fake section",
      },
      {
        ...DEFAULT_TASK,
        content: "A [markdown](http://someurl.com) link",
      },
    ];

    const expectedStrings = [
      "Some bold italic text",
      "A fake section",
      "A markdown link",
    ];

    const sanitizedTasks = getSanitizedTasks(tasks);

    assertEquals(sanitizedTasks.length, 3);
    assertEquals(sanitizedTasks[0].sanitizedContent, expectedStrings[0]);
    assertEquals(sanitizedTasks[1].sanitizedContent, expectedStrings[1]);
    assertEquals(sanitizedTasks[2].sanitizedContent, expectedStrings[2]);
  });
});
