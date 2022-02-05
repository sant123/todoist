declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

export function randomUUID() {
  return globalThis.crypto.randomUUID();
}
