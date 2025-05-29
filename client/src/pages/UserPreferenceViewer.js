import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';


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
        const resUserPreference = await fetch(`http://localhost:8080/api/${preferenceType}/user`, {
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
    {!loading && userPreference &&
    (
    <>
    <h1>{prompts[preferenceType]}</h1>
    <h2>{userPreference.map((item, idx) => <li key={idx}>{item}</li>)}</h2>
    <button onClick={() => navigate(-1)}>Back</button>
    <button onClick={() => navigate('/home')}>Next</button>
    </>
    )

    }
    {!loading && (preferenceType === 'none') &&
    (
    <>
    <h2>Sometimes it's just one of those days. Thanks for checking in. Would you like to add any tags before you go?</h2>
    <button onClick={() => navigate('/home')}>No</button>
    <button onClick={() => navigate(`/tags?moodId=${moodId}`)}>Yes</button>
    <br></br>
    <button onClick={() => navigate(-1)}>Back</button>
    </>
    )
    }
    <br></br>
    </>
  )
}