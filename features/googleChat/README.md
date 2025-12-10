# Google Chat Integration Feature

Feature tích hợp Google Chat theo kiến trúc `request-architecture.md`.

## Cấu trúc

```
features/googleChat/
├── types/              # TypeScript types
├── api/                # API calls
│   ├── googleChat.api.ts
│   └── googleChat.mock-data.ts
├── services/           # Business logic
│   └── googleChat.service.ts
├── stores/             # Zustand state management
│   └── googleChat.store.ts
├── hooks/              # React hooks
│   └── useGoogleChat.ts
└── index.ts            # Public exports
```

## Sử dụng

### Trong Component

```typescript
"use client";

import { useGoogleChat } from "@/features/googleChat";

export default function MyComponent() {
  const {
    isConnected,
    status,
    spaces,
    loading,
    error,
    updateWhitelist,
    disconnect,
    refresh,
  } = useGoogleChat();

  // Hook tự động fetch status và spaces khi cần

  return (
    <div>
      {status?.status === "connected" && (
        <div>
          {spaces.map((space) => (
            <div key={space.id}>{space.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Sử dụng Service trực tiếp

```typescript
import { googleChatService } from "@/features/googleChat";

const result = await googleChatService.fetchSpaces(userId);
```

## Mock Data

Khi `NEXT_PUBLIC_API_MOCKING=enabled`, feature sẽ sử dụng mock data từ `api/googleChat.mock-data.ts`.

Xem [Mocking Setup Guide](../../docs/integrations/mocking-setup.md) để biết chi tiết.

