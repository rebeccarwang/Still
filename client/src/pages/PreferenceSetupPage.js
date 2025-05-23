import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Autocomplete, TextField} from '@mui/material';

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

  useEffect(() => {
    const fetchPublicSelfCareStrategies = async () => {
      try {
        const resSelfCare = await fetch('http://localhost:8080/api/self-care/public', {
          credentials: 'include',
        });

        const resAffirmations = await fetch('http://localhost:8080/api/affirmations/public', {
          credentials: 'include',
        });

        const resCoping = await fetch('http://localhost:8080/api/coping-strategies/public', {
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
      // add self-care items to tables in databases
      const selfCareAdditions = await fetch('http://localhost:8080/api/self-care/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userSelfCare}),
        credentials: 'include'
      });

      // add coping items to tables in databases
      const copingAdditions = await fetch('http://localhost:8080/api/coping-strategies/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userCoping}),
        credentials: 'include'
      });

      // add affirmations to tables in databases
      const affirmationAdditions = await fetch('http://localhost:8080/api/affirmations/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: userAffirmations}),
        credentials: 'include'
      });
      console.log('messages', selfCareAdditions.status, copingAdditions.status, affirmationAdditions.status);
      if (selfCareAdditions.ok && copingAdditions.ok && affirmationAdditions.ok) {
        await fetch('http://localhost:8080/api/users/onboarding-complete', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        navigate('/check-in');
      }
      else {
        setServerError('Something went wrong');
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
    }
  }

  return (
    <>
    <h1>Welcome, {user.firstName}! Let's get you set up.</h1>
    <form onSubmit={handleSubmit}>
      {/* user selects and/or writes self-care options */}
      <h2>What helps you recharge?</h2>
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
        />
      )
      }

      {/* user selects and/or writes coping strategies */}
      <h2>What helps you get through difficult or overwhelming moments?</h2>
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
        />
      )
      }

      {/* user selects and/or writes affirmations */}
      <h2>Are there any words, reminders, or beliefs that help you when you're struggling or feeling unsure?</h2>
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
        />
      )
      }
      <button type='submit'>Submit</button>
    </form>
    <button onClick={logoutUser}>Logout</button>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </>
  );
}