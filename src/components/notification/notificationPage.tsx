import { NotificationValues } from '@/types/interfaces';
import NotificationCard from '@/components/notification/notificationCard';
import { useState } from 'react';

interface NotificationsProps {
  notifications: NotificationValues[];
}

const NotificationsPage: React.FC<NotificationsProps> = ({ notifications }) => {
  const [showAll, setShowAll] = useState<boolean>(true);

  const handleToggle = () => {
    setShowAll(prevState => !prevState);
  };

  return (
    <div>
      <h1 className="font-bold text-2xl my-8">Notifications</h1>
      <div className="flex justify-end mb-4">
        <label className="flex items-center cursor-pointer">
          <div className={`relative w-12 h-6 ${!showAll ? 'bg-blue-600 rounded-full' : 'bg-gray-400 rounded-full'}`}>
            <input
              type="checkbox"
              className="hidden"
              checked={showAll}
              onChange={handleToggle}
            />
            <div className={`toggle__dot absolute w-6 h-6 bg-white rounded-full shadow-md ${!showAll ? 'left-6' : 'left-0'}`}></div>
          </div>
          <div className="ml-3 text-gray-700">{!showAll? "Show All" : "Show Unread"}</div>
        </label>
      </div>
      {notifications.map(notification => (
        <NotificationCard key={notification.id} notification={notification} showAll={showAll}/>
      ))}
    </div>
  );
};

export default NotificationsPage;
