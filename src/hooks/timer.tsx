import { useState, useEffect, useRef } from "react";

export const useTimer = (initialSec: number = 180, onExpire?: () => void) => {
  const [seconds, setSeconds] = useState<number>(initialSec);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasExpiredRef = useRef<boolean>(false); // 중복 실행 방지 플래그
  const onExpireRef = useRef(onExpire); // onExpire를 ref로 관리

  // onExpire가 변경되면 ref 업데이트 (의존성 배열 문제 해결)
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const start = () => {
    setSeconds(initialSec);
    setIsActive(true);
    hasExpiredRef.current = false; // 시작 시 플래그 초기화
  };

  const stop = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    setSeconds(initialSec);
    setIsActive(false);
    hasExpiredRef.current = false; // 리셋 시 플래그 초기화
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      // 타이머 실행
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive && !hasExpiredRef.current) {
      // 타이머 만료 (한 번만 실행)
      hasExpiredRef.current = true;
      stop();
      onExpireRef.current?.();
    }

    // cleanup: interval 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, seconds]); // onExpire는 의존성에서 제외 (ref 사용)

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return { seconds, formatTime, start, stop, reset, isActive };
};
