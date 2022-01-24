# Todoist API [![Deno](https://github.com/sant123/todoist/actions/workflows/deno.yml/badge.svg)](https://github.com/sant123/todoist/actions/workflows/deno.yml)

This is a [port](https://github.com/Doist/todoist-api-typescript) from the
official TypeScript API client for the Todoist REST API.

## Installation

```typescript
import { TodoistApi } from "https://deno.land/x/todoist/mod.ts";
```

### Usage

An example of initializing the API client and fetching a user's tasks:

```typescript
import { TodoistApi } from "https://deno.land/x/todoist/mod.ts";

const api = new TodoistApi("YOURTOKEN");

api.getTasks()
  .then((tasks) => console.log(tasks))
  .catch((error) => console.log(error));
```

### Documentation

For more detailed reference documentation, have a look at the
[API documentation with TypeScript examples](https://developer.todoist.com/rest/v1/?javascript).

## Development and Testing

Instead of having an example app in the repository to assist development and
testing, you can create a `scratch.ts` file. This allows us to have a file
locally that can import and utilize the API while developing or reviewing pull
requests without having to manage a separate app project.

- Add a file named `scratch.ts` in the `root` folder.
- Import and call the relevant modules and run the scratch file.

Example scratch.ts file:

```typescript
import { TodoistApi } from "./mod.ts";

const token = "YOURTOKEN";
const api = new TodoistApi(token);

api.getProjects()
  .then((projects) => {
    console.log(projects);
  })
  .catch((error) => console.error(error));
```

## Releases

A new version is published to the Deno Third Party Registry whenever a new
release on GitHub is created.

### Feedback

Any feedback, such as bugs, questions, comments, etc. can be reported as
_Issues_ in this repository.

### Contributions

We would also love contributions in the form of _Pull requests_ in this
repository.
