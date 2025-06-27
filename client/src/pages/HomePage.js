import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import BASE_URL from '../config';
import Layout from '../components/Layout';
import {Chip} from '@mui/material';

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // redirects user to /check-in page if user has not yet made a mood entry during this session
  useEffect(() => {
    const fetchHome = async() => {
      try {
        const res = await fetch(`${BASE_URL}/api/has-checked-in/home`, {
          credentials: 'include'
        });

        if (res.status === 429) {
          const resJson = await res.json();
          setErrorMessage(resJson.error || 'Something went wrong');
        }

        else if (!res.ok) {
          navigate('/check-in');
        }
        else {
          setLoading(false);
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
    <Layout>
    {!isLoading && !errorMessage &&
      (<>
        <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>What would you like to do today?</h1>
        <div className='grid grid-cols-4 gap-x-2 gap-y-3 pt-2'>
        <Chip
          sx={{
            backgroundColor: '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='Check In'
          onClick={() => navigate('/check-in')}
          className='col-start-1'
        />
        <Chip
          sx={{
            backgroundColor: '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='View Entries'
          onClick={() => navigate('/entries')}
          className='col-start-2'
        />
        <Chip
          sx={{
            backgroundColor: '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='View Trends'
          onClick={() => navigate('/trends')}
          className='col-start-3'
        />
        <Chip
          sx={{
            backgroundColor: '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='Update Preferences'
          onClick={() => navigate('/preferences')}
          className='col-start-4'
        />
        </div>
      </>
      )}
      {errorMessage && <p className='absolute text-red-500 text-center'>{errorMessage}</p>}
    </Layout>
    </>
  )
}