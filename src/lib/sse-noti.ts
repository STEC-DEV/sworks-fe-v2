import {
  NotificationType,
  useSSENotificationStore,
} from "@/store/normal/sse-store";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth/auth-store";
import { toast } from "sonner";
import { SSENotification } from "@/types/normal/sse-noti";
import { getTime } from "./time";

const TYPE_LABELS: Record<NotificationType, string> = {
  voc: "민원",
  notice: "공지",
  sch: "일정",
  req: "요청업무",
};

const ROLE_SUBSCRIPTIONS: Record<string, string[]> = {
  "현장 관리자": ["voc", "notice", "sch", "req"],
  근무자: ["notice", "sch"],
};

export function useSSENotifications() {
  const connectionsRef = useRef<Map<string, AbortController>>(new Map());
  const reconnectTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { incrementCount } = useSSENotificationStore();
  const { enteredWorkplace, loginProfile } = useAuthStore();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (
      !accessToken ||
      !enteredWorkplace ||
      !enteredWorkplace.siteSeq ||
      !loginProfile
    ) {
      console.log("❌ SSE: AUTH 정보없음, 연결 안 함");
      return;
    }

    const topics = ROLE_SUBSCRIPTIONS[loginProfile.role] || [];
    console.log("📋 구독 카테고리:", topics, `(역할: ${loginProfile.role})`);

    if (topics.length === 0) {
      console.log("⚠️ 구독할 카테고리가 없습니다");
      return;
    }

    // ⭐ 각 토픽별로 SSE 연결
    topics.forEach((topic) => {
      connectSSE(enteredWorkplace.siteSeq.toString(), topic, accessToken);
    });

    // Cleanup
    return () => {
      console.log("🧹 모든 SSE 연결 정리 중...");

      connectionsRef.current.forEach((controller, topic) => {
        console.log(`🔌 ${topic} 연결 종료`);
        controller.abort();
      });
      connectionsRef.current.clear();

      reconnectTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      reconnectTimeoutsRef.current.clear();
    };
  }, [enteredWorkplace, loginProfile, incrementCount]);

  // SSE 메시지 처리
  const handleSSEMessage = (
    eventType: string,
    data: string,
    eventId?: string
  ) => {
    if (eventType === "heartbeat") {
      console.log("💓 SSE Heartbeat");
      return;
    }

    console.log("🔔 handleSSEMessage:", { eventType, eventId, data });

    // ⭐ 연결 확인 메시지
    if (eventType === "connected") {
      console.log(`${getTime()} ✅ SSE 연결 완료: ${data}`);
      toast.success(`${data} 실시간 알림 연결됨`);
      return;
    }

    // Heartbeat (거의 안 올 것 같지만 안전장치)
    if (eventType === "heartbeat" || !data) {
      console.log("💓 Heartbeat");
      return;
    }

    if (eventType.endsWith("_sse")) {
      try {
        const parsed = JSON.parse(data);
        console.log("✅ JSON 파싱 성공:", parsed);
        const notification: SSENotification = {
          logSeq: parsed.logSeq || Date.now().toString(),

          topic: parsed.topic,
          eventName: parsed.eventName,

          title: parsed.title,
          message: parsed.message,
          notificationSeq: parsed.notificationSeq,
          timestamp: parsed.timestamp,
        };

        console.log("📬 새 알림:", notification);

        // Store에 추가
        //   addNotification(notification);
        const [, type] = notification.topic.split("_");
        incrementCount(type as NotificationType);

        // Toast 표시

        toast.info(`알림`, {
          description: notification.message,
          duration: 5000,
        });
      } catch (error) {
        console.error("알림 파싱 에러:", error);
      }
    }
  };

  //SSE 연결
  const connectSSE = async (
    siteSeq: string,
    topic: string,
    accessToken: string
  ) => {
    // ⭐ AbortController 생성
    const existingController = connectionsRef.current.get(topic);
    if (existingController) {
      existingController.abort();
    }

    const abortController = new AbortController();
    connectionsRef.current.set(topic, abortController);
    console.log(`    ${topic.toUpperCase()} SSE 연결 시도... `);

    try {
      const res = await fetch(
        `http://123.2.156.148:5247/api/sse/subscribe/${siteSeq}_${topic}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: abortController.signal,
        }
      );
      if (!res.body) return console.log("res body 없음");

      // ⭐ ReadableStream으로 데이터 읽기
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("🔌 SSE 스트림 종료");
          break;
        }

        // ⭐ 서버에서 데이터가 올 때마다 로그
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📥 서버에서 데이터 수신:", {
          byteLength: value.length,
          rawData: new TextDecoder().decode(value),
        });

        // 청크를 문자열로 변환
        buffer += decoder.decode(value, { stream: true });

        // 완전한 메시지(줄바꿈으로 구분)를 처리
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || ""; // 마지막 불완전한 메시지는 버퍼에 보관

        console.log("📋 분리된 메시지들:", messages.length, "개");

        for (const message of messages) {
          // ⭐ 빈 메시지 또는 주석만 있는 메시지 건너뛰기
          if (!message.trim() || message.trim() === ":") {
            console.log("💓 Heartbeat (주석)");
            continue;
          }

          console.log("━━━ 메시지 파싱 시작 ━━━");
          console.log("원본 메시지:", message);

          const lines = message.split("\n");
          let eventType = "message";
          let eventId = "";
          let eventData = "";
          let retry = null;

          for (const line of lines) {
            const trimmedLine = line.trim();

            // ⭐ 빈 줄 또는 주석 무시
            if (!trimmedLine || trimmedLine === ":") {
              continue;
            }

            if (line.startsWith("event:")) {
              eventType = line.slice(6).trim();
              console.log("📌 event:", eventType);
            } else if (line.startsWith("data:")) {
              eventData += line.slice(5).trim();
              console.log("📦 data:", line.slice(5).trim());
            } else if (line.startsWith("id:")) {
              eventId = line.slice(3).trim();
              console.log("🆔 id:", eventId);
            } else if (line.startsWith("retry:")) {
              retry = parseInt(line.slice(6).trim());
              console.log("🔄 retry:", retry);
            }
          }

          // ⭐ retry만 있는 메시지 처리
          if (retry && !eventData && !eventType) {
            console.log("⏱️ Retry 설정:", retry, "ms");
            continue;
          }

          // 이벤트 데이터가 있으면 처리
          if (eventData || eventType !== "message") {
            console.log("✅ 완성된 메시지:", {
              eventType,
              eventId,
              eventData,

              retry,
            });

            handleSSEMessage(eventType, eventData, eventId);
          }

          console.log("━━━━━━━━━━━━━━━━━━━━━━\n");
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log(`🔌 [${topic}] SSE 연결 취소됨`);
        return;
      }

      console.error(`❌ [${topic}] SSE 연결 에러:`, err);

      const existingTimeout = reconnectTimeoutsRef.current.get(topic);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        console.log(`🔄 [${topic}] SSE 재연결 시도...`);
        connectSSE(siteSeq, topic, accessToken);
      }, 5000);

      reconnectTimeoutsRef.current.set(topic, timeout);
    }
  };
}
