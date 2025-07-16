import { type Chat } from "@/types";
import { Axios } from "./Axios";

export class Api extends Axios {
  constructor() {
    super("/api");
  }

  getAll() {
    return this.get<Chat[]>("/chats");
  }

  likeById(id: number) {
    return this.patch<Chat>(`/chats/${id}/likes`);
  }

  dislikeById(id: number) {
    return this.patch<Chat>(`/chats/${id}/dislikes`);
  }
}
