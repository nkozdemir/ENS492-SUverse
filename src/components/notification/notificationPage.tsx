import { NotificationValues } from '@/types/interfaces';
import NotificationCard from '@/components/notification/notificationCard';
import { useState, useEffect } from 'react';

interface NotificationsProps {
  notifications: NotificationValues[];
}

const NotificationsPage: React.FC<NotificationsProps> = ({ notifications }) => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showAll, setShowAll] = useState<boolean>(true);
  const [updatedNotifications, setUpdatedNotifications] = useState<NotificationValues[]>(notifications);

  // Update the notifications when they change
  useEffect(() => {
    setUpdatedNotifications(notifications);
  }, [notifications]);

  const handleToggle = () => {
    setShowAll(prevState => !prevState);
    // Clear selected notifications when toggling between show all and show unread
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prevSelected => {
      if (prevSelected.includes(notificationId)) {
        // If already selected, deselect it
        return prevSelected.filter(id => id !== notificationId);
      } else {
        // Otherwise, select it
        return [...prevSelected, notificationId];
      }
    });
  };

  const handleMarkAsRead = async () => {
    try {
      // Make a POST request to mark selected notifications as read
      await fetch('/api/notifications/makeNotificationsRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notifIds: selectedNotifications }),
      });
      // Update the read status of selected notifications in the UI
      const updatedNotifs = updatedNotifications.map(notification => ({
        ...notification,
        isRead: selectedNotifications.includes(notification.id) ? true : notification.isRead,
      }));
      setUpdatedNotifications(updatedNotifs);
      // Clear selected notifications after marking them as read
      setSelectedNotifications([]);
    } catch (error) {
      //console.error('Error marking notifications as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      // Make a POST request to delete all notifications
      await fetch('/api/notifications/deleteAllNotifications', {
        method: 'DELETE',
      });
      // Update the UI by clearing all notifications
      setUpdatedNotifications([]);
    } catch (error) {
      //console.error('Error clearing all notifications:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length > 0) {
      // If some notifications are selected, deselect all
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(notification => notification.id));
    }
  };

  return (
    <div className="relative">
      <h1 className="font-bold text-2xl mb-4">Notifications</h1>
      <div className="flex flex-col lg:flex-row justify-between mb-4 lg:mb-8">
        <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4'>
          <button onClick={handleSelectAll} className="btn">
            Select All/None
          </button>
          <button onClick={handleMarkAsRead} className="btn">
            Mark As Read
          </button>
          <button onClick={handleClearAll} className="btn btn-error">
            Clear All
          </button>
        </div>
        <label className="flex items-center mt-4 lg:mt-0">
          <div className={`relative w-12 h-6 ${!showAll ? 'bg-blue-600 rounded-full' : 'bg-gray-400 rounded-full'}`}>
            <input
              type="checkbox"
              className="hidden"
              checked={showAll}
              onChange={handleToggle}
            />
            <div className={`toggle__dot absolute top-0 w-6 h-6 bg-white rounded-full shadow-md ${!showAll ? 'left-6' : 'left-0'}`}></div>
          </div>
          <div className="ml-3">{!showAll ? "Show All" : "Show Unread"}</div>
        </label>
      </div>
      <div className="mt-6 space-y-4">
        {updatedNotifications.length === 0 ? (
          <div>You have no notifications.</div>
        ) : (
          updatedNotifications.map(notification => (
            <div key={notification.id}>
              <div className="flex items-center">
                {!notification.isRead && (
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="form-checkbox h-5 w-5 text-blue-500 mr-2"
                  />
                )}
                <div className="w-full">
                  <NotificationCard notification={notification} showAll={showAll}/>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
