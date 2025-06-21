import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import JournalEntryForm from '../components/JournalEntryForm';
import {useState, useEffect} from 'react';
import Layout from '../components/Layout';
import {Chip} from '@mui/material';


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
  const [showConfirmation, setShowConfirmation] = useState(false);


  useEffect(() => {
    // navigate home if either 1) user submitted the first journal entry and there is no sentiment mismatch
    // between mood and text or 2) user submitted a second journal entry
    if ((isSubmitted && !isMismatch) || (isSubmitted && showFollowUpForm)) {

      // set setShowConfirmation value to true to trigger showing confirmation message
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/home');
      }, 750);
    }
  }, [isSubmitted, isMismatch, showFollowUpForm, navigate])


  return (
    <>
    <Layout>
    {/* if user has not yet journalled or if user's mood score is similar to journal entry's sentiment score */}
    <div>
    {!isMismatch && !showConfirmation &&
    (<>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>{prompt}</h2>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isMismatch={isMismatch} setIsMismatch={setIsMismatch} moodId={moodId}/>
    </>)}

    {/* if user's mood score is significantly different from journal entry's sentiment score */}
    {isMismatch && !showFollowUpForm && !showConfirmation &&
    (<>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Thank you for your entry</h2>
    <div className='italic sm:text-lg text-center'>It seems like your mood and text might not align. Would you like to create a follow up reflection?</div>

    <div className='grid grid-cols-6 gap-x-2 gap-y-3 pt-4'>
      <Chip
          sx={{
            backgroundColor: !isMismatch ? '#D8693D': '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='No'
          onClick={() => setIsMismatch(false)}
          className='col-start-3'
        />
        <Chip
          sx={{
            backgroundColor: showFollowUpForm ? '#D8693D': '#c9c9c9',
            color: 'white',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#D8693D'
            }
          }}
          label='Yes'
          onClick={() => {setIsSubmitted(false); setShowFollowUpForm(true)}}
          className='col-start-4'
        />
      </div>
    </>)}
    {showFollowUpForm && !showConfirmation &&
    (<>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>How are you doing today?</h2>
    <JournalEntryForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} isMismatch={isMismatch} setIsMismatch={setIsMismatch} moodId={moodId}/>
    </>)}
    {showConfirmation &&
    (<>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Entry recorded!</h2>
    </>)}
    </div>
    </Layout>
    </>
  );
}