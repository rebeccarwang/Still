import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import LogoutButton from '../components/LogoutButton';

export default function MoodCheckInPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [serverError, setServerError] = useState('');

  const moods = [{emoji: "😄", score: 5},
    {emoji: "🙂", score: 4},
    {emoji: "😐", score: 3},
    {emoji: "😕", score: 2},
    {emoji: "😔", score: 1}]


  // direct user to different page based on user's selected mood
  function getNextRoute(score) {
    if (score === 1 || score === 2) {
      return '/options';
    }

    else if (score === 3) {
      return '/journal?prompt=neutral';
    }

    else {
      return '/journal?prompt=high';
    }
  }

  async function handleSubmitMood() {
    if (!selectedMood) {
      setServerError('Please pick a mood.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/mood-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({score: selectedMood}),
        credentials: 'include'
      });

      if (!res.ok) {
        const resJson = await res.json();
        setServerError(resJson.error || 'Something went wrong');
        return;
      }

      else {
        const nextRoute = getNextRoute(selectedMood);
        navigate(nextRoute);
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
      <button
      key={mood.score}
      onClick={() => {setSelectedMood(mood.score); console.log(mood.score)}}
      >
        {mood.emoji}
      </button>
    ))}
    <br/><br/>
    <button>Back</button> <button onClick={handleSubmitMood}>Next</button>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br/><br/>
    <LogoutButton />
    </>
  );
}