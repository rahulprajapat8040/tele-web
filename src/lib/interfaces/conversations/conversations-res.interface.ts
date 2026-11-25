import type { IPageInfo } from '@/lib/interfaces/common/base-res.interface';

export interface IConversationRes {
  data: IConversation[];
  pageInfo: IPageInfo;
}

export interface IConversation {
  id: string;
  title: any;
  createdAt: string;
  members: Member[];
  messages: Message[];
}

export interface Member {
  id: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNo: string;
  lastSeenAt: Date | null;
  isOnline: boolean;
}

export interface Message {
  id: string;
  clientMessageId: string;
  type: any;
  content: string;
  conversationId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  receipts: Receipt[];
}

export interface Receipt {
  id: string;
  deliveredAt: any;
  readAt: any;
}
