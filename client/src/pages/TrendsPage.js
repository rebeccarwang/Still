import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {LineChart, XAxis, YAxis, Line, Tooltip} from 'recharts';


export default function TrendsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [trends, setTrends] = useState(null);
  const mostCommonTags = trends ? mostCommonTagsFrequency(trends.tagFrequencies) : null;

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const resTrends = await fetch(`http://localhost:8080/api/trends/mood/weekly`, {
          credentials: 'include',
        });

        const resTrendsJson = await resTrends.json();

        // sets list of all journal entries
        if (resTrends.ok) {
          setTrends(resTrendsJson);
        } else {
          setServerError(resTrendsJson.error || 'Something went wrong');
        }
      }
      catch (err) {
        console.log('Error:', err);
        setServerError(err)
      } finally {
        setLoading(false);
      }};

    fetchTrends();
  }, []);


  // takes in dictionary of tagFrequencies and returns the most common tag(s) and their frequency OR null if tagFrequencies
  // dictionary is empty
  function mostCommonTagsFrequency(tagFrequencies) {
    let arrTagFrequencies = Object.entries(tagFrequencies);
    if (arrTagFrequencies.length === 0) {
      return null;
    }

    let tagsSorted = arrTagFrequencies.sort((a, b) => b[1] - a[1]);
    let highestFrequencyVal = tagsSorted[0][1];
    let highestFrequencyStr = [];
    for (const [key, val] of tagsSorted) {
      if (val === highestFrequencyVal) {
        highestFrequencyStr.push(key);
      }
      else {
        break;
      }
    }
    return [highestFrequencyStr, highestFrequencyVal];
  }

  return (
    <>
    <h1>Trends</h1>
    {!loading && trends.moodData.length === 0 && (
      <h3>No moods were input in the past week.</h3>
    )}
    {!loading && trends.moodData.length > 0 && (<>
    <div>
      <h2>Mood Trends</h2>
      <LineChart width={400} height={200} data={trends.moodData.map(entry => ({createdAt: new Date(entry.createdAt).getTime(), mood: entry.mood}))}>
        <XAxis
          dataKey='createdAt'
          type='number'
          domain={['auto', 'auto']}
          scale='time'
          label={{value: 'Date', position: 'insideBottom', offset: -5}}
          tickFormatter={(datetime) => new Date(datetime).toISOString().split('T')[0]}
        />
        <YAxis
          domain={[0, 6]}
          label={{value: 'Mood', position: 'insideLeft', offset: -5}}
        />
        <Tooltip
          labelFormatter={(datetime) => {
            const date = new Date(datetime);
            return date.toLocaleString();
          }}
        />
        <Line type='monotone' dataKey='mood' stroke='#8884d8' />
      </LineChart>
    </div>
    </>)}
    <h2>Tag Trends</h2>
    {!loading && !mostCommonTags && (
      <h3>No tags were input in the past week.</h3>
    )}
    {!loading && mostCommonTags && (
      <>
      Your most frequent tags this week: {mostCommonTags[0].map(entry => `${entry} `)}
      <br />
      tagged {mostCommonTags[1]} time(s) each
    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}