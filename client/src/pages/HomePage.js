import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import BASE_URL from '../config';
import Layout from '../components/Layout'

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);

  // redirects user to /check-in page if user has not yet made a mood entry during this session
  useEffect(() => {
    const fetchHome = async() => {
      try {
        const res = await fetch(`${BASE_URL}/api/has-checked-in/home`, {
          credentials: 'include'
        });

        if (!res.ok) {
          navigate('/check-in');
        }
        setLoading(false);
      }
      catch (err) {
        console.log('Error:', err);
        navigate('/check-in');
      }

    }
    fetchHome();
  });

  return (
    <>
    <Layout>
    {!isLoading &&
      (<>
        <h1>User check-in flow completed</h1>
      </>
      )}
    </Layout>
    </>
  )
}