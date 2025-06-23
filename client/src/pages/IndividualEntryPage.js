import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Card, CardContent, Typography, Chip} from '@mui/material';
import BASE_URL from '../config';
import Layout from '../components/Layout'


export default function IndividualEntryPage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [entry, setEntry] = useState(null);
  const moods = {5: "😄", 4: "🙂", 3: "😐", 2: "😕", 1: "😔"};

  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const resEntry = await fetch(`${BASE_URL}/api/journal/entries/${id}`, {
          credentials: 'include',
        });

        const resEntryJson = await resEntry.json();

        // sets list of all journal entries
        if (resEntry.ok) {
          setEntry(resEntryJson);
        } else {
          setServerError(resEntryJson.error || 'Something went wrong');
        }
      }
      catch (err) {
        console.log('Error:', err);
        setServerError(err)
      } finally {
        setLoading(false);
      }};

    fetchAllEntries();
  }, [id]);

  return (
    <>
    <Layout>
    <div className='relative w-3/4 flex flex-col justify-center'>
    {!loading && entry &&
    (<>
    <h1 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>On {new Date(entry.date).toLocaleString('en-us', {day: 'numeric', month: 'short', year: 'numeric'})} at {new Date(entry.date).toLocaleString('en-us', {hour: '2-digit', minute: '2-digit'})}, you felt {moods[entry.mood]}</h1>
    <div className='flex flex-col items-center'>
    <Card className='w-3/4 min-h-[200px]' >
      <CardContent>
        <Typography>
        {entry.content}
        </Typography>
      </CardContent>
    </Card>
    <div className= 'w-3/4 justify-left grid [grid-template-columns:repeat(auto-fit,125px)] gap-x-2 gap-y-3 pt-4 sm:pt-8'>{entry.tags.map(tag =>
      <Chip
        sx={{
          backgroundColor: '#D8693D',
          color: 'white',
          fontSize: '1rem',
        }}
        key={tag}
        label={tag}
      />
    )}
    </div>
    </div>
    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br />
    </div>
    <div className='relative w-3/4'>
      <button className='absolute left-4 text-med-orange text-lg pt-12 lg:pt-28 sm:text-2xl italic whitespace-nowrap' type='button' onClick={() => navigate(-1)}>← Back</button>
    </div>
    </Layout>
    </>
  )
}