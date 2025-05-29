import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import JournalEntryForm from '../components/JournalEntryForm';
import {useState, useEffect} from 'react';


export default function JournalEntryPage() {
  const [searchParams] = useSearchParams();
  const promptType = searchParams.get('prompt');
  const moodId = searchParams.get('moodId');
  const prompts = {'high': 'That\'s great to hear! What went well today?', 'neutral': 'How did the day go?', 'low': 'What happened today that felt hard?'};
  const prompt = prompts[promptType];

  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleTagsOnly() {
    navigate(`/tags?moodId=${moodId}`);
  }


  useEffect(() => {
    if (isSubmitted) {
      navigate('/home');
    }
  }, [isSubmitted, navigate])


  return (
    <>
    <h2>{prompt}</h2>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
    <button onClick={handleTagsOnly}>Tags only today</button>

    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}