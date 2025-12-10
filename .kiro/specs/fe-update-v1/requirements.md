# Requirements Document

## Introduction

This document defines the requirements for Update v1 of the SpiderX Frontend application. The update focuses on enhancing the home page experience with connected Chat Thread visibility, manual sync capabilities, text-to-todo extraction, and improved message sender information through Google Chat API scope expansion.

## Glossary

- **SpiderX_System**: The SpiderX Frontend application built with Next.js
- **Todo**: A task item that can be created manually or extracted from Google Chat messages
- **Chat_Thread**: A Google Chat space/conversation that has been connected and whitelisted
- **Sync**: The process of fetching messages from Google Chat and extracting todos using AI
- **Action_Item**: A task or todo extracted from text content
- **Message_Sender**: The user who sent a message in Google Chat, identified via chat.memberships.readonly scope

---

## Requirements

### Requirement 1: Home Page with Connected Chat Threads

**User Story:** As a user, I want to see a list of connected Chat Threads on the home page, so that I can quickly understand which conversations are being monitored and filter todos by thread.

#### Acceptance Criteria

1. WHEN a user navigates to the home page (/todos) THEN the SpiderX_System SHALL display a sidebar or section showing all connected Chat Threads
2. WHEN a user clicks on a specific Chat Thread THEN the SpiderX_System SHALL filter the todo list to show only todos from that thread
3. WHEN a user clicks "All Threads" or clears the filter THEN the SpiderX_System SHALL display todos from all connected threads
4. WHEN no Chat Threads are connected THEN the SpiderX_System SHALL display a prompt to connect Google Chat integration
5. WHEN displaying Chat Threads THEN the SpiderX_System SHALL show the thread name and the count of todos from each thread

---

### Requirement 2: Manual Sync Todo Button

**User Story:** As a user, I want to manually trigger a todo sync from my connected Chat Threads, so that I can fetch new action items on demand.

#### Acceptance Criteria

1. WHEN a user clicks the "Sync" button THEN the SpiderX_System SHALL initiate an async task to fetch messages and extract todos from all whitelisted spaces
2. WHEN the sync task starts THEN the SpiderX_System SHALL display a progress indicator showing the current status (PENDING, PROGRESS, SUCCESS, FAILURE)
3. WHILE the sync task is in PROGRESS status THEN the SpiderX_System SHALL poll the task status endpoint and update the progress display
4. WHEN the sync task completes with SUCCESS status THEN the SpiderX_System SHALL display a summary of processed messages and generated todos
5. WHEN the sync task fails THEN the SpiderX_System SHALL display the error message and provide a retry option
6. WHEN a sync task is in progress THEN the SpiderX_System SHALL allow the user to cancel the task

---

### Requirement 3: Paste Context to Extract Action Items

**User Story:** As a user, I want to paste text content and have the system extract action items as todos, so that I can quickly create todos from any text source.

#### Acceptance Criteria

1. WHEN a user opens the "Paste to Extract" modal THEN the SpiderX_System SHALL display a text area for pasting content
2. WHEN a user pastes text and clicks "Extract" THEN the SpiderX_System SHALL send the text to the AI extraction endpoint
3. WHEN the AI extraction completes THEN the SpiderX_System SHALL display a preview of extracted todos for user review
4. WHEN a user approves extracted todos THEN the SpiderX_System SHALL save them to the todo list
5. WHEN a user wants to modify extracted todos THEN the SpiderX_System SHALL allow editing title, description, and priority before saving
6. WHEN the pasted text contains no actionable items THEN the SpiderX_System SHALL display a message indicating no todos were found
7. WHEN the AI extraction fails THEN the SpiderX_System SHALL display an error message and allow the user to retry or create todos manually

---

### Requirement 4: Message Sender Information Display

**User Story:** As a user, I want to see who sent the original message for each todo extracted from Google Chat, so that I can identify the source and context of action items.

#### Acceptance Criteria

1. WHEN a todo is extracted from Google Chat THEN the SpiderX_System SHALL store and display the message sender name
2. WHEN displaying a todo with sender information THEN the SpiderX_System SHALL show the sender name alongside the source thread information
3. WHEN the sender information is unavailable THEN the SpiderX_System SHALL display a fallback indicator
4. WHEN the chat.memberships.readonly scope is not granted THEN the SpiderX_System SHALL prompt the user to re-authorize with the additional scope

