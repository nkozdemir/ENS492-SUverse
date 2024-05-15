import Image from 'next/image';

interface UserProfilePictureProps {
    imageUrl: string;
    size: number;
}

const UserProfilePicture = ({ imageUrl, size }: UserProfilePictureProps) => {
  const defaultImageUrl = '/default-profile-img.png';

  return (
    <div className={`rounded-full overflow-hidden border-primary border-2 p-1`}>
      <Image
        src={imageUrl || defaultImageUrl}
        alt="Profile"
        width={size}
        height={size}
        priority
      />
    </div>
  );
};

export default UserProfilePicture;