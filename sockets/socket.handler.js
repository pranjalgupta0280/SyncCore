const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const initSocketIO = (io) => {
  // Socket.io Middleware: Verify JWT handshake authentication
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1] ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication error: No JWT token provided'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'synccore_super_secret_jwt_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error(`Authentication error: ${err.message}`));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] User connected: ${socket.user.name} (@${socket.user.username}) [Socket ID: ${socket.id}]`);

    // Auto-join personal user room for direct messaging (1-on-1 DMs)
    const personalRoom = socket.user._id.toString();
    socket.join(personalRoom);

    // Event 1: Join Team Channel / Workspace Room
    socket.on('join_team', ({ teamId }) => {
      if (teamId) {
        socket.join(teamId);
        console.log(`[Socket.io] User @${socket.user.username} joined team room: ${teamId}`);
      }
    });

    // Event 2: Leave Team Room
    socket.on('leave_team', ({ teamId }) => {
      if (teamId) {
        socket.leave(teamId);
        console.log(`[Socket.io] User @${socket.user.username} left team room: ${teamId}`);
      }
    });

    // Event 3: Send Channel Broadcast Message (Public team message)
    socket.on('send_channel_message', async ({ teamId, content }, callback) => {
      try {
        if (!teamId || !content) {
          if (callback) callback({ success: false, error: 'teamId and content are required' });
          return;
        }

        const message = await Message.create({
          teamId,
          sender: socket.user._id,
          recipient: null,
          content,
        });

        const populatedMsg = await Message.findById(message._id)
          .populate('sender', 'name email username avatarColor');

        // Broadcast to team room
        io.to(teamId).emit('new_channel_message', populatedMsg);

        if (callback) callback({ success: true, data: populatedMsg });
      } catch (error) {
        console.error('[Socket.io Error] send_channel_message:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Event 4: Send 1-on-1 Direct Message (Private message)
    socket.on('send_direct_message', async ({ teamId, recipientId, content }, callback) => {
      try {
        if (!teamId || !recipientId || !content) {
          if (callback) callback({ success: false, error: 'teamId, recipientId, and content are required' });
          return;
        }

        const message = await Message.create({
          teamId,
          sender: socket.user._id,
          recipient: recipientId,
          content,
        });

        const populatedMsg = await Message.findById(message._id)
          .populate('sender', 'name email username avatarColor')
          .populate('recipient', 'name email username avatarColor');

        // Emit to target user's personal room & sender's room
        io.to(recipientId.toString()).emit('new_direct_message', populatedMsg);
        io.to(socket.user._id.toString()).emit('new_direct_message', populatedMsg);

        if (callback) callback({ success: true, data: populatedMsg });
      } catch (error) {
        console.error('[Socket.io Error] send_direct_message:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Event 5: Fetch Chat Message History
    socket.on('fetch_messages', async ({ teamId, recipientId, limit = 50 }, callback) => {
      try {
        let query = { teamId };

        if (recipientId) {
          // Fetch DM history between sender and recipient
          query.$or = [
            { sender: socket.user._id, recipient: recipientId },
            { sender: recipientId, recipient: socket.user._id },
          ];
        } else {
          // Fetch public channel history
          query.recipient = null;
        }

        const messages = await Message.find(query)
          .populate('sender', 'name email username avatarColor')
          .populate('recipient', 'name email username avatarColor')
          .sort({ createdAt: 1 })
          .limit(limit);

        if (callback) callback({ success: true, data: messages });
      } catch (error) {
        console.error('[Socket.io Error] fetch_messages:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Event 6: Live Task Update Broadcast (Real-time Kanban update)
    socket.on('task_update', ({ teamId, projectId, taskAction, taskData }) => {
      if (teamId) {
        socket.to(teamId).emit('task_updated', {
          projectId,
          taskAction, // e.g. 'created', 'updated', 'status_change', 'deleted'
          taskData,
          updatedBy: {
            _id: socket.user._id,
            name: socket.user.name,
            username: socket.user.username,
          },
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = initSocketIO;
