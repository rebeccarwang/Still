import {Card, CardContent, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
export default function JournalEntryCard({id, date, mood, content, tags, isClicked}) {
  const navigate = useNavigate();
  return (
    <>
    <Card className='relative'>
      <CardContent className='pb-4'>
        <Typography className='absolute text-med-orange italic pb-2 top-3'>
          {new Date(date).toLocaleString('en-us', {day: 'numeric', month: 'short', year: 'numeric'})}
        </Typography>
        <Typography>
          <span className='absolute italic text-med-grey text-sm right-2 top-3'>
            {new Date(date).toLocaleString('en-us', {hour: '2-digit', minute: '2-digit'})}
          </span>
        </Typography>
        <Typography className='pt-6 text-med-grey'>
        {mood} | Tags: {tags.map(tag => `${tag} `)}
        </Typography>
        <Typography className='pt-2'>
        {content.length > 50 ? `${content.slice(0, 100)}...` : content}
        </Typography>
        <button className='absolute right-2 bottom-2 text-med-orange' onClick={() => navigate(`/entries/${id}`)}>View Entry →</button>
      </CardContent>
    </Card>
    </>
  )
}