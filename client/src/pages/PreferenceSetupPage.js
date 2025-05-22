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
  const [publicSelfCare, setPublicSelfCare] = useState();
  const [userSelfCare, setUserSelfCare] = useState([]);
  const [publicCoping, setPublicCoping] = useState();
  const [userCoping, setUserCoping] = useState([]);

  useEffect(() => {
    const fetchPublicSelfCareStrategies = async () => {
      try {
        const resSelfCare = await fetch('http://localhost:8080/public_self_care_items', {
          credentials: 'include',
        });

        const resAffirmations = await fetch('http://localhost:8080/public_self_affirmation_items', {
          credentials: 'include',
        });

        const resCoping = await fetch('http://localhost:8080/public_coping_strategies', {
          credentials: 'include',
        });

        // sets list of publicSelfCare options
        if (resSelfCare.ok) {
          const resSelfCareJson = await resSelfCare.json();
          console.log('self-care', resSelfCareJson);
          const selfCare = resSelfCareJson.map((selfCare) => selfCare.content);
          setPublicSelfCare(selfCare);
        } else {
          setPublicSelfCare(null);
        }

        // sets list of publicAffirmations options
        if (resAffirmations.ok) {
          const resAffirmationsJson = await resAffirmations.json();
          console.log('affirmations', resAffirmationsJson);
          const affirmations = resAffirmationsJson.map((affirmation) => affirmation.content);
          setPublicAffirmations(affirmations);
        } else {
          setPublicAffirmations(null);
        }

        if (resCoping.ok) {
          const resCopingJson = await resCoping.json();
          console.log('coping', resCopingJson);
          const coping = resCopingJson.map((coping) => coping.content);
          // console.log(resJson);
          setPublicCoping(coping);
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
      const res = await fetch('http://localhost:8080/logout', {
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
    <h1>Welcome, {user.firstName}! Let's get you set up.</h1>

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
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Select or type as many options as you would like"
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
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Select or type as many options as you would like"
        />
      )}
      />
    )
    }

    {/* user selects and/or writes affirmations */}
    <h2>Are there any words, reminders, or beliefs that help you when you're struggling or feelign unsure?</h2>
    {!loading && (
      <Autocomplete
      multiple
      id="selected-affirmations"
      options={publicAffirmations}
      value={userAffirmations}
      onChange={(event, newAffirmations) => setUserAffirmations(newAffirmations)}
      freeSolo
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Select or type as many options as you would like"
        />
      )}
      />
    )
    }
    <button onClick={logoutUser}>Logout</button>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </>
  );
}