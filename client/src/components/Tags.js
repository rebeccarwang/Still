import {useState, useEffect} from 'react';
import {Chip} from '@mui/material';
import BASE_URL from '../config';

export default function Tags({tagsUser, setTagsUser}) {
  const [loading, setLoading] = useState(true);
  const [tagsPublic, setTagsPublic] = useState([]);

  useEffect(() => {
    const fetchPublicTagOptions = async () => {
      try {
        const resTagsPublic = await fetch(`${BASE_URL}/api/tags/public`, {
          credentials: 'include',
        });

        // sets list of public tags options
        if (resTagsPublic.ok) {
          const resTagsPublicJson = await resTagsPublic.json();
          setTagsPublic(resTagsPublicJson);
        } else {
          setTagsPublic(null);
        }

      } catch (err) {
        console.log('Error:', err);
        setTagsPublic(null);
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
    {!loading && (
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
    </>
  )
}