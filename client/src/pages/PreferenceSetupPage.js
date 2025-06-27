import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import BASE_URL from '../config';
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';


export default function PreferenceSetupPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);

  const [publicAffirmations, setPublicAffirmations] = useState();
  const [userAffirmations, setUserAffirmations] = useState([]);
  const [affirmationError, setAffirmationError] = useState(false);

  const [publicSelfCare, setPublicSelfCare] = useState();
  const [userSelfCare, setUserSelfCare] = useState([]);
  const [selfCareError, setSelfCareError] = useState(false);

  const [publicCoping, setPublicCoping] = useState();
  const [userCoping, setUserCoping] = useState([]);
  const [copingError, setCopingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchPublicSelfCareStrategies = async () => {
      try {
        const resSelfCare = await fetch(`${BASE_URL}/api/self-care/public`, {
          credentials: 'include',
        });

        const resAffirmations = await fetch(`${BASE_URL}/api/affirmations/public`, {
          credentials: 'include',
        });

        const resCoping = await fetch(`${BASE_URL}/api/coping-strategies/public`, {
          credentials: 'include',
        });

        // sets list of publicSelfCare options
        if (resSelfCare.ok) {
          const resSelfCareJson = await resSelfCare.json();
          setPublicSelfCare(resSelfCareJson);
        } else {
          setPublicSelfCare(null);
        }

        // sets list of publicAffirmations options
        if (resAffirmations.ok) {
          const resAffirmationsJson = await resAffirmations.json();
          setPublicAffirmations(resAffirmationsJson);
        } else {
          setPublicAffirmations(null);
        }

        if (resCoping.ok) {
          const resCopingJson = await resCoping.json();
          setPublicCoping(resCopingJson);
        } else {
          setPublicCoping(null);
        }
      } catch (err) {
        console.log('Error:', err);
        setPublicAffirmations(null);
        setPublicCoping(null);
        setPublicSelfCare(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSelfCareStrategies();
  }, []);


  // handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // checks user inputs at least 1 item for each of the 3 categories
    if (userCoping.length === 0 || userSelfCare.length === 0 || userAffirmations.length === 0) {
      userCoping.length === 0 ? setCopingError(true): setCopingError(false);
      userSelfCare.length === 0 ? setSelfCareError(true): setSelfCareError(false);
      userAffirmations.length === 0 ? setAffirmationError(true): setAffirmationError(false);
      return;
    }

    try {
      setIsSubmitting(true);
      // add self-care items to tables in databases
      const selfCareAdditions = await fetch(`${BASE_URL}/api/self-care/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userSelfCare}),
        credentials: 'include'
      });

      // add coping items to tables in databases
      const copingAdditions = await fetch(`${BASE_URL}/api/coping-strategies/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userCoping}),
        credentials: 'include'
      });

      // add affirmations to tables in databases
      const affirmationAdditions = await fetch(`${BASE_URL}/api/affirmations/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userAffirmations}),
        credentials: 'include'
      });
      console.log('messages', selfCareAdditions.status, copingAdditions.status, affirmationAdditions.status);
      if (selfCareAdditions.ok && copingAdditions.ok && affirmationAdditions.ok) {
        const onboardingComplete = await fetch(`${BASE_URL}/api/users/onboarding-complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (onboardingComplete.ok) {
          setShowConfirmation(true);
          setTimeout(() => {
            navigate('/check-in');
          }, 750);
        }
        else {
          const onboardingCompleteJson = await onboardingComplete.json();
          setServerError(onboardingCompleteJson.error || 'Something went wrong');
        }
      }
      else {
        setServerError('Something went wrong');
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <Layout>
    <div className='w-3/4 relative'>
    <h1 className='text-med-orange text-xl sm:text-4xl text-center'>Welcome, {user.firstName}!</h1>
    <h2 className='sm:text-lg italic text-center p-4 sm:p-8'>Let's get you set up.</h2>
    <form onSubmit={handleSubmit}>
      {/* user selects and/or writes self-care options */}
      <ThemeProvider theme={theme}>
      <h2 className='text-med-orange sm:text-xl md:pb-3'>What helps you recharge?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-self-care-items"
        options={publicSelfCare}
        value={userSelfCare}
        onChange={(event, newSelfCare) => setUserSelfCare(newSelfCare)}
        freeSolo
        getOptionLabel={(option) => typeof option === 'string' ? option: option.content}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select or type as many options as you would like"
            helperText={selfCareError ? 'Please enter at least 1 item': ''}
          />
        )}
        className='pb-6 md:pb-8'
        />
      )
      }

      {/* user selects and/or writes coping strategies */}
      <h2 className='text-med-orange sm:text-xl md:pb-3'>What helps you get through difficult or overwhelming moments?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-coping-strategies"
        options={publicCoping}
        value={userCoping}
        onChange={(event, newCoping) => setUserCoping(newCoping)}
        freeSolo
        getOptionLabel={(option) => typeof option === 'string' ? option: option.content}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select or type as many options as you would like"
            helperText={copingError ? 'Please enter at least 1 item': ''}
          />
        )}
        className='pb-6 md:pb-8'
        />
      )
      }

      {/* user selects and/or writes affirmations */}
      <h2 className='text-med-orange sm:text-xl md:pb-3'>Are there any words, reminders, or beliefs that help you when you're struggling or feeling unsure?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-affirmations"
        options={publicAffirmations}
        value={userAffirmations}
        onChange={(event, newAffirmations) => setUserAffirmations(newAffirmations)}
        freeSolo
        getOptionLabel={(option) => typeof option === 'string' ? option: option.content}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select or type as many options as you would like"
            helperText={affirmationError ? 'Please enter at least 1 item': ''}
          />
        )}
        className='pb-6 md:pb-8'
        />
      )
      }
      </ThemeProvider>
      <button className='absolute right-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' type='submit'>Submit →</button>
    </form>
    {isSubmitting && !showConfirmation && (
      <>
      <div className='fixed inset-0 bg-white bg-opacity-30 z-40'></div>
      <div className='absolute right-4 text-sm sm:text-md italic whitespace-nowrap pt-10 z-45'>Submitting...</div>
      </>
    )}
    {showConfirmation &&
    (<>
    <div className='fixed inset-0 bg-near-white z-46 flex items-center justify-center'>
      <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8 z-50'>Preferences saved!</h2>
    </div>
    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </div>
    </Layout>
    </>
  );
}