import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export default function JournalEntryForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [journalText, setJournalText] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (journalText.length === 0) {
      setServerError('Please submit a journal entry with some text if desired. Otherwise, feel free to choose another option.');
      return;
    }
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
        navigate(`/tags?journalEntryId=${resJson.journalEntryId}`);
      }
      else {
        const resJson = await res.json();
        setServerError(resJson.error || 'Something went wrong');
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
    }
  }
  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <textarea rows={10}
          placeholder="Today's thoughts"
          onChange={(e) => setJournalText(e.target.value)}
        ></textarea>
        <br></br>
        <button type='Submit'>Submit</button>
      </form>
      {serverError && <p style={{ color: 'purple' }}>{serverError}</p>}
    </div>
    </>
  )
}