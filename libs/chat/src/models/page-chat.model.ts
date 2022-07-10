import { Column, Entity } from "typeorm";

import { ChatParticipant } from "./chat-participant.schema";

@Entity("page_chats", { schema: "socious" })
export class PageChat extends ChatParticipant {
  @Column({ type: "bigint", unsigned: true })
  pageId: number;

  /** Filtered view of the participant data for sending to other participants. */
  public publicView(): any {
    return {
      ...super.publicView(),
      pageId: this.pageId,
    };
  }
}
