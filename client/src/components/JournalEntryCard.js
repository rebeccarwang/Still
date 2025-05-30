import {Card, CardContent, Typography, Link} from '@mui/material';
export default function JournalEntryCard({id, date, mood, content, tags, isClicked}) {
  return (
    <>
    <Card>
      <CardContent>
        <Typography>
          {date}
        </Typography>
        <Typography sx={{color: 'text.secondary', fontSize: 14}}>
        {mood} | Tags: {tags.map(tag => `${tag} `)}
        </Typography>
        <Typography>
        {content.length > 50 ? `${content.slice(0, 100)}...` : content}
        </Typography>
        <Link href={`/entries/${id}`}>View Entry
        </Link>
      </CardContent>
    </Card>
    </>
  )
}