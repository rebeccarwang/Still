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
      <h2>{tagsPublic.map(item =>
        <Chip
        key={item.id}
        label={item.name}
        clickable color={tagsUser.has(item.id) ? 'primary': 'default'}
        onClick={() => clickTag(item.id)}
        />
        )}</h2>
      </>
    )}
    <br></br>
    </>
  )
}