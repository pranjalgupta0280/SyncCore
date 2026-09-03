# SyncCore Complete Request Lifecycle & Code Execution Flowchart

This document provides an end-to-end technical breakdown and Mermaid flowcharts detailing how every file and function in SyncCore executes from initial User Registration to Team Creation, Member Invites, Project/Task Management, Real-Time WebSockets, and Analytics Pipeline updates.

---

## 1. Master Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React + Vite + Socket.io Client)"]
        UI[User UI Action] --> AuthCtx[AuthContext.jsx]
        UI --> TeamCtx[TeamContext.jsx]
        AuthCtx --> API[services/api.js - Axios Interceptor]
        TeamCtx --> API
        UI --> SocketClient[services/socket.js]
    end

    subgraph Server ["Server Layer (Node.js + Express + Socket.io Server)"]
        API --> ServerJs[server.js Entry Point]
        ServerJs --> GlobalMW[Cors & Express JSON Middlewares]
        GlobalMW --> Router[Express Router Mapping]

        Router -->|/api/auth| AuthRoutes[routes/auth.routes.js]
        Router -->|/api/teams| TeamRoutes[routes/team.routes.js]
        Router -->|/api/projects| ProjectRoutes[routes/project.routes.js]
        Router -->|/api/analytics| AnalyticsRoutes[routes/analytics.routes.js]

        AuthRoutes --> AuthMW[middlewares/auth.middleware.js]
        TeamRoutes --> AuthMW & RBACMW[middlewares/rbac.middleware.js]
        ProjectRoutes --> AuthMW & RBACMW
        AnalyticsRoutes --> AuthMW & RBACMW

        AuthMW --> AuthCtrl[controllers/auth.controller.js]
        RBACMW --> TeamCtrl[controllers/team.controller.js]
        RBACMW --> ProjectCtrl[controllers/project.controller.js]
        RBACMW --> AnalyticsCtrl[controllers/analytics.controller.js]

        SocketClient <--> SocketHandler[sockets/socket.handler.js]
    end

    subgraph Database ["Database Layer (MongoDB Atlas / Local)"]
        AuthCtrl --> UserMod[models/User.js]
        TeamCtrl --> TeamMod[models/Team.js]
        ProjectCtrl --> ProjMod[models/Project.js]
        SocketHandler --> MsgMod[models/Message.js]
        AnalyticsCtrl --> ProjMod & UserMod
    end
```

---

## 2. Step-by-Step Lifecycle Execution Flows

### Phase A: User Account Registration

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant AuthModal as AuthModal.jsx
    participant AuthContext as AuthContext.jsx
    participant API as services/api.js
    participant Server as server.js
    participant AuthRoutes as routes/auth.routes.js
    participant AuthCtrl as controllers/auth.controller.js
    participant UserModel as models/User.js
    participant MongoDB as MongoDB Database

    User->>AuthModal: Fills Name, Email, Handle (@username), Password & clicks "Register"
    AuthModal->>AuthContext: calls register(name, email, username, password)
    AuthContext->>API: POST /api/auth/register
    API->>Server: HTTP POST Request
    Server->>AuthRoutes: Route matching '/api/auth/register'
    AuthRoutes->>AuthCtrl: calls registerUser(req, res, next)
    AuthCtrl->>UserModel: User.findOne({ email }) & User.findOne({ username })
    UserModel-->>AuthCtrl: Unique validation passed
    AuthCtrl->>UserModel: User.create({ name, email, username, password })
    UserModel->>UserModel: pre('save') async hook hashes password with bcrypt
    UserModel->>MongoDB: Inserts User Document
    MongoDB-->>AuthCtrl: Saved User Document
    AuthCtrl-->>API: Returns { success: true, data: { _id, name, username, token } }
    API-->>AuthContext: Sets JWT token in localStorage & connects socket
    AuthContext-->>AuthModal: Updates user state & unlocks workspace
```

**Executing Files & Functions:**
1. **Client**: [`client/src/components/AuthModal.jsx`](file:///c:/node/SyncCore/client/src/components/AuthModal.jsx) `handleSubmit()`
2. **Client**: [`client/src/context/AuthContext.jsx`](file:///c:/node/SyncCore/client/src/context/AuthContext.jsx) `register()`
3. **Client**: [`client/src/services/api.js`](file:///c:/node/SyncCore/client/src/services/api.js) (attaches Bearer headers)
4. **Server Route**: [`server/routes/auth.routes.js`](file:///c:/node/SyncCore/server/routes/auth.routes.js) `router.post('/register', registerUser)`
5. **Server Controller**: [`server/controllers/auth.controller.js`](file:///c:/node/SyncCore/server/controllers/auth.controller.js) `registerUser()`
6. **Server Model Hook**: [`server/models/User.js`](file:///c:/node/SyncCore/server/models/User.js) `userSchema.pre('save', async function() { ... })`

---

### Phase B: Creating a Team Workspace

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Team Creator (User A)
    participant TeamModal as TeamModal.jsx
    participant TeamContext as TeamContext.jsx
    participant AuthMW as middlewares/auth.middleware.js
    participant TeamCtrl as controllers/team.controller.js
    participant TeamModel as models/Team.js

    Creator->>TeamModal: Enters Workspace Name & Description
    TeamModal->>TeamContext: calls createTeam(name, description)
    TeamContext->>AuthMW: POST /api/teams (with Bearer Token)
    AuthMW->>AuthMW: Verifies JWT, attaches req.user
    AuthMW->>TeamCtrl: calls createTeam(req, res, next)
    TeamCtrl->>TeamModel: Team.create({ name, admin: req.user._id, members: [{ user, role: 'Admin' }] })
    TeamModel-->>TeamCtrl: Returns Populated Team Document
    TeamCtrl-->>TeamContext: Returns HTTP 201 Created with Workspace Details
    TeamContext-->>TeamModal: Sets activeTeam and joins WebSocket room
```

**Executing Files & Functions:**
1. **Client**: [`client/src/components/TeamModal.jsx`](file:///c:/node/SyncCore/client/src/components/TeamModal.jsx) `handleSubmit()`
2. **Server Middleware**: [`server/middlewares/auth.middleware.js`](file:///c:/node/SyncCore/server/middlewares/auth.middleware.js) `protect()`
3. **Server Controller**: [`server/controllers/team.controller.js`](file:///c:/node/SyncCore/server/controllers/team.controller.js) `createTeam()`
4. **Server Model**: [`server/models/Team.js`](file:///c:/node/SyncCore/server/models/Team.js)

---

### Phase C: Inviting a Team Member by Handle (@username)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Team Admin
    participant MemberModal as MemberModal.jsx
    participant RBACMW as middlewares/rbac.middleware.js
    participant TeamCtrl as controllers/team.controller.js
    participant UserModel as models/User.js
    participant TeamModel as models/Team.js

    Admin->>MemberModal: Submits Handle "@alex_dev" & Selects Role "Member"
    MemberModal->>RBACMW: POST /api/teams/:teamId/members
    RBACMW->>RBACMW: isTeamAdmin verifies req.user is Admin of req.params.teamId
    RBACMW->>TeamCtrl: calls addMember(req, res, next)
    TeamCtrl->>UserModel: User.findOne({ username: 'alex_dev' })
    UserModel-->>TeamCtrl: Returns target User Document
    TeamCtrl->>TeamModel: Checks duplicate & pushes { user: targetUser._id, role: 'Member' }
    TeamModel-->>TeamCtrl: Saves Team Document
    TeamCtrl-->>MemberModal: Returns HTTP 200 Success with updated members list
```

**Executing Files & Functions:**
1. **Client**: [`client/src/components/MemberModal.jsx`](file:///c:/node/SyncCore/client/src/components/MemberModal.jsx) `handleAddMember()`
2. **Server RBAC Middleware**: [`server/middlewares/rbac.middleware.js`](file:///c:/node/SyncCore/server/middlewares/rbac.middleware.js) `isTeamAdmin()`
3. **Server Controller**: [`server/controllers/team.controller.js`](file:///c:/node/SyncCore/server/controllers/team.controller.js) `addMember()`

---

### Phase D: Creating a Project & Subtask (Assignee & Collaborators)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Team Admin
    participant TaskBoard as TaskBoard.jsx
    participant ProjectCtrl as controllers/project.controller.js
    participant ProjectModel as models/Project.js
    participant SocketHandler as sockets/socket.handler.js
    participant TeamMembers as All Team Members (Sockets)

    Admin->>TaskBoard: Fills Subtask Title, selects 1 Primary Assignee & multi-checks Collaborators
    TaskBoard->>TaskBoard: Validates isTeamAdmin === true
    TaskBoard->>ProjectCtrl: POST /api/projects/:projectId/subtasks
    ProjectCtrl->>ProjectCtrl: checkIsTeamAdmin(project.teamId, req.user._id)
    ProjectCtrl->>ProjectModel: Pushes subtask { title, assignedTo: SingleID, collaborators: [IDs], status: 'To Do' }
    ProjectModel-->>ProjectCtrl: Saves Project Document
    ProjectCtrl-->>TaskBoard: Returns HTTP 201 Created with populated subtask
    TaskBoard->>SocketHandler: emits 'task_update' ({ teamId, projectId, taskAction: 'created' })
    SocketHandler->>TeamMembers: broadcasts 'task_updated' event to team room
```

**Executing Files & Functions:**
1. **Client**: [`client/src/components/TaskBoard.jsx`](file:///c:/node/SyncCore/client/src/components/TaskBoard.jsx) `handleAddSubtaskSubmit()`
2. **Server Controller**: [`server/controllers/project.controller.js`](file:///c:/node/SyncCore/server/controllers/project.controller.js) `addSubtask()` & `checkIsTeamAdmin()`
3. **Server Model**: [`server/models/Project.js`](file:///c:/node/SyncCore/server/models/Project.js)
4. **WebSocket Server**: [`server/sockets/socket.handler.js`](file:///c:/node/SyncCore/server/sockets/socket.handler.js) `task_update` event handler

---

### Phase E: Real-Time Chat & Direct Messaging (DMs)

```mermaid
sequenceDiagram
    autonumber
    actor Sender as User A
    actor Recipient as User B (Recipient)
    participant ChatPanel as ChatPanel.jsx
    participant SocketHandler as sockets/socket.handler.js
    participant MessageModel as models/Message.js

    Sender->>ChatPanel: Types message & clicks Send
    ChatPanel->>SocketHandler: socket.emit('send_direct_message', { teamId, recipientId, content })
    SocketHandler->>SocketHandler: Middleware verifies JWT socket.user
    SocketHandler->>MessageModel: Message.create({ teamId, sender, recipient: recipientId, content })
    MessageModel-->>SocketHandler: Returns Populated Message Document
    SocketHandler->>Recipient: io.to(recipientId).emit('new_direct_message', populatedMsg)
    SocketHandler->>Sender: io.to(senderId).emit('new_direct_message', populatedMsg)
    Recipient->>ChatPanel: Automatically appends message to DM stream
```

**Executing Files & Functions:**
1. **Client**: [`client/src/components/ChatPanel.jsx`](file:///c:/node/SyncCore/client/src/components/ChatPanel.jsx) `handleSendMessage()`
2. **WebSocket Middleware**: [`server/sockets/socket.handler.js`](file:///c:/node/SyncCore/server/sockets/socket.handler.js) `io.use()`
3. **Server Event**: [`server/sockets/socket.handler.js`](file:///c:/node/SyncCore/server/sockets/socket.handler.js) `send_direct_message` / `send_channel_message`
4. **Server Model**: [`server/models/Message.js`](file:///c:/node/SyncCore/server/models/Message.js)

---

### Phase F: Subtask Status Update & Real-Time Analytics Pipeline Update

```mermaid
sequenceDiagram
    autonumber
    actor Member as Assigned Member / Admin
    participant TaskBoard as TaskBoard.jsx
    participant ProjectCtrl as controllers/project.controller.js
    participant AnalyticsCtrl as controllers/analytics.controller.js
    participant AnalyticsPanel as AnalyticsPanel.jsx

    Member->>TaskBoard: Changes Status dropdown from "In Progress" to "Completed"
    TaskBoard->>ProjectCtrl: PATCH /api/projects/:projectId/subtasks/:subtaskId { status: 'Completed' }
    ProjectCtrl->>ProjectCtrl: Permission Guard: verifies req.user is Admin OR Assignee OR Collaborator
    ProjectCtrl->>ProjectCtrl: Sets status = 'Completed' & completedAt = new Date()
    ProjectCtrl-->>TaskBoard: Returns HTTP 200 OK
    TaskBoard->>AnalyticsCtrl: GET /api/teams/:teamId/stats
    AnalyticsCtrl->>AnalyticsCtrl: Runs Aggregation Pipeline ($setUnion + $unwind '$allAssigned')
    AnalyticsCtrl-->>AnalyticsPanel: Returns recalculated Completion Rate % & Per-Member Workload
    AnalyticsPanel->>AnalyticsPanel: Re-renders Radial Chart & Member Efficiency Bars
```

**Executing Files & Functions:**
1. **Client UI Guard**: [`client/src/components/TaskBoard.jsx`](file:///c:/node/SyncCore/client/src/components/TaskBoard.jsx) `handleStatusChange()`
2. **Server Guard & Controller**: [`server/controllers/project.controller.js`](file:///c:/node/SyncCore/server/controllers/project.controller.js) `updateSubtask()`
3. **Analytics Pipeline**: [`server/controllers/analytics.controller.js`](file:///c:/node/SyncCore/server/controllers/analytics.controller.js) `getTeamAnalytics()`
4. **Analytics View**: [`client/src/components/AnalyticsPanel.jsx`](file:///c:/node/SyncCore/client/src/components/AnalyticsPanel.jsx)

---

## 3. Summary Map of Code Locations

| Action | Primary Client File | Primary Server Route / Controller | Database Model |
| :--- | :--- | :--- | :--- |
| **Account Registration** | [`client/src/components/AuthModal.jsx`](file:///c:/node/SyncCore/client/src/components/AuthModal.jsx#L15) | [`server/controllers/auth.controller.js`](file:///c:/node/SyncCore/server/controllers/auth.controller.js#L30) | [`server/models/User.js`](file:///c:/node/SyncCore/server/models/User.js#L46) |
| **Create Workspace** | [`client/src/components/TeamModal.jsx`](file:///c:/node/SyncCore/client/src/components/TeamModal.jsx#L15) | [`server/controllers/team.controller.js`](file:///c:/node/SyncCore/server/controllers/team.controller.js#L20) | [`server/models/Team.js`](file:///c:/node/SyncCore/server/models/Team.js#L20) |
| **Add Member (@handle)** | [`client/src/components/MemberModal.jsx`](file:///c:/node/SyncCore/client/src/components/MemberModal.jsx#L20) | [`server/controllers/team.controller.js`](file:///c:/node/SyncCore/server/controllers/team.controller.js#L110) | [`server/models/Team.js`](file:///c:/node/SyncCore/server/models/Team.js#L3) |
| **Create Subtask** | [`client/src/components/TaskBoard.jsx`](file:///c:/node/SyncCore/client/src/components/TaskBoard.jsx#L80) | [`server/controllers/project.controller.js`](file:///c:/node/SyncCore/server/controllers/project.controller.js#L180) | [`server/models/Project.js`](file:///c:/node/SyncCore/server/models/Project.js#L3) |
| **Real-Time Messages** | [`client/src/components/ChatPanel.jsx`](file:///c:/node/SyncCore/client/src/components/ChatPanel.jsx#L60) | [`server/sockets/socket.handler.js`](file:///c:/node/SyncCore/server/sockets/socket.handler.js#L60) | [`server/models/Message.js`](file:///c:/node/SyncCore/server/models/Message.js#L3) |
| **Analytics Recalculation**| [`client/src/components/AnalyticsPanel.jsx`](file:///c:/node/SyncCore/client/src/components/AnalyticsPanel.jsx#L15) | [`server/controllers/analytics.controller.js`](file:///c:/node/SyncCore/server/controllers/analytics.controller.js#L85) | [`server/models/Project.js`](file:///c:/node/SyncCore/server/models/Project.js#L39) |
