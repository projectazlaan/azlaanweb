'use client';

import ChatCore from '@/components/ChatCore';

export default function ChatPage() {
  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - 72px)', paddingBottom: 'max(0px, calc(57px + env(safe-area-inset-bottom)))' }}
    >
      <ChatCore />
    </div>
  );
}
