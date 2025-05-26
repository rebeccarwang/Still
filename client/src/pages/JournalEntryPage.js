import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';


export default function JournalEntryPage() {
  const [searchParams] = useSearchParams();
  const promptType = searchParams.get('prompt');
  const prompts = {'high': 'That\'s great to hear! What went well today?', 'neutral': 'How did the day go?', 'low': 'What happened today that felt hard?'};
  const prompt = prompts[promptType];
  const navigate = useNavigate();

  return (
    <>
    <h1>New Journal Entry</h1>
    <h2>{prompt}</h2>
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}