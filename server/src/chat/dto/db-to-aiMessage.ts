import { Message as AiMessage } from 'ai';
import { Message as DbMessage } from 'prisma/client';

export const dbToAiMessage = (message: DbMessage): AiMessage => {
  return {
    id: message.id,
    role: message.role as AiMessage['role'],
    content: message.content,
    parts: message.parts as unknown as AiMessage['parts'],
    reasoning: message.reasoning ?? undefined,
    annotations: message.annotations as unknown as AiMessage['annotations'],
    experimental_attachments: message.attachments as unknown as AiMessage['experimental_attachments'],
  } satisfies AiMessage;
};
