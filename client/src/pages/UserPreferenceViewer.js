import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import BASE_URL from '../config';
import Layout from '../components/Layout'
import StyledChip from '../components/StyledChip';


export default function UserPreferenceViewer() {
  const [searchParams] = useSearchParams();
  const preferenceType = searchParams.get('type');
  const moodId = searchParams.get('moodId');
  const [userPreference, setUserPreference] = useState(null);
  const [loading, setLoading] = useState(true);
  const prompts = {'affirmations': 'Reminder List', 'self-care': 'Things that help me recharge', 'coping-strategies': 'Things that help me in difficult moments'};
  // const prompt = prompts[promptType];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        if (preferenceType === 'none') {
          return;
        }
        const resUserPreference = await fetch(`${BASE_URL}/api/${preferenceType}/user`, {
          credentials: 'include',
        });

        // sets list of publicSelfCare options
        if (resUserPreference.ok) {
          const resUserPreferenceJson = await resUserPreference.json();
          // console.log("got here");
          setUserPreference(resUserPreferenceJson);
          // console.log(resUserPreferenceJson);
        }
      }

       catch (err) {
        console.log('Error:', err);
        setUserPreference(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreference();
  }, [preferenceType]);

  return (
    <>
    <Layout>
    <div className='w-3/4 relative'>
    {!loading && userPreference &&
    (
    <>
    <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>{prompts[preferenceType]}</h1>
    <div className='flex justify-center'>
    <h2 className='text-med-orange sm:text-2xl'>{userPreference.map((item, idx) => <li key={idx}>{item}</li>)}</h2>
    </div>
    <button className='absolute left-4 text-med-orange text-lg pt-12 md:pt-28 sm:text-2xl italic whitespace-nowrap' type='button' onClick={() => navigate(-1)}>← Back</button>
    <button className='absolute right-4 text-med-orange text-lg pt-12 md:pt-28 sm:text-2xl italic whitespace-nowrap' onClick={() => navigate('/home')}>Next →</button>
    </>
    )

    }
    {!loading && (preferenceType === 'none') &&
    (
    <>
    <div className='relative flex flex-col items-center'>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Sometimes it's just one of those days. Thanks for checking in.</h2>
    <h3 className='text-lg italic text-center'>Would you like to add any tags before you go?</h3>
    <div className='grid grid-cols-2 w-[300px] gap-x-2 gap-y-3 pt-4 sm:pt-8'>
    <StyledChip
      label='No'
      link='/home'
    />
    <StyledChip
      label='Yes'
      link={`/tags?moodId=${moodId}`}
    />
    </div>
    <br></br>
    </div>
    <button className='absolute left-4 text-med-orange text-lg pt-4 md:pt-12 sm:text-2xl italic whitespace-nowrap' type='button' onClick={() => navigate(-1)}>← Back</button>
    </>
    )
    }
    <br></br>
    </div>
    </Layout>
    </>
  )
}