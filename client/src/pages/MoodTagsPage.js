import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import Tags from '../components/Tags';

export default function MoodTagsPage() {
  const [tagsUser, setTagsUser] = useState(new Set());
  const [serverError, setServerError] = useState('');
  const [searchParams] = useSearchParams();
  const moodId = searchParams.get('moodId');
  const navigate = useNavigate();

  // create new tags for journal entries
  async function postMoodTags(tagsUser, moodId) {
    try {
      const res = await fetch('http://localhost:8080/api/tags/mood', {
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
    let isSuccess = await postMoodTags(tagsUser, moodId);
    if (isSuccess) {
      console.log('tags added to mood!');
    }
  }


  return (
    <>
    <h2>What's on your mind today in general?</h2>
    <Tags tagsUser={tagsUser} setTagsUser={setTagsUser} />
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <button onClick={handleSubmit}>Submit</button>
    </>
  )
}