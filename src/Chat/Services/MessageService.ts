import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  /**
   * Retrieve all messages within a given conversation.
   *
   * @param id - Conversation id to retrieve messages for.
   */
  public async conversation(id: string): Promise<any[]> {
    return [];
  }

  /**
   * Retrieve all messages originating from the given sender.
   *
   * @param id - Sender id which the messages are assigned.
   */
  public async sender(id: string): Promise<any[]> {
    return [];
  }
}
