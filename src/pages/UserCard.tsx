import { FC } from 'react';
import styles from '@/styles/UserCard.module.css';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UserCard: FC<{ user: User }> = ({ user }) => {
  if (!user) {
  
    return <div>Loading user data...</div>;
  }
  return (
    <div className={styles.userCard}>
      <Image
        width={60}
        height={60}
        src={user.avatar}
        alt={`Avatar of ${user.first_name} ${user.last_name}`}
        className={styles.userAvatar}
      />

      <div className={styles.userDetails}>
        <p className={styles.userID}>{user.id}</p>
        <p className={styles.userEmail}>{user.email}</p>
        <p className={styles.userName}>
          {user.first_name} {user.last_name}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
