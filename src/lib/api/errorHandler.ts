import { HTTPError } from "ky";

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

export const handleApiError = async (err: unknown): Promise<string> => {
  if (err instanceof HTTPError) {
    try {
      const errRes = await err.response.json();
      return errRes.message || "요청 처리 중 오류가 발생했습니다.";
    } catch {
      return "요청 처리 중 오류가 발생했습니다.";
    }
  }

  return "알 수 없는 오류가 발생했습니다.";
};
