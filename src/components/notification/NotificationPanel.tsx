import React, { useRef, useEffect, useCallback, memo, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Trash2, UserPlus, Heart } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import Button from '../ui/Button';
import { getAvatarUrl } from '../../utils/avatarUtils';

// Extremely lightweight notification item component
const NotificationItem = memo(({ 
  notification, 
  onNotificationClick, 
  onClearNotification 
}: { 
  notification: Notification; 
  onNotificationClick: (notification: Notification) => void;
  onClearNotification: (id: string) => void;
}) => {
  // Memoize the click handler to prevent recreation on each render
  const handleClick = useCallback(() => {
    onNotificationClick(notification);
  }, [notification, onNotificationClick]);
  
  // Memoize the clear handler
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClearNotification(notification.id);
  }, [notification.id, onClearNotification]);

  // Get notification icon based on type - memoized
  const notificationIcon = useMemo(() => {
    switch (notification.type) {
      case 'friend_request': return <UserPlus size={16} className="text-blue-500" />;
      case 'like': return <Heart size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  }, [notification.type]);
  
  // Format the timestamp once and memoize it
  const formattedTime = useMemo(() => 
    formatDistanceToNow(notification.timestamp, { addSuffix: true }),
    [notification.timestamp]
  );

  // Memoize the avatar URL to prevent recalculation
  const avatarUrl = useMemo(() => 
    notification.avatar ? getAvatarUrl(notification.avatar, 'User') : null,
    [notification.avatar]
  );
  
  // Use CSS classes for performance instead of conditional rendering where possible
  const unreadClass = notification.read ? '' : 'bg-blue-500/10 dark:bg-blue-500/10';
  
  return (
    <div
      className={`flex items-start p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer ${unreadClass}`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mx-2 mt-1">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User"
            className="w-10 h-10 rounded-full object-cover shadow-sm"
            loading="lazy"
            width="40"
            height="40"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
            {notificationIcon}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formattedTime}
        </p>
      </div>
      <button
        onClick={handleClear}
        className="ml-2 p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Delete notification"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Minimal animation variants - almost no animation for better performance
const panelVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.15 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

// Virtualized notification list component
const VirtualizedNotificationList = memo(({ 
  notifications,
  onNotificationClick,
  onClearNotification
}: { 
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onClearNotification: (id: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  // Update visible items on scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    const itemHeight = 68; // Approximate height of each notification item
    
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(clientHeight / itemHeight) + 2; // +2 for buffer
    const end = Math.min(start + visibleCount, notifications.length);
    
    setVisibleRange({ start: Math.max(0, start - 2), end }); // -2 for buffer above
  }, [notifications.length]);
  
  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Calculate total height to maintain proper scrollbar
  const totalHeight = notifications.length * 68; // 68px per item
  
  // Calculate items to render
  const itemsToRender = useMemo(() => {
    return notifications
      .slice(visibleRange.start, visibleRange.end)
      .map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onNotificationClick={onNotificationClick}
          onClearNotification={onClearNotification}
        />
      ));
  }, [notifications, visibleRange, onNotificationClick, onClearNotification]);
  
  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto overscroll-contain"
      style={{ maxHeight: 'calc(85vh - 74px)' }}
    >
      {notifications.length > 0 ? (
        <>
          <div style={{ height: visibleRange.start * 68 }} />
          {itemsToRender}
          <div style={{ height: Math.max(0, totalHeight - (visibleRange.end * 68)) }} />
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-3">
            <Bell size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No new notifications</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            We'll let you know when something new happens.
          </p>
        </div>
      )}
    </div>
  );
});

VirtualizedNotificationList.displayName = 'VirtualizedNotificationList';

const NotificationPanel: React.FC = () => {
  const {
    notifications,
    unreadCount,
    showNotificationPanel,
    setShowNotificationPanel,
    markAsRead,
    markAllAsRead,
    clearNotification
  } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  // Memoized handler for closing the panel
  const closePanel = useCallback(() => {
    setShowNotificationPanel(false);
  }, [setShowNotificationPanel]);

  // Memoized handler for marking all as read
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Close panel on outside click or Esc key
  useEffect(() => {
    if (!showNotificationPanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEsc, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEsc, true);
    };
  }, [showNotificationPanel, closePanel]);
  
  // Memoized handler for notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    markAsRead(notification.id);
    if (notification.type === 'friend_request' && notification.userId) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'friends', tab: 'requests' } }));
    } else if (notification.type === 'like' && notification.postId) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
    }
    closePanel();
  }, [markAsRead, closePanel]);

  // Memoized handler for clearing notification
  const handleClearNotification = useCallback((id: string) => {
    clearNotification(id);
  }, [clearNotification]);
  
  // Defer rendering until needed
  useEffect(() => {
    if (showNotificationPanel && !isRendered) {
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => {
        setIsRendered(true);
      });
    } else if (!showNotificationPanel && isRendered) {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showNotificationPanel, isRendered]);
  
  // Don't render anything if panel is not shown and not in exit animation
  if (!showNotificationPanel && !isRendered) {
    return null;
  }

  // Find or create portal root
  let portalRoot = typeof document !== 'undefined' ? document.getElementById('notification-portal') : null;
  
  if (!portalRoot && typeof document !== 'undefined') {
    portalRoot = document.createElement('div');
    portalRoot.id = 'notification-portal';
    document.body.appendChild(portalRoot);
  }

  if (!portalRoot) {
    return null;
  }
  
  const modalContent = (
    <AnimatePresence mode="wait">
      {(showNotificationPanel || isRendered) && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24">
          {/* Overlay - simplified for performance */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closePanel}
          />
          
          {/* Modal */}
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            style={{ maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck size={16} className="mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePanel}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full"
                  aria-label="Close"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Virtualized notification list */}
            <VirtualizedNotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onClearNotification={handleClearNotification}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  
  return ReactDOM.createPortal(modalContent, portalRoot);
};

export default memo(NotificationPanel);
