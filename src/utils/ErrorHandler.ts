class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    const errorConstructor = Error as ErrorConstructor & {
      captureStackTrace?: (
        targetObject: object,
        constructorOpt?: Function,
      ) => void;
    };

    if (errorConstructor.captureStackTrace) {
      errorConstructor.captureStackTrace(this, this.constructor);
    }
  }
}

export default ErrorHandler;
