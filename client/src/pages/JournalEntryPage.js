import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import JournalEntryForm from '../components/JournalEntryForm';
import {useState} from 'react';


export default function JournalEntryPage() {
  const [searchParams] = useSearchParams();
  const promptType = searchParams.get('prompt');
  const moodId = searchParams.get('moodId');
  const prompts = {'high': 'That\'s great to hear! What went well today?', 'neutral': 'How did the day go?', 'low': 'What happened today that felt hard?'};
  const prompt = prompts[promptType];

  const navigate = useNavigate();
  const [isTagOnly, setIsTagOnly] = useState(false);


  return (
    <>
    {!isTagOnly && (
      <>
      <h2>{prompt}</h2>
    <JournalEntryForm isSubmitted={isTagOnly} setIsSubmitted={setIsTagOnly}/>
    <button onClick={() => {setIsTagOnly(true); navigate(`/tags?moodId=${moodId}`)}}>Tags only today</button>
    </>
    )}
    {isTagOnly && <h2>Finished journaling- placeholder</h2>}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}