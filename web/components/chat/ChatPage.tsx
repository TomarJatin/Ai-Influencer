'use client';
import { useChatTransitionStore } from '@/store/chatTransition';
import { useModelSelectionStore } from '@/store/modelSelection';
import { Chat } from '@/types/chat.type';
import { useChat } from '@ai-sdk/react';
import React, { useEffect, useRef } from 'react';
import { useSWRConfig } from 'swr/_internal';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from '../ChatHistory';
import { envConfig } from '@/config';
import { useSession } from 'next-auth/react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import Greeting from './Greeting';

type ChatPageProps = {
  chat: Chat;
};

const ChatPage = ({ chat }: ChatPageProps) => {
  const { query, files, uploadAttachments, clearTransition, chatId } = useChatTransitionStore();
  const { getSelectedModel } = useModelSelectionStore();
  const initialMessageSentRef = useRef(false);
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const { messages, handleSubmit, input, setInput, append, status, error, stop } = useChat({
    id: chat.id,
    api: `${envConfig.apiUrl}/api/chats/${chat.id}/messages`,
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    },
    initialMessages: chat.messages ?? [],
    experimental_throttle: 200,
    sendExtraMessageFields: true,
    experimental_prepareRequestBody: (body) => ({
      message: body.messages.at(-1),
      model: getSelectedModel(),
    }),
    onFinish: (response) => {
      console.log('response', response);
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      console.error('Error in chat:', error);
    },
  });
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (chat.id === chatId && query && !initialMessageSentRef.current) {
        initialMessageSentRef.current = true;
        let options = {};

        if (files.length > 0) {
          try {
            const attachments = await uploadAttachments();
            options = {
              experimental_attachments: attachments,
            };
          } catch (error) {
            console.error('Failed to upload attachments:', error);
          }
        }

        append(
          {
            role: 'user',
            content: query,
          },
          options
        );

        clearTransition();
      }
    };

    sendInitialMessage();
  }, [append, chat.id, chatId, query, files, uploadAttachments, clearTransition]);

  if (messages.length === 0) {
    return (
      <Greeting query={input} setQuery={setInput} isSubmitting={status === 'streaming'} handleSubmit={handleSubmit} />
    );
  }
  return (
    <div className='flex h-[calc(100vh-3rem)] w-full flex-col pb-4'>
      <ChatMessages messages={messages} status={status} error={error} isLoading={status === 'streaming'} />
      <ChatInput
        onSubmit={handleSubmit}
        query={input}
        setQuery={setInput}
        isSubmitting={status === 'streaming'}
        onStop={stop}
      />
    </div>
  );
};

export default ChatPage;
