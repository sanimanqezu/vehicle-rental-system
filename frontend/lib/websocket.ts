"use client";

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { NotificationEvent } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:7000/ws";

let stompClient: Client | null = null;
const subscriptions = new Map<string, StompSubscription>();

export const connectWebSocket = (
  token: string,
  onNotification: (event: NotificationEvent) => void,
  onConnect?: () => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (stompClient?.active) {
      resolve();
      return;
    }

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        const sub = stompClient!.subscribe("/topic/reservations", (message: IMessage) => {
          try {
            const event: NotificationEvent = JSON.parse(message.body);
            onNotification(event);
          } catch { /* ignore parse errors */ }
        });
        subscriptions.set("reservations", sub);
        onConnect?.();
        resolve();
      },
      onStompError: (frame) => {
        reject(new Error(frame.headers?.message || "STOMP connection failed"));
      },
      onDisconnect: () => {
        subscriptions.clear();
      },
    });

    stompClient.activate();
  });
};

export const disconnectWebSocket = (): void => {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions.clear();
  if (stompClient?.active) {
    stompClient.deactivate();
  }
  stompClient = null;
};

export const isWebSocketConnected = (): boolean => stompClient?.active ?? false;
