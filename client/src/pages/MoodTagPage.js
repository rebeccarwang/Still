import {useNavigate} from 'react-router-dom';

export default function MoodTagPage() {
  const navigate = useNavigate();
  return (
    <>
    Tag My Mood
    <br></br>
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}