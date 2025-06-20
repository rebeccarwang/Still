import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import BASE_URL from '../config';
import Layout from '../components/Layout'
import '../index.css';

export default function MoodCheckInPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(2.5);
  const [serverError, setServerError] = useState('');

  // const moods = [{emoji: "😄", score: 5},
  //   {emoji: "🙂", score: 4},
  //   {emoji: "😐", score: 3},
  //   {emoji: "😕", score: 2},
  //   {emoji: "😔", score: 1}]

  const moods = {5: "😄", 4: "🙂", 3: "😐", 2: "😕", 1: "😔"};


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
    // if (!selectedMood) {
    //   setServerError('Please pick a mood.');
    //   return;
    // }
    try {
      const res = await fetch(`${BASE_URL}/api/mood-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({score: Math.ceil(selectedMood)}),
        credentials: 'include'
      });

      const resJson = await res.json();

      if (!res.ok) {
        setServerError(resJson.error || 'Something went wrong');
        return;
      }

      else {
        const nextRoute = getNextRoute(Math.ceil(selectedMood), resJson.moodId);
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
    <Layout>
      <div className='flex flex-col items-center'>
        <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Welcome {user.firstName[0].toUpperCase() + user.firstName.substring(1)}, how are you feeling today?</h1>
        <div className='w-3/4'>
          <div className='slidecontainer'>
          <input
            type='range'
            min='0.01'
            max='5'
            step='0.01'
            className='w-full slider'
            onChange={(e) => {setSelectedMood(Number(e.target.value)); console.log(selectedMood)}}
          />
          </div>
        <div className="text-4xl relative w-full" style={{left: `${(selectedMood/5 * 100) - 3}%`}}>{moods[Math.ceil(selectedMood)]}</div>
        {/* {moods.map(mood => (
          <button
          key={mood.score}
          onClick={() => {setSelectedMood(mood.score)}}
          >
            {mood.emoji}
          </button>
        ))} */}
        </div>
        <br/><br/>
        <button>Back</button> <button onClick={handleSubmitMood}>Next</button>
        {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
        <br/><br/>
      </div>
    </Layout>
    </>
  );
}