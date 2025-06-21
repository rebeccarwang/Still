import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Slider} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useState} from 'react';
import BASE_URL from '../config';
import Layout from '../components/Layout'


  // styled slider
  const StyledSlider = styled(Slider) ({
    color: 'white',
    height: '40px',
    '& .MuiSlider-rail': {
      backgroundColor: 'white',
      opacity: 1
    },
    '& .MuiSlider-thumb': {
      color: '#D8693D',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      boxShadow: 'none',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: 'none',
        color: '#C25E36'
      }
    },
    '& .MuiSlider-thumb::before': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 5.5,
      height: 5.5,
      borderRadius: '50%',
      boxShadow: `
        -5.5px -8px white,
        5.5px -8px white,
        -5.5px 0 white,
        5.5px 0 white,
        -5.5px 8px white,
        5.5px 8px white
      `
    },
  })


export default function MoodCheckInPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(2.5);
  const [serverError, setServerError] = useState('');
  const [isDefault, setIsDefault] = useState(true);


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
      <div className='w-3/5 relative flex-col'>
        <StyledSlider
          defaultValue={2.5}
          step={0.01}
          min={0.01}
          max={5}
          onChange={e => {setSelectedMood(e.target.value); setIsDefault(false)}}
        />
        <button className='absolute pl-4 sm:pl-7 pt-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' onClick={handleSubmitMood}>Next →</button>
      {!isDefault && <div className="text-4xl absolute w-full pt-2" style={{left: `calc(${(selectedMood/5 * 100)}% - 19px)`}}>{moods[Math.ceil(selectedMood)]}</div>}
      {isDefault && <div className='italic sm:text-lg text-center'>Slide the bar to select your mood</div>}
      </div>
      </div>
      <br/><br/>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <br/><br/>
    </Layout>
    </>
  );
}