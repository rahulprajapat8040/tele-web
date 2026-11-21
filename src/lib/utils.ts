import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { IMessage } from './interfaces/conversations/messages-res.interface';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNationalPhoneNumber = (phone: string, countryCode: string) => {
  const phoneDigits = phone.replace(/\D/g, '');
  const dialCodeDigits = countryCode.replace(/\D/g, '');

  if (!dialCodeDigits) return phoneDigits;

  if (phoneDigits.startsWith(dialCodeDigits)) {
    return phoneDigits.slice(dialCodeDigits.length);
  }

  return phoneDigits;
};

export const generateDeviceId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;

    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
};

export const GetFilterUrl = (filter: Object) => {
  return filter
    ? Object?.entries(filter)
        ?.filter(([, value]) => value)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&')
    : '';
};

export const getFullName = (firstName: string, lastName?: string) => {
  return `${firstName} ${lastName}`;
};

export const formatMessageTime = (date: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

export const formatMessageDate = (date: string) => {
  const messageDate = new Date(date);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(messageDate);
};

export const getMessageStatus = (message: IMessage) => {
  const receipts = message.receipts ?? [];

  if (!receipts.length) return 'SENT';

  if (receipts.every((receipt) => receipt.readAt)) {
    return 'READ';
  }

  if (receipts.every((receipt) => receipt.deliveredAt)) {
    return 'DELIVERED';
  }

  return 'SENT';
};
