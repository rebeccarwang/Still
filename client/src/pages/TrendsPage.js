import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';


export default function TrendsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        console.log('fetching trends');
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
    Trending
    {!loading && (<>
    {/* <h3>{JSON.stringify(trends.tagFrequencies)}</h3>
    <h3>{JSON.stringify(mostCommonTagsFrequency(trends.tagFrequencies))}</h3> */}

    </>)}
    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}