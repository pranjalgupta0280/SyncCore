# 🎣 How Hooks Work in Task Management & Controller Architecture (SyncCore)

This document provides a technical breakdown of how **Hooks** are utilized in SyncCore across both the **Backend Controllers & Database Models** and the **Frontend React Task Management Components**.

---

## 1. Backend Mongoose Database Hooks (Server-Side)

In Node.js + Express with Mongoose, **Hooks** (also called Middleware Hooks) are functions that execute automatically before or after specific database operations like `save`, `validate`, or `deleteOne`.

### A. Pre-Save Hook (`User.js`)
In [server/models/User.js](file:///c:/node/SyncCore/server/models/User.js#L46):

```javascript
// Pre-save hook: Automatically runs BEFORE a user document is saved to MongoDB
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

- **Why it matters**: In Mongoose v6+, `async` pre-hooks do **not** take a `next` parameter or call `next()`. Returning a promise or completing the `async` function signals Mongoose to proceed to save.

---

## 2. Frontend Task Controller Hooks (React Client-Side)

On the client side, the task controller component ([client/src/components/TaskBoard.jsx](file:///c:/node/SyncCore/client/src/components/TaskBoard.jsx)) relies on several React Hooks:

### A. Custom Context Hooks (`useAuth` & `useTeam`)
Instead of passing props through 10 levels of components ("prop drilling"), we use custom hooks:

```javascript
const { user } = useAuth();
const { activeTeam, projects, activeProject, setActiveProject, fetchProjects, fetchAnalytics } = useTeam();
```

- **`useTeam()`**: Exposes global workspace state, selected active project, and async fetch methods to any task sub-component.

---

### B. State Hooks (`useState`)
Used for controlled form inputs, modal dialogs, and permission errors:

```javascript
const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
const [subtaskTitle, setSubtaskTitle] = useState('');
const [subtaskAssignee, setSubtaskAssignee] = useState(''); // Single Primary Assignee
const [subtaskCollaborators, setSubtaskCollaborators] = useState([]); // Array of Member IDs
```

- **Controlled State Mutation**: When toggling a collaborator in a task, an immutable array handler updates state:

```javascript
const handleToggleCollaborator = (userId) => {
  if (subtaskCollaborators.includes(userId)) {
    setSubtaskCollaborators(subtaskCollaborators.filter((id) => id !== userId));
  } else {
    setSubtaskCollaborators([...subtaskCollaborators, userId]);
  }
};
```

---

### C. Effect Hooks (`useEffect`) & WebSocket Listeners
Used in `TeamContext.jsx` and `TaskBoard.jsx` to synchronize API calls and Socket.io broadcasts:

```javascript
useEffect(() => {
  if (activeTeam) {
    fetchProjects(activeTeam._id);
    fetchAnalytics(activeTeam._id);

    const socket = getSocket();
    if (socket) {
      // Joins WebSocket room for live task updates
      socket.emit('join_team', { teamId: activeTeam._id });
    }
  }
}, [activeTeam]);
```

- **Real-Time Task Sync**: When an admin or assignee updates a task status, the backend emits `task_updated`. The `useEffect` hook listens to this event and updates the Kanban board live across all connected devices!

---

## 3. Summary of Hooks Used

| Hook Type | Location | Purpose |
| :--- | :--- | :--- |
| **Mongoose Pre-Save Hook** | `server/models/User.js` | Hashes passwords before saving |
| **Custom Context Hook (`useTeam`)** | `client/src/components/TaskBoard.jsx` | Accesses active project & team state |
| **State Hook (`useState`)** | `client/src/components/TaskBoard.jsx` | Manages subtask form inputs & modals |
| **Effect Hook (`useEffect`)** | `client/src/context/TeamContext.jsx` | Re-fetches task projects when active team changes |
