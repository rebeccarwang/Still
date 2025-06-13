import {useNavigate, useSearchParams} from 'react-router-dom';
import {useState} from 'react';
import Layout from '../components/Layout'

export default function OptionsPage() {
  const navigate = useNavigate();
  const [nextPage, setNextPage] = useState('');
  const [serverError, setServerError] = useState('');
  const [searchParams] = useSearchParams();
  const moodId = searchParams.get('moodId');


  // direct user to different page based on user's selected option
  function getNextRoute(nextPage) {
    if (nextPage === 'journaling') {
      return `/journal?prompt=low&moodId=${moodId}`;
    }

    else if (nextPage === 'affirmations') {
      return `/options/preference?type=affirmations&moodId=${moodId}`;
    }

    else if (nextPage === 'coping-strategies') {
      return `/options/preference?type=coping-strategies&moodId=${moodId}`;
    }

    else if (nextPage === 'self-care') {
      return `/options/preference?type=self-care&moodId=${moodId}`;
    }

    else {
      return `/options/preference?type=none&moodId=${moodId}`;
    }
  }

  // handle Next button
  function handleSubmitOption() {
    if (nextPage.length === 0) {
      setServerError('Please pick an option.');
      return;
    }
    const nextRoute = getNextRoute(nextPage);
    navigate(nextRoute);
    }

  return (
    <>
    <Layout>
    <h2>Sounds like it was a hard day. What would make you feel best supported right now?</h2>
    <button onClick={() => setNextPage('journaling')}>Reflecting</button>
    <button onClick={() => setNextPage('affirmations')}>Seeing my reminders list</button>
    <button onClick={() => setNextPage('self-care')}>Self-care</button>
    <button onClick={() => setNextPage('coping-strategies')}>Coping strategies</button>
    <button onClick={() => setNextPage('none')}>Not today</button>
    <br></br>
    <button onClick={() => navigate(-1)}>Back</button>
    <button onClick={handleSubmitOption}>Next</button>
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    </Layout>
    </>
  );
}