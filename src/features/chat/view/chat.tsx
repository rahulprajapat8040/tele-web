import { ChatHeader } from '../components/chat-header';
import { MessageInput } from '../components/message/message-input';

export const Chat = () => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex-1"></div>
      <MessageInput />
    </div>
  );
};
