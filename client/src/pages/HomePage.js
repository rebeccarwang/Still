import {useEffect, useState} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
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
        <NavLink to='/home' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Home</NavLink>
        <NavLink to='/check-in' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Check In</NavLink>
        <NavLink to='/entries' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Journal Entries</NavLink>
        <NavLink to='/trends' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Trends</NavLink>
        <NavLink to='/preferences' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Preferences</NavLink>
      </>
      )}
    </Layout>
    </>
  )
}