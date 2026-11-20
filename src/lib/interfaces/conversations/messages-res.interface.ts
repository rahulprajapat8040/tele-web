export interface IMessagesRes {
  data: IMessage[];
  pagination: Pagination;
}

export interface IMessage {
  id: string;
  clientMessageId: string;
  type: any;
  content: string;
  conversationId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  sender: Sender;
  receipts: Receipt[];
  localStatus?: 'SENDING' | 'SENT' | 'FAILED';
}

export interface Sender {
  id: string;
  firstName: string;
}

export interface Receipt {
  userId: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string;
}
