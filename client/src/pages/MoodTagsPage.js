import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import Tags from '../components/Tags';
import BASE_URL from '../config';
import Layout from '../components/Layout'

export default function MoodTagsPage() {
  const [tagsUser, setTagsUser] = useState(new Set());
  const [serverError, setServerError] = useState('');
  const [searchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const moodId = searchParams.get('moodId');
  const navigate = useNavigate();

  // create new tags for journal entries
  async function postMoodTags(tagsUser, moodId) {
    try {
      const res = await fetch(`${BASE_URL}/api/tags/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tagsUser: Array.from(tagsUser), moodId}),
        credentials: 'include'
      });

      if (res.ok) {
        return true;
        // navigate(`/tags?journalEntryId=${resJson.journalEntryId}`);
      }
      else {
        const resJson = await res.json();
        setServerError(resJson.error || 'Something went wrong');
        return false;
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
      return false;
    }
  }


  async function handleSubmit() {
    setIsSubmitting(true);
    let isSuccess = await postMoodTags(tagsUser, moodId);
    if (isSuccess) {
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/home');
      }, 750);
    }
    setIsSubmitting(false);
  }


  return (
    <>
    <Layout>
    {!showConfirmation &&
    (<div className='relative w-3/4'>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>What's on your mind today in general?</h2>
    <Tags tagsUser={tagsUser} setTagsUser={setTagsUser} />
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <button className='absolute right-4 text-med-orange text-lg pt-12 md:pt-28 sm:text-2xl italic whitespace-nowrap' onClick={handleSubmit}>Submit →</button>
    {isSubmitting && !showConfirmation &&
    (<>
      <div className='fixed inset-0 bg-white bg-opacity-30 z-40'></div>
      <div className='absolute right-4 text-sm sm:text-md italic whitespace-nowrap pb-4 pt-20 md:pt-40 z-50'>Submitting...</div>
    </>)}
    </div>)}
    {showConfirmation &&
    (<>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Entry recorded!</h2>
    </>)}
    </Layout>
    </>
  )
}