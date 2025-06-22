import {useState, useEffect} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import BASE_URL from '../config';
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import theme from '../theme';


export default function PreferenceUpdatePage() {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [serverSuccess, setServerSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const navigate = useNavigate();

  // fetch public preferences from database
  const fetchPublicPreferences = async () => {
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
    }
  };


  // fetch user preferences from database
  const fetchUserPreferences = async () => {
    try {
      const resSelfCareUser = await fetch(`${BASE_URL}/api/self-care/user/id-content`, {
        credentials: 'include',
      });

      const resCopingUser = await fetch(`${BASE_URL}/api/coping-strategies/user/id-content`, {
        credentials: 'include',
      });

      const resAffirmationsUser = await fetch(`${BASE_URL}/api/affirmations/user/id-content`, {
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

    }
  };

  // fetches public and user preferences from the database
  useEffect(() => {
    const fetchPublicUserData = async () => {
      await fetchPublicPreferences();
      await fetchUserPreferences();
      setLoading(false);
    }
    fetchPublicUserData();
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
      const prefAdds = await fetch(`${BASE_URL}/api/${preference}/user`, {
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
      const prefDels = await fetch(`${BASE_URL}/api/${preference}/user/delete`, {
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
        // const prefAddsJson = await prefAdds.json();
        // console.log('the prefAddsJson being logged', prefAddsJson);
        setServerError('Something went wrong- try again later');
        return false;
      }

      if (!prefDels.ok) {
        // const prefDelsJson = await prefDels.json();
        // console.log('the prefDelsJson being logged', prefDelsJson);
        setServerError('Something went wrong- try again later');
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
      setIsSubmitting(true);
      // get items to add to and delete from self-care database
      const [addSelfCare, delSelfCare] = getAdditionsDeletions(userSelfCare, userSelectedSelfCare);
      const [addAff, delAff] = getAdditionsDeletions(userAffirmations, userSelectedAffirmations);
      const [addCoping, delCoping] = getAdditionsDeletions(userCoping, userSelectedCoping);

      // add self-care items to tables in databases
      const addDelSelfCare = await addDelDb(addSelfCare, delSelfCare, 'self-care');
      const addDelAff = await addDelDb(addAff, delAff, 'affirmations');
      const addDelCoping = await addDelDb(addCoping, delCoping, 'coping-strategies');

      if (addDelSelfCare && addDelAff && addDelCoping) {
        setServerSuccess(true);
        setTimeout(() => {
          setServerSuccess(false);
        }, 750);
        setServerError('');
      }

      else {
        setServerError('Something went wrong- try again later');
        setServerSuccess(false);
        // await fetchUserPreferences();
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
      setServerSuccess(false);
      // await fetchUserPreferences();
    }

    finally {
      await fetchUserPreferences();
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <Layout>
    <div className='w-3/4 relative'>
    <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Preference Update</h1>
    <form onSubmit={handleSubmit}>
      {/* user selects and/or writes self-care options */}
      <div>
      <ThemeProvider theme={theme}>
      <h2 className='text-med-orange sm:text-xl md:pb-3'>What helps you recharge?</h2>
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
            sx={{
              '& .MuiInput-underline:hover:before': {
              borderBottomColor: '#737373'
            }}}
          />
        )}
        className='pb-6 md:pb-8'
        />)}

      {/* user selects and/or writes coping strategies */}
      <h2 className='text-med-orange sm:text-xl md:pb-3'>What helps you get through difficult or overwhelming moments?</h2>
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
            sx={{
              '& .MuiInput-underline:hover:before': {
              borderBottomColor: '#737373'
            }}}
          />
        )}
        className='pb-6 md:pb-8'
        />)}

      {/* user selects and/or writes affirmations */}
      <h2 className='text-med-orange sm:text-xl md:pb-3'>Are there any words, reminders, or beliefs that help you when you're struggling or feeling unsure?</h2>
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
            sx={{
              '& .MuiInput-underline:hover:before': {
              borderBottomColor: '#737373'
            }}}
          />
        )}
        className='pb-6 md:pb-8'
        />
      )
      }
      </ThemeProvider>
      </div>
      <button className='absolute left-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' type='button' onClick={() => navigate(-1)}>← Back</button>
      <button className='absolute right-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' type='submit' disabled={isSubmitting}>Submit →</button>
    </form>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    {isSubmitting && !serverSuccess && (
      <>
      <div className='fixed inset-0 bg-white bg-opacity-30 z-40'></div>
      <div className='absolute right-4 text-sm sm:text-md italic whitespace-nowrap pt-10 z-50'>Submitting...</div>
      </>
    )}
    {serverSuccess && (
      <>
      <div className='fixed inset-0 bg-white bg-opacity-30 z-45'></div>
      <div className='absolute right-4 text-sm sm:text-md italic whitespace-nowrap pt-10 z-50'>Preferences saved!</div>
      </>
    )}
    </div>
    </Layout>
    </>
  );
}