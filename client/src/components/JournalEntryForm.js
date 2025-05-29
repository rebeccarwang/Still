import {useState} from 'react';
import Tags from './Tags';

export default function JournalEntryForm({isSubmitted, setIsSubmitted, isMismatch, setIsMismatch}) {
  const [serverError, setServerError] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isText, setIsText] = useState(false);
  const [tagsUser, setTagsUser] = useState(new Set());


  // create new journal entry, returns journal entry id
  async function postJournalEntry(journalText) {
    try {
      const res = await fetch('http://localhost:8080/api/journal/entries', {
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
      const res = await fetch('http://localhost:8080/api/tags/journal-entry', {
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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isText) {
      setServerError('Please submit a journal entry with some text if desired. Otherwise, feel free to choose another option.');
      return;
    }
    // console.log(tagsUser);
    let journalEntry = await postJournalEntry(journalText);
    let ifTagsPosted = await postTags(tagsUser, journalEntry.journalEntryId);
    if (journalEntry && ifTagsPosted) {
      setIsMismatch(journalEntry.mismatch);
      setIsSubmitted(true);
    }
  }
  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <textarea rows={10}
          placeholder="Today's thoughts"
          onChange={(e) => {setJournalText(e.target.value); setIsText(e.target.value.trim().length > 0)}}
        ></textarea>
        <br></br>
        {isText && <Tags tagsUser={tagsUser} setTagsUser={setTagsUser}/>}
        <button type='submit'>Submit</button>
      </form>
      {serverError && <p style={{ color: 'purple' }}>{serverError}</p>}
    </div>
    </>
  )
}