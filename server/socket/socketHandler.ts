import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Store active connections
const activeConnections = new Map();

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("+role");

    if (!user || !user.isActive) {
      return next(new Error("Authentication error: Invalid user"));
    }

    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

const socketHandler = (socket) => {
  console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);

  // Store active connection
  activeConnections.set(socket.userId, {
    socketId: socket.id,
    user: socket.user,
    connectedAt: new Date(),
  });

  // Join user to their personal room for notifications
  socket.join(`user_${socket.userId}`);

  // Send current online users count
  socket.emit("onlineUsers", {
    count: activeConnections.size,
    users: Array.from(activeConnections.values()).map((conn) => ({
      userId: conn.user._id,
      username: conn.user.username,
      profilePicture: conn.user.profilePicture,
    })),
  });

  // Broadcast user online status
  socket.broadcast.emit("userOnline", {
    userId: socket.userId,
    username: socket.user.username,
    profilePicture: socket.user.profilePicture,
  });

  // Handle joining post rooms for real-time updates
  socket.on("joinPost", (postId) => {
    socket.join(`post_${postId}`);
    console.log(`📍 User ${socket.user.username} joined post room: ${postId}`);
  });

  // Handle leaving post rooms
  socket.on("leavePost", (postId) => {
    socket.leave(`post_${postId}`);
    console.log(`📍 User ${socket.user.username} left post room: ${postId}`);
  });

  // Handle real-time typing indicators for comments
  socket.on("startTyping", (data) => {
    socket.to(`post_${data.postId}`).emit("userTyping", {
      userId: socket.userId,
      username: socket.user.username,
      postId: data.postId,
    });
  });

  socket.on("stopTyping", (data) => {
    socket.to(`post_${data.postId}`).emit("userStoppedTyping", {
      userId: socket.userId,
      postId: data.postId,
    });
  });

  // Handle private messaging
  socket.on("sendMessage", (data) => {
    const { recipientId, message, type = "text" } = data;

    // Send message to recipient if they're online
    const recipientConnection = activeConnections.get(recipientId);
    if (recipientConnection) {
      socket.to(recipientConnection.socketId).emit("newMessage", {
        from: {
          userId: socket.userId,
          username: socket.user.username,
          profilePicture: socket.user.profilePicture,
        },
        message,
        type,
        timestamp: new Date(),
      });
    }

    // Send confirmation to sender
    socket.emit("messageSent", {
      recipientId,
      message,
      type,
      timestamp: new Date(),
      delivered: !!recipientConnection,
    });
  });

  // Handle notification events
  socket.on("markNotificationRead", (notificationId) => {
    // Mark notification as read in database
    // This would typically update the notification model
    socket.emit("notificationRead", { notificationId });
  });

  // Handle live view tracking
  socket.on("viewingPost", (data) => {
    const { postId, startTime } = data;
    socket.currentlyViewing = {
      postId,
      startTime: startTime || Date.now(),
    };

    // Broadcast viewing activity to post room
    socket.to(`post_${postId}`).emit("userViewingPost", {
      userId: socket.userId,
      username: socket.user.username,
      postId,
    });
  });

  socket.on("stopViewingPost", (data) => {
    const { postId } = data;

    if (socket.currentlyViewing && socket.currentlyViewing.postId === postId) {
      const viewDuration = Date.now() - socket.currentlyViewing.startTime;

      // Broadcast stop viewing to post room
      socket.to(`post_${postId}`).emit("userStoppedViewingPost", {
        userId: socket.userId,
        postId,
        viewDuration,
      });

      socket.currentlyViewing = null;
    }
  });

  // Handle admin notifications
  socket.on("joinAdminRoom", () => {
    if (["admin", "manager"].includes(socket.user.role)) {
      socket.join("admin_room");
      console.log(`👑 Admin ${socket.user.username} joined admin room`);
    }
  });

  // Handle follow notifications
  socket.on("userFollowed", (data) => {
    const { followedUserId } = data;
    const followedConnection = activeConnections.get(followedUserId);

    if (followedConnection) {
      socket.to(followedConnection.socketId).emit("newFollower", {
        follower: {
          userId: socket.userId,
          username: socket.user.username,
          profilePicture: socket.user.profilePicture,
        },
        timestamp: new Date(),
      });
    }
  });

  // Handle like notifications
  socket.on("postLiked", (data) => {
    const { postId, postAuthorId } = data;

    if (postAuthorId !== socket.userId) {
      const authorConnection = activeConnections.get(postAuthorId);

      if (authorConnection) {
        socket.to(authorConnection.socketId).emit("postLikeNotification", {
          postId,
          likedBy: {
            userId: socket.userId,
            username: socket.user.username,
            profilePicture: socket.user.profilePicture,
          },
          timestamp: new Date(),
        });
      }
    }
  });

  // Handle comment notifications
  socket.on("postCommented", (data) => {
    const { postId, postAuthorId, comment } = data;

    if (postAuthorId !== socket.userId) {
      const authorConnection = activeConnections.get(postAuthorId);

      if (authorConnection) {
        socket.to(authorConnection.socketId).emit("postCommentNotification", {
          postId,
          comment,
          commentedBy: {
            userId: socket.userId,
            username: socket.user.username,
            profilePicture: socket.user.profilePicture,
          },
          timestamp: new Date(),
        });
      }
    }
  });

  // Handle heartbeat for connection monitoring
  socket.on("heartbeat", () => {
    socket.emit("heartbeat-ack");
  });

  // Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log(`❌ User disconnected: ${socket.user.username} (${reason})`);

    // Remove from active connections
    activeConnections.delete(socket.userId);

    // Broadcast user offline status
    socket.broadcast.emit("userOffline", {
      userId: socket.userId,
      username: socket.user.username,
    });

    // Broadcast updated online users count
    socket.broadcast.emit("onlineUsers", {
      count: activeConnections.size,
      users: Array.from(activeConnections.values()).map((conn) => ({
        userId: conn.user._id,
        username: conn.user.username,
        profilePicture: conn.user.profilePicture,
      })),
    });

    // If user was viewing a post, notify others
    if (socket.currentlyViewing) {
      socket
        .to(`post_${socket.currentlyViewing.postId}`)
        .emit("userStoppedViewingPost", {
          userId: socket.userId,
          postId: socket.currentlyViewing.postId,
          viewDuration: Date.now() - socket.currentlyViewing.startTime,
        });
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error(`Socket error for user ${socket.user.username}:`, error);
  });
};

// Utility functions for emitting to specific users/rooms
const emitToUser = (userId, event, data) => {
  const connection = activeConnections.get(userId);
  if (connection && connection.socketId) {
    socket.to(connection.socketId).emit(event, data);
    return true;
  }
  return false;
};

const emitToAdmins = (event, data) => {
  socket.to("admin_room").emit(event, data);
};

const getOnlineUsers = () => {
  return Array.from(activeConnections.values()).map((conn) => ({
    userId: conn.user._id,
    username: conn.user.username,
    profilePicture: conn.user.profilePicture,
    connectedAt: conn.connectedAt,
  }));
};

const getOnlineUsersCount = () => {
  return activeConnections.size;
};

// Export the handler and utilities

export {
  socketHandler,
  emitToUser,
  emitToAdmins,
  getOnlineUsers,
  getOnlineUsersCount,
  activeConnections,
};
