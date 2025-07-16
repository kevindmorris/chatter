import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const stompClient = new Client({
  brokerURL: undefined,
  webSocketFactory: () => new SockJS(`/api/ws/chats`),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (str) => console.log(str),
});
