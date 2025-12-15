# SpiderX - Tài liệu Kỹ thuật cho Cuộc thi Khởi nghiệp

> **SpiderX** - Ứng dụng quản lý công việc thông minh tích hợp AI, tự động trích xuất tasks từ Google Chat

---

## 1. Thông tin Kỹ thuật

### 1.1 Tổng quan Hệ thống

SpiderX là một ứng dụng web hiện đại được xây dựng với kiến trúc **microservices**, tách biệt hoàn toàn Frontend và Backend để đảm bảo khả năng mở rộng và bảo trì.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐ │
│  │   Auth    │  │   Todos   │  │  Google   │  │     AI       │ │
│  │  Module   │  │  Module   │  │   Chat    │  │  Extraction  │ │
│  └───────────┘  └───────────┘  └───────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │ HTTPS/REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI - Python)                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐ │
│  │   Auth    │  │   Todos   │  │  Google   │  │   Gemini     │ │
│  │  Service  │  │  Service  │  │   Chat    │  │   AI Agent   │ │
│  └───────────┘  └───────────┘  └───────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐ │
│  │   PostgreSQL  │  │  Google Chat  │  │   Google Gemini AI  │ │
│  │   Database    │  │     API       │  │       API           │ │
│  └───────────────┘  └───────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Kiến trúc Frontend (Feature-based Architecture)

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Protected routes (authenticated)
│   │   ├── todos/           # Todo management pages
│   │   ├── whitelist/       # Google Chat space management
│   │   └── layout.tsx       # Auth layout with header
│   └── (public)/            # Public routes (signin, signup)
│
├── features/                 # Feature modules (Domain-driven)
│   ├── auth/                # Authentication module
│   │   ├── api/             # API calls
│   │   ├── services/        # Business logic
│   │   ├── hooks/           # React hooks
│   │   └── types/           # TypeScript definitions
│   │
│   ├── todos/               # Todo management module
│   │   ├── api/             # Todo CRUD APIs
│   │   ├── services/        # Todo business logic
│   │   ├── stores/          # Zustand state management
│   │   ├── hooks/           # useTodos, useTodoDetail, etc.
│   │   ├── components/      # TodoList, TodoItem, TodoDetail
│   │   └── utils/           # Mappers, helpers
│   │
│   └── googleChat/          # Google Chat integration
│       ├── api/             # Google Chat APIs
│       ├── services/        # Integration logic
│       ├── hooks/           # useGoogleChat, useWhitelistManagement
│       └── components/      # Space management UI
│
├── components/              # Shared UI components
│   ├── ui/                  # Base UI components
│   └── auth/                # Auth guards
│
├── hooks/                   # Global hooks (useLogout, etc.)
└── lib/                     # Utilities, API client
```

### 1.3 Data Flow Pattern

```
┌────────────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐    ┌─────────┐
│ Component  │───►│   Hook   │───►│  Service  │───►│   API   │───►│ Backend │
│  (React)   │    │ (React)  │    │ (Logic)   │    │ (Axios) │    │ (REST)  │
└────────────┘    └──────────┘    └───────────┘    └─────────┘    └─────────┘
      ▲                │
      │                ▼
      │         ┌──────────┐
      └─────────│  Store   │ (Zustand - Global State)
                └──────────┘
```

---

## 2. Tech Stack

### 2.1 Frontend Technologies

| Technology       | Version      | Mục đích                                        |
| ---------------- | ------------ | ----------------------------------------------- |
| **Next.js**      | 15.1.11      | React framework với App Router, SSR/SSG support |
| **React**        | 19.0.0       | UI library (latest stable)                      |
| **TypeScript**   | 5.7.3        | Type safety toàn bộ codebase                    |
| **TailwindCSS**  | 4.0.3        | Utility-first CSS framework                     |
| **Zustand**      | 5.0.8        | Lightweight state management                    |
| **Axios**        | 1.13.2       | HTTP client với interceptors                    |
| **date-fns**     | 4.1.0        | Date manipulation library                       |
| **Lucide React** | 0.469.0      | Icon library                                    |
| **Headless UI**  | 2.2.0        | Accessible UI components                        |
| **AOS**          | 3.0.0-beta.6 | Scroll animations                               |

### 2.2 Backend Technologies

| Technology        | Version | Mục đích                         |
| ----------------- | ------- | -------------------------------- |
| **FastAPI**       | Latest  | Python async web framework       |
| **PostgreSQL**    | 15+     | Relational database              |
| **Celery**        | Latest  | Async task queue (AI processing) |
| **Redis**         | Latest  | Cache & message broker           |
| **JWT**           | -       | Authentication tokens            |
| **Google Gemini** | -       | AI model for task extraction     |

### 2.3 Development & Testing

| Technology     | Mục đích                |
| -------------- | ----------------------- |
| **fast-check** | Property-based testing  |
| **Turbopack**  | Fast development builds |
| **ESLint**     | Code linting            |
| **PostCSS**    | CSS processing          |

### 2.4 External Integrations

| Service              | Mục đích                            |
| -------------------- | ----------------------------------- |
| **Google OAuth 2.0** | User authentication                 |
| **Google Chat API**  | Read messages from workspaces       |
| **Google Gemini AI** | Extract todos from natural language |

---

## 3. Core Features

### 3.1 Authentication System

- JWT-based authentication
- Google OAuth integration
- Secure token storage (localStorage/sessionStorage)
- Auto-redirect on token expiration (401/403 handling)

### 3.2 Todo Management

- Full CRUD operations
- Multiple status: `todo`, `in_progress`, `completed`, `cancelled`
- Priority levels: `low`, `medium`, `high`, `urgent`
- Eisenhower Matrix support (urgent/important classification)
- Subtask management
- Tags & categories
- Due date tracking

### 3.3 Google Chat Integration

- OAuth-based space connection
- Whitelist management for spaces
- Message sync with time range selection
- Source tracking (link back to original message)

### 3.4 AI-Powered Features

- **Task Extraction**: Automatically identify todos from chat messages
- **Subtask Generation**: AI generates subtasks from task description
- **Confidence Scoring**: AI provides confidence level for extracted tasks
- **Review Status**: Track AI suggestions vs user-approved tasks

---

## 4. Limitations (Hạn chế hiện tại)

### 4.1 Technical Limitations

| Hạn chế                    | Mô tả                                         | Impact                                           |
| -------------------------- | --------------------------------------------- | ------------------------------------------------ |
| **Client-side pagination** | Pagination thực hiện ở FE, fetch toàn bộ data | Hiệu năng giảm khi data lớn (>1000 items)        |
| **No real-time updates**   | Không có WebSocket/SSE                        | Cần manual refresh để thấy changes từ người khác |
| **Single database**        | Chưa có database sharding                     | Giới hạn scalability khi user base lớn           |
| **No offline support**     | Yêu cầu internet connection                   | Không hoạt động offline                          |
| **Limited AI context**     | Gemini có token limit                         | Không xử lý được messages quá dài                |

### 4.2 Feature Limitations

| Hạn chế                  | Mô tả                                           |
| ------------------------ | ----------------------------------------------- |
| **Single user only**     | Chưa có team collaboration                      |
| **No recurring tasks**   | Chưa hỗ trợ task lặp lại                        |
| **Limited integrations** | Chỉ có Google Chat, chưa có Slack, Teams, Email |
| **No mobile app**        | Chỉ có responsive web, chưa có native app       |
| **No calendar sync**     | Chưa sync với Google Calendar                   |
| **English AI only**      | AI extraction tốt nhất với English              |

### 4.3 Security Limitations

| Hạn chế                   | Mô tả                               |
| ------------------------- | ----------------------------------- |
| **Token in localStorage** | Vulnerable to XSS attacks           |
| **No MFA**                | Chưa có multi-factor authentication |
| **No audit logs**         | Chưa có logging chi tiết actions    |

---

## 5. Kế hoạch Nâng cấp 1 Tháng

### Tuần 1: Performance & Stability

| Task                                    | Priority  | Effort |
| --------------------------------------- | --------- | ------ |
| Implement server-side pagination        | 🔴 High   | 3 days |
| Add request caching với React Query/SWR | 🔴 High   | 2 days |
| Optimize bundle size (lazy loading)     | 🟡 Medium | 1 day  |
| Add error boundaries & retry logic      | 🟡 Medium | 1 day  |

### Tuần 2: Core Features Enhancement

| Task                                   | Priority  | Effort |
| -------------------------------------- | --------- | ------ |
| Team collaboration (invite members)    | 🔴 High   | 4 days |
| Recurring tasks (daily/weekly/monthly) | 🟡 Medium | 2 days |
| Task templates                         | 🟢 Low    | 1 day  |

### Tuần 3: Integrations & AI

| Task                             | Priority  | Effort |
| -------------------------------- | --------- | ------ |
| Slack integration                | 🟡 Medium | 3 days |
| Email integration (Gmail)        | 🟡 Medium | 2 days |
| Improve Vietnamese AI extraction | 🔴 High   | 2 days |

### Tuần 4: Mobile & Polish

| Task                               | Priority  | Effort |
| ---------------------------------- | --------- | ------ |
| PWA support (offline mode)         | 🔴 High   | 2 days |
| Push notifications                 | 🟡 Medium | 2 days |
| UI/UX polish & animations          | 🟢 Low    | 2 days |
| Performance testing & optimization | 🟡 Medium | 1 day  |

### Roadmap Summary

```
Week 1                 Week 2                 Week 3                 Week 4
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Performance │  ──►  │   Team &    │  ──►  │   More      │  ──►  │   Mobile    │
│   & Caching │       │ Recurring   │       │ Integrations│       │   & Polish  │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
```

---

## 6. Metrics & Success Criteria

### 6.1 Performance Targets

| Metric                  | Current | Target (1 month) |
| ----------------------- | ------- | ---------------- |
| Time to Interactive     | ~2.5s   | <1.5s            |
| First Contentful Paint  | ~1.8s   | <1.0s            |
| Lighthouse Score        | ~75     | >90              |
| API Response Time (p95) | ~500ms  | <200ms           |

### 6.2 Feature Completion

| Milestone              | Target Date   |
| ---------------------- | ------------- |
| Server-side pagination | Week 1, Day 3 |
| Team collaboration MVP | Week 2, Day 5 |
| Slack integration      | Week 3, Day 3 |
| PWA + Offline          | Week 4, Day 2 |

---

## 7. Competitive Advantages

| Feature                 | SpiderX | Todoist | Things | TickTick |
| ----------------------- | ------- | ------- | ------ | -------- |
| AI Task Extraction      | ✅      | ❌      | ❌     | Limited  |
| Google Chat Integration | ✅      | ❌      | ❌     | ❌       |
| Eisenhower Matrix       | ✅      | ❌      | ❌     | ✅       |
| Free tier               | ✅      | Limited | ❌     | Limited  |
| Vietnamese support      | ✅      | ❌      | ❌     | Limited  |

---

## 8. Contact & Resources

- **Repository**: Private (available for demo)
- **Demo URL**: [To be deployed]
- **API Documentation**: OpenAPI/Swagger available
- **Team Size**: 2 developers

---

_Tài liệu được tạo: 15/12/2024_  
_Version: 1.0_
