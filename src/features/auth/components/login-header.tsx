import { Send } from 'lucide-react';

export const LoginHeader = () => {
  return (
    <div>
      <div className="text-background mx-auto mb-4 bg-primary-500 size-38 grid place-items-center rounded-full">
        <Send size={80} />
      </div>
      <h1 className="text-3xl font-semibold mb-2">Telegram</h1>
      <p className="text-muted font-medium">
        Please confirm your country code and enter your phone number
      </p>
    </div>
  );
};
