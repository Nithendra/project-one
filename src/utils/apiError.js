// this error handler will be generate error object in case of api failure

class ApiError extends Error {
  constructor(statusCode, message = "something went wrong!", errors = []) {
    super(message);
    this.errors = errors;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export { ApiError };
