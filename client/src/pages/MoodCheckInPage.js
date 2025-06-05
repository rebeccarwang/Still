import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import LogoutButton from '../components/LogoutButton';
import BASE_URL from '../config';

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
  function getNextRoute(score, moodId) {
    if (score === 1 || score === 2) {
      return `/options?moodId=${moodId}`;
    }

    else if (score === 3) {
      return `/journal?prompt=neutral&moodId=${moodId}`;
    }

    else {
      return `/journal?prompt=high&moodId=${moodId}`;
    }
  }

  async function handleSubmitMood() {
    if (!selectedMood) {
      setServerError('Please pick a mood.');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/mood-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({score: selectedMood}),
        credentials: 'include'
      });

      const resJson = await res.json();

      if (!res.ok) {
        setServerError(resJson.error || 'Something went wrong');
        return;
      }

      else {
        const nextRoute = getNextRoute(selectedMood, resJson.moodId);
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
      onClick={() => {setSelectedMood(mood.score)}}
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