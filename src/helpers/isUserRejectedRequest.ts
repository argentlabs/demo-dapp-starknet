export const isUserRejectedRequest = (error: unknown) =>
  error instanceof Error &&
  (error.name === "UserRejectedRequestError" ||
    /user rejected request/i.test(error.message))
