import { camelCase, snakeCase } from "../../deps/case.ts";
import { KeyConverter, PlainObject } from "../types/transformation.ts";

const isPlainObject = (value: unknown): value is PlainObject => {
  return value != null &&
    Object.prototype.toString.call(value) === "[object Object]";
};

export const transformObjectKeys = (
  ob: PlainObject,
  kc: KeyConverter,
) => {
  return Object.entries(ob).reduce((newObj, [key, value]) => {
    let newValue = value;

    if (Array.isArray(newValue)) {
      newValue = newValue.map((item) =>
        isPlainObject(item) ? transformObjectKeys(item, kc) : item
      );
    } else if (isPlainObject(newValue)) {
      newValue = transformObjectKeys(
        newValue,
        kc,
      );
    }

    newObj[kc(key)] = newValue;

    return newObj;
  }, {} as PlainObject);
};

export function objectToSnakeCase(ob: PlainObject) {
  return transformObjectKeys(ob, (k) => snakeCase(k));
}

export function objectToCamelCase(ob: PlainObject) {
  return transformObjectKeys(ob, (k) => camelCase(k));
}

export function objectToKeyPairString(ob: PlainObject) {
  return Object.entries(ob).map((
    [key, value],
  ) => [key, String(value)]);
}
