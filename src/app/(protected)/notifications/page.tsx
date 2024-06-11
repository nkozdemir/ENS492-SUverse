"use client";

import { NotificationValues } from '@/types/interfaces';
import { useEffect, useState } from 'react';

import NotificationsPage from '../../../components/notification/notificationPage';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationValues[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        //console.log('Fetching all notifications');
        const response = await fetch('/api/notifications/get/getAllNotifications');
        const data = await response.json();
        //console.log('Fetch all notifications response:', data);
        if (data.status === 200) {
          setNotifications(data.data);
        } else {
          //console.error('Failed to fetch notifications');
        }
      } catch (error) {
        //console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <NotificationsPage notifications={notifications} />
    </div>
  );
};

export default Notifications;
