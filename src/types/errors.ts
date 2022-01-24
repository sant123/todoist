const authenticationErrorCodes = [401, 403];

export class TodoistRequestError extends Error {
  public constructor(
    public message: string,
    public httpStatusCode?: number,
    public responseData?: unknown,
  ) {
    super(message);
    this.name = "TodoistRequestError";
  }

  isAuthenticationError = (): boolean => {
    if (!this.httpStatusCode) {
      return false;
    }

    return authenticationErrorCodes.includes(this.httpStatusCode);
  };
}
