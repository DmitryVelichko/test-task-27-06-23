import { useEffect, useState, lazy, Suspense } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '@/styles/Home.module.css';

const UserCard = lazy(() => import('./UserCard'));

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
        <Suspense>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </Suspense>
      </div>

      <button
        onClick={handleLoadMore}
        className={
          currentPage < totalPages && !isLoading
            ? styles.loadMoreButton
            : styles.loadDisabledButton
        }
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load more'}
      </button>
    </main>
  );
};

export default Home;
