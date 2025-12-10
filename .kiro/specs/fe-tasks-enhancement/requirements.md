# Requirements Document

## Introduction

This document defines the requirements for enhancing the SpiderX Frontend application with new features including Sync Todo functionality, Todo Detail screen, Chat Thread integration, Assignee display, AI-powered subtask generation, and Whitelist UI optimization.

## Glossary

- **SpiderX_System**: The SpiderX Frontend application built with Next.js
- **Todo**: A task item that can be created manually or extracted from Google Chat messages
- **Subtask**: A child task belonging to a parent Todo
- **Space**: A Google Chat space/room that users can whitelist for message scanning
- **Whitelist**: The list of Google Chat spaces that the system is allowed to read messages from
- **Sync**: The process of fetching messages from Google Chat and extracting todos using AI
- **Assignee**: The person responsible for completing a todo

---

## Requirements

### Requirement 1: Sync Todo from Google Chat

**User Story:** As a user, I want to sync todos from my whitelisted Google Chat spaces, so that I can automatically extract action items from chat messages.

#### Acceptance Criteria

1. WHEN a user clicks the "Sync Todo" button THEN the SpiderX_System SHALL fetch messages from the last sync timestamp to the current time and extract todos
2. WHEN a user wants to specify a custom time range THEN the SpiderX_System SHALL display a date range picker modal allowing selection of start and end dates
3. WHEN the sync process starts THEN the SpiderX_System SHALL display a loading indicator with progress information
4. WHEN the sync process completes THEN the SpiderX_System SHALL display a summary showing the number of messages processed and todos extracted
5. WHEN the sync process fails THEN the SpiderX_System SHALL display an error message and allow the user to retry
6. WHEN a sync completes successfully THEN the SpiderX_System SHALL store the sync timestamp for future default range calculations

---

### Requirement 2: Todo Detail Screen

**User Story:** As a user, I want to view the full details of a todo item, so that I can see all information and manage subtasks.

#### Acceptance Criteria

1. WHEN a user clicks on a todo item THEN the SpiderX_System SHALL navigate to a detail page showing all todo information
2. WHEN viewing a todo detail THEN the SpiderX_System SHALL display title, description, status, priority, due date, tags, and timestamps
3. WHEN a todo has subtasks THEN the SpiderX_System SHALL display the list of subtasks with their status
4. WHEN a user edits a todo field THEN the SpiderX_System SHALL save the changes and update the display
5. WHEN a todo originated from Google Chat THEN the SpiderX_System SHALL display the source space name and provide a link to the original message
6. WHEN a user clicks the back button THEN the SpiderX_System SHALL return to the todo list preserving the previous filter state

---

### Requirement 3: Chat Thread Name and Link Display

**User Story:** As a user, I want to see the source chat thread name and have a link to it, so that I can reference the original conversation.

#### Acceptance Criteria

1. WHEN a todo has a source_space_id THEN the SpiderX_System SHALL display the space name in the todo item
2. WHEN a user clicks the space name link THEN the SpiderX_System SHALL open the Google Chat thread in a new browser tab
3. WHEN the space name is not available THEN the SpiderX_System SHALL display a fallback text indicating the source is from chat
4. WHEN displaying the source link THEN the SpiderX_System SHALL use a recognizable Google Chat icon

---

### Requirement 4: Assignee Display in Todo Items

**User Story:** As a user, I want to see the assignee name in todo items, so that I can quickly identify who is responsible for each task.

#### Acceptance Criteria

1. WHEN a todo has an assignee THEN the SpiderX_System SHALL display the assignee name or avatar in the todo item
2. WHEN a todo has no assignee THEN the SpiderX_System SHALL display an "Unassigned" indicator or leave the field empty
3. WHEN displaying multiple todos THEN the SpiderX_System SHALL show assignee information consistently across all items
4. WHEN the assignee name is too long THEN the SpiderX_System SHALL truncate with ellipsis and show full name on hover

---

### Requirement 5: AI-Powered Subtask Generation

**User Story:** As a user, I want to generate subtasks for a todo using AI, so that I can break down complex tasks automatically.

#### Acceptance Criteria

1. WHEN a user clicks "Generate Subtasks" button THEN the SpiderX_System SHALL call the AI service to analyze the todo and suggest subtasks
2. WHEN AI generates subtasks THEN the SpiderX_System SHALL display a preview list for user review before saving
3. WHEN a user approves generated subtasks THEN the SpiderX_System SHALL save them to the todo
4. WHEN a user wants to modify generated subtasks THEN the SpiderX_System SHALL allow editing before saving
5. WHEN the AI service fails THEN the SpiderX_System SHALL display an error message and allow manual subtask creation
6. WHEN generating subtasks THEN the SpiderX_System SHALL display a loading state indicating AI processing

---

### Requirement 6: Whitelist UI Optimization

**User Story:** As a user, I want an improved whitelist management interface, so that I can efficiently manage which Google Chat spaces are monitored.

#### Acceptance Criteria

1. WHEN viewing the whitelist page THEN the SpiderX_System SHALL display spaces in a clear, organized list with search functionality
2. WHEN a user searches for a space THEN the SpiderX_System SHALL filter the list in real-time
3. WHEN toggling a space's whitelist status THEN the SpiderX_System SHALL provide immediate visual feedback
4. WHEN saving whitelist changes THEN the SpiderX_System SHALL display a success confirmation
5. WHEN the space list is loading THEN the SpiderX_System SHALL display skeleton loaders for better UX
6. WHEN there are many spaces THEN the SpiderX_System SHALL support pagination or virtual scrolling
