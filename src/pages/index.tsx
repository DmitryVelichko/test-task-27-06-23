import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface APIResponse {
  data: User[];
  total_pages: number;
}

const API_URL = 'https://reqres.in/api/users';

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get<APIResponse>(`${API_URL}?page=${page}`);
      const { data, total_pages } = response.data;
      setUsers((prevUsers) => [...prevUsers, ...data]);
      setTotalPages(total_pages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (currentPage < totalPages && !isLoading) {
      window.requestIdleCallback(async () => {
        setCurrentPage((prevPage) => prevPage + 1);
      });
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers(currentPage);
    };
    loadUsers();
  }, [currentPage]);

  return (
    <main className={styles.container}>
      <Head>
        <title>User List</title>
        <meta name='description' content='Displaying the list of users.' />
      </Head>
      <h1 className={styles.title}>User List</h1>
      <div className={styles.userGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
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
        ))}
      </div>

      <button
        onClick={handleLoadMore}
        className={styles.loadMoreButton}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load more'}
      </button>
    </main>
  );
};

export default Home;
