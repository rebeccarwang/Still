import LogoutButton from '../components/LogoutButton';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  // redirects user to /check-in page if user has not yet made a mood entry during this session
  useEffect(() => {
    const fetchHome = async() => {
      try {
        const res = await fetch('http://localhost:8080/api/has-checked-in/home', {
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