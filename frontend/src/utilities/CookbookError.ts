class CookbookError extends Error {
  readonly status: number;
  readonly isCookbookError: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.isCookbookError = true;
  }
}

export const isCookbookError = (error: unknown): error is CookbookError => {
  return typeof error === "object" && error !== null && "isCookbookError" in error;
};

export default CookbookError;
