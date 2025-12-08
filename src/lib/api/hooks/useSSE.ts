import { useCallback, useRef, useState } from "react";

interface UseSSEOptions {
  url: string;
  enabled?: boolean;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
}

export function useSSE<T = any>({
  url,
  enabled = true,
  onMessage,
  onError,
  reconnectInterval = 3000,
}: UseSSEOptions) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return;
    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE 연결 성공");
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          console.log("=======데이터=======");
          console.log(parsedData);
          setData(parsedData);
          onMessage?.(parsedData);
        } catch {
          setData(event.data as T);
          onMessage?.(event.data);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE 에러 :", err);
        setError(err);
        setIsConnected(false);
        onError?.(err);

        //재연결 시도
        eventSource.close();
        eventSourceRef.current = null;

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("SSE 재연결 시도...");
          connect();
        }, reconnectInterval);
      };
    } catch (err) {
      console.error("SSE 연결 실패:", err);
    }
  }, [url, enabled, onMessage, onError, reconnectInterval]);
}
