import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export default function MoodCheckInPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const moods = [{emoji: "😄", score: 5},
    {emoji: "🙂", score: 4},
    {emoji: "😐", score: 3},
    {emoji: "😕", score: 2},
    {emoji: "😔", score: 1}]


  // user logout functionality
  const logoutUser = async (user) => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }
      )

      if (res.ok) {
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
    <h1>Welcome, {user.firstName}!</h1>
    <h2>How are you feeling today?</h2>
    {moods.map(mood => (
      <button>{mood.emoji}</button>
    ))}
    <br/>
    <button onClick={logoutUser}>Logout</button>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </>
  );
}