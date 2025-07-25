import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { notificationsApi, Notification as ApiNotification } from '../services/notificationsApi';
import { socketEvents, isSocketReady } from '../services/socketService';

export interface Notification {
  id: string;
  type: 'friend_request' | 'like' | 'comment' | 'system';
  message: string;
  timestamp: number;
  read: boolean;
  userId?: string; // ID of the user who triggered the notification
  postId?: string; // ID of the post related to the notification
  avatar?: string | { url: string; publicId?: string }; // Avatar of the user who triggered the notification
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotificationPanel: boolean;
  setShowNotificationPanel: (show: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  clearNotification: (id: string) => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Debounce function to limit frequent updates
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  // Use refs to avoid unnecessary re-renders
  const notificationsRef = useRef<Notification[]>(notifications);
  notificationsRef.current = notifications;
  
  // Update unread count efficiently without re-rendering the entire context
  const updateUnreadCount = useCallback(() => {
    const count = notificationsRef.current.filter(n => !n.read).length;
    setUnreadCount(count);
  }, []);
  
  // Debounced version of setNotifications to prevent rapid re-renders
  const debouncedSetNotifications = useCallback(
    debounce((newNotifications: Notification[]) => {
      setNotifications(newNotifications);
      // Update unread count after notifications are updated
      const count = newNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
    }, 50),
    []
  );

  // Convert API notification to frontend notification format - memoized
  const convertApiNotification = useCallback((apiNotif: any): Notification => {
    let message = '';
    let type: Notification['type'] = 'system';

    // Handle the notification type
    switch (apiNotif.type) {
      case 'friend_request':
        message = `${apiNotif.sender.name} sent you a friend request`;
        type = 'friend_request';
        break;
      case 'friend_accepted':
        message = `${apiNotif.sender.name} accepted your friend request`;
        type = 'friend_request';
        break;
      case 'like':
        if (apiNotif.post) {
          message = `${apiNotif.sender.name} liked your post`;
        } else {
          message = `${apiNotif.sender.name} liked your profile`;
        }
        type = 'like';
        break;
      case 'comment':
        message = `${apiNotif.sender.name} commented on your post`;
        type = 'comment';
        break;
      default:
        // If there's a content field in the notification, use it
        message = apiNotif.content 
          ? `${apiNotif.sender.name} ${apiNotif.content}`
          : 'You have a new notification';
        type = 'system';
    }

    return {
      id: apiNotif.id,
      type,
      message,
      timestamp: apiNotif.createdAt instanceof Date 
        ? apiNotif.createdAt.getTime() 
        : new Date(apiNotif.createdAt).getTime(),
      read: apiNotif.read,
      userId: apiNotif.sender.id,
      postId: apiNotif.post?.id || apiNotif.post,
      avatar: apiNotif.sender.avatar
    };
  }, []);

  // Fetch notifications from backend - memoized
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('Fetching notifications from backend...');
      const apiNotifications = await notificationsApi.getNotifications();
      const convertedNotifications = apiNotifications.map(convertApiNotification);
      
      // Use debounced update to prevent UI lag
      debouncedSetNotifications(convertedNotifications);
      
      console.log('Fetched notifications:', convertedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user, convertApiNotification, debouncedSetNotifications]);

  // Load notifications from backend on initial render and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      debouncedSetNotifications([]);
    }
  }, [user, fetchNotifications, debouncedSetNotifications]);

  // Refresh notifications - memoized
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark a notification as read - memoized
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      
      // Update locally without causing a full re-render
      const updatedNotifications = notificationsRef.current.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      
      debouncedSetNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [debouncedSetNotifications]);

  // Mark all notifications as read - memoized
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      
      const updatedNotifications = notificationsRef.current.map(notif => ({ ...notif, read: true }));
      debouncedSetNotifications(updatedNotifications);
      setUnreadCount(0); // Directly set to 0 for immediate UI feedback
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [debouncedSetNotifications]);

  // Add a new notification (for real-time updates) - memoized
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    // Update with the new notification prepended
    const updatedNotifications = [newNotification, ...notificationsRef.current];
    debouncedSetNotifications(updatedNotifications);
    
    // Immediately update unread count for better UX
    setUnreadCount(prev => prev + 1);
  }, [debouncedSetNotifications]);

  // Clear a notification - memoized
  const clearNotification = useCallback(async (id: string) => {
    try {
      // Start API call but don't wait for it
      const apiPromise = notificationsApi.deleteNotification(id);
      
      // Update UI immediately
      const wasUnread = notificationsRef.current.find(n => n.id === id)?.read === false;
      const updatedNotifications = notificationsRef.current.filter(notif => notif.id !== id);
      debouncedSetNotifications(updatedNotifications);
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Wait for API call to complete in background
      await apiPromise;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [debouncedSetNotifications]);

  // Socket event handlers - created once and stored in refs
  const handlersRef = useRef({
    handleFriendRequest: (data: any) => {
      if (!user || !data.fromUser) return;
      
      console.log('NotificationContext: Adding friend request notification for user:', user.id);
      addNotification({
        type: 'friend_request',
        message: `${data.fromUser.name} sent you a friend request`,
        userId: data.fromUser.id,
        avatar: data.fromUser.avatar
      });
    },
    
    handleFriendAccept: (data: any) => {
      if (!user || !data.fromUser) return;
      
      console.log('NotificationContext: Adding friend accept notification for user:', user.id);
      addNotification({
        type: 'friend_request',
        message: `${data.fromUser.name} accepted your friend request`,
        userId: data.fromUser.id,
        avatar: data.fromUser.avatar
      });
    },
    
    handlePostLike: (data: any) => {
      if (!user || !data.fromUser || !data.postId) return;
      
      addNotification({
        type: 'like',
        message: `${data.fromUser.name} liked your post`,
        userId: data.fromUser.id,
        postId: data.postId,
        avatar: data.fromUser.avatar
      });
    },
    
    handlePostComment: (data: any) => {
      if (!user || !data.fromUser || !data.postId) return;
      
      addNotification({
        type: 'comment',
        message: `${data.fromUser.name} commented on your post`,
        userId: data.fromUser.id,
        postId: data.postId,
        avatar: data.fromUser.avatar
      });
    }
  });

  // Update handler references when dependencies change
  useEffect(() => {
    handlersRef.current = {
      handleFriendRequest: (data: any) => {
        if (!user || !data.fromUser) return;
        
        console.log('NotificationContext: Adding friend request notification for user:', user.id);
        addNotification({
          type: 'friend_request',
          message: `${data.fromUser.name} sent you a friend request`,
          userId: data.fromUser.id,
          avatar: data.fromUser.avatar
        });
      },
      
      handleFriendAccept: (data: any) => {
        if (!user || !data.fromUser) return;
        
        console.log('NotificationContext: Adding friend accept notification for user:', user.id);
        addNotification({
          type: 'friend_request',
          message: `${data.fromUser.name} accepted your friend request`,
          userId: data.fromUser.id,
          avatar: data.fromUser.avatar
        });
      },
      
      handlePostLike: (data: any) => {
        if (!user || !data.fromUser || !data.postId) return;
        
        addNotification({
          type: 'like',
          message: `${data.fromUser.name} liked your post`,
          userId: data.fromUser.id,
          postId: data.postId,
          avatar: data.fromUser.avatar
        });
      },
      
      handlePostComment: (data: any) => {
        if (!user || !data.fromUser || !data.postId) return;
        
        addNotification({
          type: 'comment',
          message: `${data.fromUser.name} commented on your post`,
          userId: data.fromUser.id,
          postId: data.postId,
          avatar: data.fromUser.avatar
        });
      }
    };
  }, [user, addNotification]);

  // Listen for socket events - optimized to reduce re-renders
  useEffect(() => {
    if (!user) return;
    
    let retryCount = 0;
    const maxRetries = 5;
    let timer: ReturnType<typeof setTimeout>;

    // Set up socket event listeners with retry mechanism
    const setupSocketListeners = () => {
      console.log('NotificationContext: Setting up socket event listeners (attempt:', retryCount + 1, ')');
      if (!isSocketReady()) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('NotificationContext: Max retries reached, giving up on socket setup');
          return;
        }
        console.log('NotificationContext: Socket not ready, retrying in 1 second... (retry', retryCount, 'of', maxRetries, ')');
        timer = setTimeout(setupSocketListeners, 1000);
        return;
      }
      
      // Test socket connection
      socketEvents.testConnection();
      
      try {
        // Use the handlers from ref to avoid recreation
        socketEvents.onFriendRequest((data: any) => handlersRef.current.handleFriendRequest(data));
        socketEvents.onFriendAccept((data: any) => handlersRef.current.handleFriendAccept(data));
        socketEvents.onPostLike((data: any) => handlersRef.current.handlePostLike(data));
        socketEvents.onPostComment((data: any) => handlersRef.current.handlePostComment(data));
        
        console.log('NotificationContext: Socket event listeners set up successfully');
      } catch (error) {
        console.error('NotificationContext: Failed to set up socket listeners:', error);
        // Retry after a short delay
        timer = setTimeout(setupSocketListeners, 1000);
      }
    };

    // Wait a bit for socket to be initialized
    timer = setTimeout(setupSocketListeners, 2000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.log('NotificationContext: Cleaning up socket event listeners');
      // Note: Socket.io automatically removes listeners when component unmounts
    };
  }, [user]); // Only depend on user to avoid unnecessary re-renders

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    notifications,
    unreadCount,
    showNotificationPanel,
    setShowNotificationPanel,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotification,
    refreshNotifications
  }), [
    notifications,
    unreadCount,
    showNotificationPanel,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotification,
    refreshNotifications
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
