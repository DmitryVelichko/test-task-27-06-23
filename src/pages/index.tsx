import { useEffect, useState, lazy, Suspense } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '@/styles/Home.module.css';

const UserCard = lazy(() => import('../UserCard'));

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

const Home = ({ initialUsers, total_pages }) => {
  const [users, setUsers] = useState<User[]>([...initialUsers]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(total_pages);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoadMore = async () => {
    if (currentPage < totalPages && !isLoading) {
      try {
        setCurrentPage((prevPage) => prevPage + 1);
        setIsLoading(true);
        const response = await axios.get<APIResponse>(
          `${API_URL}?page=${currentPage + 1}`
        );
        const { data, total_pages } = response.data;
        setUsers((prevUsers) => [...prevUsers, ...data]);
        setTotalPages(total_pages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    }
  };

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

export async function getStaticProps() {
  try {
    const response = await axios.get<APIResponse>(`${API_URL}?page=1`);
    const { data, total_pages } = response.data;
    const initialUsers = data.slice(0, 6);
    return {
      props: {
        initialUsers,
        total_pages,
      },
    };
  } catch (error) {
    console.error('Error fetching initial users:', error);
    return {
      props: {
        initialUsers: [],
      },
    };
  }
}

export default Home;
