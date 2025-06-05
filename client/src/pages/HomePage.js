import LogoutButton from '../components/LogoutButton';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import BASE_URL from '../config';

export default function HomePage() {
  const navigate = useNavigate();

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
    <h1>User check-in flow completed</h1>
    <LogoutButton />
    </>
  )
}