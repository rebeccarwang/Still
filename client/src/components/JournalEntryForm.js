import {useState} from 'react';
import Tags from './Tags';
import BASE_URL from '../config';
import {useNavigate} from 'react-router-dom';

export default function JournalEntryForm({isSubmitted, setIsSubmitted, isMismatch, setIsMismatch, moodId}) {
  const [serverError, setServerError] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isText, setIsText] = useState(false);
  const [tagsUser, setTagsUser] = useState(new Set());
  const navigate = useNavigate();


  // create new journal entry, returns journal entry id
  async function postJournalEntry(journalText) {
    try {
      const res = await fetch(`${BASE_URL}/api/journal/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({journalText}),
        credentials: 'include'
      });

      if (res.ok) {
        const resJson = await res.json();
        return resJson;
        // navigate(`/tags?journalEntryId=${resJson.journalEntryId}`);
      }
      else {
        const resJson = await res.json();
        setServerError(resJson.error || 'Something went wrong');
        return null;
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
      return null;
    }
  }

  // create new tags for journal entries
  async function postTags(tagsUser, journalEntryId) {
    try {
      const res = await fetch(`${BASE_URL}/api/tags/journal-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tagsUser: Array.from(tagsUser), journalEntryId}),
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

    // create new tags not associated with a journal entry
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


  async function handleSubmit(event) {
    event.preventDefault();

    // if no journal entry
    if (!isText) {
      // if there are tags, tries to write tags to database
      if (tagsUser) {
        let isSuccess = await postMoodTags(tagsUser, moodId);
        if (isSuccess) {
          setIsMismatch(false);
          setIsSubmitted(true);
        }
      }
      else {
        setIsMismatch(false);
        setIsSubmitted(true);
      }
    }

    // if journal entry, tries to write journal entry and tag(s) to database
    else {
      // console.log(tagsUser);
      let journalEntry = await postJournalEntry(journalText);
      let ifTagsPosted = await postTags(tagsUser, journalEntry.journalEntryId);
      if (journalEntry && ifTagsPosted) {
        setIsMismatch(journalEntry.mismatch);
        setIsSubmitted(true);
      }
    }
  }
  return (
    <>
    <div>
      <form className='relative' onSubmit={handleSubmit}>
        <textarea rows={10}
          placeholder="My day was..."
          onChange={(e) => {setJournalText(e.target.value); setIsText(e.target.value.trim().length > 0)}}
          className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded-xl focus:outline-[#ebb49e] placeholder-italic'
        ></textarea>
        <br></br>
        <Tags tagsUser={tagsUser} setTagsUser={setTagsUser}/>
        <button className='absolute right-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' type='submit'>Next →</button>
        <button className='absolute left-4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap' onClick={() => navigate(-1)}>← Back</button>
      </form>
      {serverError && <p className='text-sm text-[#FF3131]'>{serverError}</p>}
    </div>
    </>
  )
}