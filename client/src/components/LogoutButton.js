import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../hooks/AuthContext';
import BASE_URL from '../config';

  export default function LogoutButton() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const logoutUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        }
        )

        if (res.ok) {
          logout();
          navigate('/');
        }
        else {
          const resJson = await res.json();
          setServerError(resJson.error || 'Something went wrong');
          return;
        }
      }
      catch (err) {
        console.log('Error:', err);
        setServerError('Something went wrong- try again later');
      }
    }
    return (
      <>
      <button onClick={logoutUser}>Logout</button>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      </>
    )
  }
