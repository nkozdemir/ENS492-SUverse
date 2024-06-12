import { NotificationValues } from '@/types/interfaces';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { NotificationType } from '@/types/interfaces';
import { FaCircle } from 'react-icons/fa';
import { FiCircle } from 'react-icons/fi';
import UserProfilePicture from '../userProfilePicture';

interface NotificationCardProps {
  notification: NotificationValues;
  showAll: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, showAll }) => {
  const renderContent = () => {
    switch (notification.type) {
      case NotificationType.FOLLOW:
        return (
          <span className="text-sm">started following you</span>
        );
      case NotificationType.POSTLIKE:
        return (
          <span className="text-sm">
            liked your <Link href={`/post/${notification.postId}`}><span className="font-semibold">post</span></Link>
          </span>
          );
      case NotificationType.COMMENTLIKE:
        return (
          <span className="text-sm">
            liked your <Link href={`/post/${notification.postId}`}><span className="font-semibold">comment</span></Link>
            <span>  &quot;{notification.comment?.content}&quot; :</span>
          </span>
        );
      case NotificationType.POSTREPLY:
        return (
          <span className="text-sm">
            replied to your <Link href={`/post/${notification.postId}`}><span className="font-semibold">post</span></Link>:
          </span>
        );
      case NotificationType.COMMENTREPLY:
        return (
          <span className="text-sm">
            replied to your <Link href={`/post/${notification.postId}`}><span className="font-semibold">comment</span></Link>
            <span>  &quot;{notification.comment?.parent?.content}&quot; :</span>
          </span>
            
        );
      default:
        return '';
    }
  };

  const renderContentBox = (content: string) => {
    return (
      <div className="bg-base-200 p-2 mt-2 rounded-md">
        <span className="text-sm">{content}</span>
      </div>
    );
  };

  // Filter notifications based on showAll state
  if (!showAll && notification.isRead) {
    return null;
  }

  return (
    <div className={`bg-base-100 shadow-lg rounded-lg p-2 ${notification.isRead ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href={`/user/${notification.notifierId}`}>
            <UserProfilePicture imageUrl={notification.notifier.profilePic} size={50} />
          </Link>
          <div>
            <Link href={`/user/${notification.notifierId}`}>
              <span className="font-semibold">{notification.notifier.name}</span>
              <span className="text-gray-500 text-sm"> @{notification.notifier.username}</span>
            </Link>
            <span className="text-gray-500 text-sm mx-1"> ~ </span>
            {renderContent()}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!notification.isRead? <FaCircle className="text-blue-500" /> : <FiCircle className="text-gray-500" />}
          <span className="text-gray-500 text-sm">{formatDate(notification.createdAt)}</span>
        </div>
      </div>
      {(notification.type === NotificationType.COMMENTREPLY || notification.type === NotificationType.POSTREPLY) && 
          renderContentBox(notification.comment?.content as string)}
    </div>
  );
};

export default NotificationCard;