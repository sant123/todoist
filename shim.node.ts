// node-fetch shim has json() as unknown, so needs to be ported to any.
declare module "node-fetch" {
  interface BodyMixin {
    // deno-lint-ignore no-explicit-any
    json(): Promise<any>;
  }
}

export { default as fetch } from "node-fetch";
