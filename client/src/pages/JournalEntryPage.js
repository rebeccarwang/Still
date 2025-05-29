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
  const [isMismatch, setIsMismatch] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);

  function handleTagsOnly() {
    navigate(`/tags?moodId=${moodId}`);
  }


  useEffect(() => {
    // navigate home if either 1) user submitted the first journal entry and there is no sentiment mismatch
    // between mood and text or 2) user submitted a second journal entry
    if ((isSubmitted && !isMismatch) || (isSubmitted && showFollowUpForm)) {
      navigate('/home');
    }
  }, [isSubmitted, isMismatch, showFollowUpForm, navigate])


  return (
    <>
    {/* if user has not yet journalled or if user's mood score is similar to journal entry's sentiment score */}
    {!isMismatch &&
    (<>
    <h2>{prompt}</h2>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isMismatch={isMismatch} setIsMismatch={setIsMismatch}/>
    <button onClick={handleTagsOnly}>Tags only today</button>
    </>)}

    {/* if user's mood score is significantly different from journal entry's sentiment score */}
    {isMismatch && !showFollowUpForm &&
    (<>
    <h2>Thank you for your entry. It seems like your mood and text might not align. Would you like to
      create a follow up reflection? </h2>
    <button onClick={() => setIsMismatch(false)}>No</button><button onClick={() => {setIsSubmitted(false); setShowFollowUpForm(true)}}>Yes</button>
    </>)}
    {showFollowUpForm &&
    (<>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isMismatch={isMismatch} setIsMismatch={setIsMismatch}/>
    <button onClick={handleTagsOnly}>Tags only today</button>
    </>)}
    <br />
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}