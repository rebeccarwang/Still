import JournalEntryCard from '../components/JournalEntryCard';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import BASE_URL from '../config';
import Layout from '../components/Layout';

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
    <Layout>
      <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Past Entries</h1>
      {!loading && entries &&
      (<>
      <div className='w-3/4 overflow-x-auto'>
        <div className='grid grid-rows-2 auto-cols-[250px] [grid-auto-flow:column] gap-4 pb-6 sm:pt-4'>
          {entries.map(entry => (
            <JournalEntryCard
            key={entry.id}
            id={entry.id}
            date={entry.date}
            mood={moods[entry.mood]}
            content={entry.content} tags={entry.tags}
            />
            ))}
        </div>
      </div>
      </>
      )}
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <br />
      <button className='w-3/4 text-med-orange text-lg sm:text-2xl italic whitespace-nowrap text-left' type='button' onClick={() => navigate(-1)}>← Back</button>
    </Layout>
    </>
  )
}