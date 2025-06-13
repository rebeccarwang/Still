import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
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
    {!loading && entry &&
    (<>
    <Card>
      <CardContent>
        <Typography>
          {entry.date}
        </Typography>
        <Typography sx={{color: 'text.secondary', fontSize: 14}}>
        {moods[entry.mood]} | Tags: {entry.tags.map(tag => `${tag} `)}
        </Typography>
        <Typography>
        {entry.content}
        </Typography>
      </CardContent>
    </Card>
    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </Layout>
    </>
  )
}