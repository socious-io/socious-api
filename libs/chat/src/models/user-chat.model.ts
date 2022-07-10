import { Column, Entity } from "typeorm";

import { ChatParticipant } from "./chat-participant.schema";

@Entity("user_chats", { schema: "socious" })
export class UserChat extends ChatParticipant {
  @Column({ type: "bigint", unsigned: true })
  userId: number;
}
