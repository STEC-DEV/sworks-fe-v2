type ErrorHandler = (error: any) => void;

let errorHandlers: ErrorHandler[] = [];

export const subscribeToApiErrors = (handler: ErrorHandler) => {
  errorHandlers.push(handler);
  return () => {
    errorHandlers = errorHandlers.filter((h) => h !== handler);
  };
};

export const notifyApiError = (error: any) => {
  errorHandlers.forEach((handler) => handler(error));
};
