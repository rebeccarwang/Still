import {useNavigate} from 'react-router-dom';
import {useSearchParams} from 'react-router-dom';

export default function TagPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const journalId = searchParams.get('journalEntryId');

  return (
    <>
    Tags
    <br></br>
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}