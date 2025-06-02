import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import LogoutButton from '../components/LogoutButton';


export default function PreferenceUpdatePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);

  const [publicAffirmations, setPublicAffirmations] = useState();
  const [userAffirmations, setUserAffirmations] = useState([]);
  const [userSelectedAffirmations, setUserSelectedAffirmations] = useState([]);
  const [affirmationError, setAffirmationError] = useState(false);

  const [publicSelfCare, setPublicSelfCare] = useState();
  const [userSelfCare, setUserSelfCare] = useState([]);
  const [userSelectedSelfCare, setUserSelectedSelfCare] = useState([]);
  const [selfCareError, setSelfCareError] = useState(false);

  const [publicCoping, setPublicCoping] = useState();
  const [userCoping, setUserCoping] = useState([]);
  const [userSelectedCoping, setUserSelectedCoping] = useState([]);
  const [copingError, setCopingError] = useState(false);

  useEffect(() => {

    // fetch public preferences from database
    const fetchPublicPreferences = async () => {
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
          // console.log('public self care', resSelfCareJson);
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

        // sets lists of publicCoping options
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


    // fetch user preferences from database
    const fetchUserPreferences = async () => {
      try {
        const resSelfCareUser = await fetch(`http://localhost:8080/api/self-care/user/id-content`, {
          credentials: 'include',
        });

        const resCopingUser = await fetch(`http://localhost:8080/api/coping-strategies/user/id-content`, {
          credentials: 'include',
        });

        const resAffirmationsUser = await fetch(`http://localhost:8080/api/affirmations/user/id-content`, {
          credentials: 'include',
        });

        // sets list of userSelfCare options and initial userSelectedSelfCare options
        if (resSelfCareUser.ok) {
          const resSelfCareUserJson = await resSelfCareUser.json();
          // console.log("resSelfCareUserJson", resSelfCareUserJson);
          setUserSelfCare(resSelfCareUserJson);
          setUserSelectedSelfCare(resSelfCareUserJson);
          // console.log(resUserPreferenceJson);
        }
        else {
          setUserSelfCare(null);
        }

        // sets list of userCoping options and initial userSelectedCoping options
        if (resCopingUser.ok) {
          const resCopingUserJson = await resCopingUser.json();
          setUserCoping(resCopingUserJson);
          setUserSelectedCoping(resCopingUserJson);
          // console.log(resUserPreferenceJson);
        }
        else {
          setUserCoping(null);
        }

        // sets list of userAffirmations options and initial userSelectedAffirmations options
        if (resAffirmationsUser.ok) {
          const resAffirmationsUserJson = await resAffirmationsUser.json();
          setUserAffirmations(resAffirmationsUserJson);
          setUserSelectedAffirmations(resAffirmationsUserJson);
          // console.log(resUserPreferenceJson);
        }
        else {
          setUserAffirmations(null);
        }
      }

      catch (err) {
        console.log('Error:', err);
        setUserSelfCare(null);
        setUserAffirmations(null);
        setUserCoping(null);

      } finally {
        setLoading(false);
      }
    };

    fetchPublicPreferences();
    fetchUserPreferences();
  }, []);

  // extract objects/strings to be added and objects to be deleted from database
  function getAdditionsDeletions(userPrevSelections, userCurSelections) {
    const arrAdd = []
    const arrDel = []

    // create setPrev and setCur to hold ids of existing database items
    const setPrev = new Set();
    const setCur = new Set();
    userPrevSelections.forEach(item => setPrev.add(item.id));
    userCurSelections.forEach(item => typeof item !== 'string' && setCur.add(item.id));

    // populate arrAdd with items that need to be added to the database
    userCurSelections.forEach(item => {
      if (typeof item === 'string' || !setPrev.has(item.id)) {
        arrAdd.push(item);
      }
      })

    // populate arrDel with items that need to be deleted from the database
    userPrevSelections.forEach(item => {
      if (!setCur.has(item.id)) {
        arrDel.push(item);
      }
    })
    return [arrAdd, arrDel];
  }

  // update database with new insertions and deletions based on user selected preferences
  async function addDelDb(arrAdd, arrDel, preference) {
    try {
      // add self-care items to tables in databases
      const prefAdds = await fetch(`http://localhost:8080/api/${preference}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: arrAdd
        }),
        credentials: 'include'
      });

      // delete self-care items from tables in databases
      const prefDels = await fetch(`http://localhost:8080/api/${preference}/user/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: arrDel
        }),
        credentials: 'include'
      });

      if (!prefAdds.ok) {
        const prefAddsJson = await prefAdds.json();
        setServerError(prefAddsJson.error || 'Something went wrong- try again later');
        return false;
      }

      if (!prefDels.ok) {
        const prefDelsJson = await prefDels.json();
        setServerError(prefDelsJson.error || 'Something went wrong- try again later');
        return false;
      }

      return true;

    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
      return false;
    }
  }


  // handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // checks user inputs at least 1 item for each of the 3 categories
    if (userSelectedCoping.length === 0 || userSelectedSelfCare.length === 0 || userSelectedAffirmations.length === 0) {
      userSelectedCoping.length === 0 ? setCopingError(true): setCopingError(false);
      userSelectedSelfCare.length === 0 ? setSelfCareError(true): setSelfCareError(false);
      userSelectedAffirmations.length === 0 ? setAffirmationError(true): setAffirmationError(false);
      return;
    }

    try {
      // get items to add to and delete from self-care database
      const [addSelfCare, delSelfCare] = getAdditionsDeletions(userSelfCare, userSelectedSelfCare);
      const [addAff, delAff] = getAdditionsDeletions(userAffirmations, userSelectedAffirmations);
      const [addCoping, delCoping] = getAdditionsDeletions(userCoping, userSelectedCoping);

      // add self-care items to tables in databases
      const addDelSelfCare = await addDelDb(addSelfCare, delSelfCare, 'self-care');
      const addDelAff = await addDelDb(addAff, delAff, 'affirmations');
      const addDelCoping = await addDelDb(addCoping, delCoping, 'coping-strategies');

      if (addDelSelfCare && addDelAff && addDelCoping) {
        navigate('/home');
      }

      else {
        setServerError('Something went wrong- try again later');
        // fetchUserPreferences();
      }

    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
    }
  }

  return (
    <>
    <h1>Preference Update</h1>
    <form onSubmit={handleSubmit}>
      {/* user selects and/or writes self-care options */}
      <h2>What helps you recharge?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-self-care-items"
        options={publicSelfCare}
        value={userSelectedSelfCare}
        isOptionEqualToValue={(option, value) => {
          const optionLabel = typeof option === 'string' ? option: option.content;
          const valueLabel = typeof value === 'string' ? value: value.content;
          return optionLabel === valueLabel;
        }}
        onChange={(event, newSelfCare) => setUserSelectedSelfCare(newSelfCare)}
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
        />)}

      {/* user selects and/or writes coping strategies */}
      <h2>What helps you get through difficult or overwhelming moments?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-coping-strategies"
        options={publicCoping}
        value={userSelectedCoping}
        isOptionEqualToValue={(option, value) => {
          const optionLabel = typeof option === 'string' ? option: option.content;
          const valueLabel = typeof value === 'string' ? value: value.content;
          return optionLabel === valueLabel;
        }}
        onChange={(event, newCoping) => setUserSelectedCoping(newCoping)}
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
        />)}

      {/* user selects and/or writes affirmations */}
      <h2>Are there any words, reminders, or beliefs that help you when you're struggling or feeling unsure?</h2>
      {!loading && (
        <Autocomplete
        multiple
        id="selected-affirmations"
        options={publicAffirmations}
        value={userSelectedAffirmations}
        isOptionEqualToValue={(option, value) => {
          const optionLabel = typeof option === 'string' ? option: option.content;
          const valueLabel = typeof value === 'string' ? value: value.content;
          return optionLabel === valueLabel;
        }}
        onChange={(event, newAffirmations) => setUserSelectedAffirmations(newAffirmations)}
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
    <LogoutButton />
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </>
  );
}