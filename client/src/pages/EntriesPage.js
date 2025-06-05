import JournalEntryCard from '../components/JournalEntryCard';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import BASE_URL from '../config';

export default function EntriesPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState(null);
  const moods = {5: "😄", 4: "🙂", 3: "😐", 2: "😕", 1: "😔"};


  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const resEntries = await fetch(`${BASE_URL}/api/journal/entries`, {
          credentials: 'include',
        });

        const resEntriesJson = await resEntries.json();

        // sets list of all journal entries
        if (resEntries.ok) {
          setEntries(resEntriesJson);
        } else {
          setServerError(resEntriesJson.error || 'Something went wrong')
        }
      }
      catch (err) {
        console.log('Error:', err);
        setServerError(err)
      } finally {
        setLoading(false);
      }};

    fetchAllEntries();
  }, []);

  return (
    <>
    Journal Entries
    {!loading && entries &&
    (<>
    {entries.map(entry => (<JournalEntryCard key={entry.id} id={entry.id} date={entry.date} mood={moods[entry.mood]} content={entry.content} tags={entry.tags} />))}
    </>
    )}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}