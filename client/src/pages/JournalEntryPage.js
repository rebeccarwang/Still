import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import JournalEntryForm from '../components/JournalEntryForm';
import Tags from '../components/Tags';
import {useState} from 'react';


export default function JournalEntryPage() {
  const [searchParams] = useSearchParams();
  const promptType = searchParams.get('prompt');
  const prompts = {'high': 'That\'s great to hear! What went well today?', 'neutral': 'How did the day go?', 'low': 'What happened today that felt hard?'};
  const prompt = prompts[promptType];

  const navigate = useNavigate();
  const [tagsUser, setTagsUser] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
    {!isSubmitted && (
      <>
      <h2>{prompt}</h2>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
    <button onClick={() => setIsSubmitted(true)}>Tags only today</button>
    </>
    )}
    {isSubmitted && (
      <>
      <Tags tagsUser={tagsUser} setTagsUser={setTagsUser}/>
      </>
    )}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}