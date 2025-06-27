import {useState, useEffect} from 'react';
import {Chip} from '@mui/material';
import BASE_URL from '../config';

export default function Tags({tagsUser, setTagsUser}) {
  const [loading, setLoading] = useState(true);
  const [tagsPublic, setTagsPublic] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPublicTagOptions = async () => {
      try {
        const resTagsPublic = await fetch(`${BASE_URL}/api/tags/public`, {
          credentials: 'include',
        });

        const resTagsPublicJson = await resTagsPublic.json();

        // sets list of public tags options
        if (resTagsPublic.ok) {
          setTagsPublic(resTagsPublicJson);
        } else {
          setTagsPublic(null);
          setErrorMessage(resTagsPublicJson.error || 'Something went wrong');
        }

      } catch (err) {
        console.log('Error:', err);
        setTagsPublic(null);
        setErrorMessage('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTagOptions();
  }, []);

  // update user selected tags
  function clickTag(tagId) {
    const allTagsUser = new Set(tagsUser);
    if (allTagsUser.has(tagId)) {
      allTagsUser.delete(tagId);
    }
    else {
      allTagsUser.add(tagId);
    }
    setTagsUser(allTagsUser);
    // console.log(allTagsUser);
  }

  return (
    <>
    {!loading && !errorMessage && (
      <>
      <div className='grid [grid-template-columns:repeat(auto-fit,125px)] justify-center gap-x-2 gap-y-3 pt-4'>{tagsPublic.map(item =>
      <Chip
        sx={{
          backgroundColor: tagsUser.has(item.id) ? '#D8693D': '#c9c9c9',
          color: 'white',
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: tagsUser.has(item.id) ? '#D8693D': '#b3b3b3'
          }
        }}
        key={item.id}
        label={item.name}
        onClick={() => clickTag(item.id)}
      />
        )}</div>
      </>
    )}
    <br></br>
    {!loading && errorMessage && (
      <>
      <p className='text-red-500 text-center'>{errorMessage}</p>
      </>
    )}
    </>
  )
}