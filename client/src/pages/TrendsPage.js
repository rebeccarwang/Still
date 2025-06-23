import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer} from 'recharts';
import BASE_URL from '../config';
import Layout from '../components/Layout'


export default function TrendsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [trends, setTrends] = useState(null);
  const mostCommonTags = trends ? mostCommonTagsFrequency(trends.tagFrequencies) : null;

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const resTrends = await fetch(`${BASE_URL}/api/trends/mood/weekly`, {
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
    <Layout>
    <div className='w-3/4 relative flex flex-col items-center'>
      {!loading && !mostCommonTags && (
        <>
        <h3 className='italic sm:text-lg text-center pb-4 md:pb-20'>No tags were input in the past week.</h3>
        </>
      )}

      {!loading && mostCommonTags && (
      <>
      {mostCommonTags[0].length === 1 && (
        <>
        <div className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-6'>
          Your most frequent tag this week was {mostCommonTags[0].map(entry => `${entry} `)}
        </div>
        <div className='italic sm:text-lg text-center'>This was tagged {mostCommonTags[1]} time{mostCommonTags[1] !== 1 && 's'}</div>
        </>)}
      {mostCommonTags[0].length === 2 && (
        <>
        <div className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-6'>
          Your most frequent tags this week were {mostCommonTags[0][mostCommonTags[0].length - 2]} and {mostCommonTags[0][mostCommonTags[0].length - 1]}
        </div>
        <div className='italic sm:text-lg text-center'>These were tagged {mostCommonTags[1]} time{mostCommonTags[1] !== 1 && 's'}</div>
        </>)}
      {mostCommonTags[0].length > 2 && (
        <>
        <div className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-6'>
          Your most frequent tags this week were {mostCommonTags[0].slice(0, -1).map(entry => `${entry}, `)} and {mostCommonTags[0][mostCommonTags[0].length - 1]}
        </div>
        <div className='italic sm:text-lg text-center'>These were tagged {mostCommonTags[1]} time{mostCommonTags[1] !== 1 && 's'}</div>
        </>)}
      <br />
    </>)}

    {!loading && trends.moodData.length === 0 && (
      <h3 className='italic sm:text-lg text-center'>No moods were input in the past week.</h3>
    )}
    {!loading && trends.moodData.length > 0 && (<>
    <div className='relative flex flex-col w-full items-center'>
      <ResponsiveContainer width='75%' height={300}>
      <LineChart data={trends.moodData.map(entry => ({createdAt: new Date(entry.createdAt).getTime(), mood: entry.mood}))}>
        <XAxis
          dataKey='createdAt'
          type='number'
          domain={['auto', 'auto']}
          tick={false}
          scale='time'
        />
        <YAxis
          domain={[0, 6]}
          tick={false}
          label={{value: 'MOOD', stroke: '#D8693D', position: 'insideTopLeft', dx: 30, dy: 50, angle: -90}}
        />
        <Tooltip
          labelFormatter={(datetime) => {
            const date = new Date(datetime);
            return date.toLocaleString('en-us', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});
          }}
        />
        <Line type='monotone' dataKey='mood' stroke='#D8693D' strokeWidth={3} dot={false}/>
      </LineChart>
      </ResponsiveContainer>
      <div className='relative w-3/4'>
      <div className='absolute bottom-2 left-16 italic text-sm '>{new Date(trends.moodData[0].createdAt).toLocaleString('en-us', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
      <div className='absolute bottom-2 right-2 italic text-sm '>{new Date(trends.moodData[trends.moodData.length - 1].createdAt).toLocaleString('en-us', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
      </div>
    </div>
    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <br />
    <div className='w-3/4'>
    <button className='absolute left-4 text-med-orange text-lg pt-4 md:pt-12 sm:text-2xl italic whitespace-nowrap' onClick={() => navigate(-1)}>← Back</button>
    </div>
    </div>
    </Layout>
    </>
  )
}