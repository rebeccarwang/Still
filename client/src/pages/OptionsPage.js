import {useNavigate, useSearchParams} from 'react-router-dom';
import Layout from '../components/Layout';
import StyledChip from '../components/StyledChip';

export default function OptionsPage() {
  const [searchParams] = useSearchParams();
  const moodId = searchParams.get('moodId');
  const navigate = useNavigate();


  return (
    <>
    <Layout>
    <div className='w-3/4 relative'>
    <h2 className='text-med-orange text-xl sm:text-4xl text-center p-4 sm:p-8'>Sounds like it was a hard day. What would make you feel best supported right now?</h2>
    <div className='grid [grid-template-columns:repeat(auto-fit,200px)] justify-center gap-x-2 gap-y-3 pt-2'>
      <StyledChip
        label='Reflecting'
        link={`/journal?prompt=low&moodId=${moodId}`}
      />
      <StyledChip
        label='Seeing my reminders list'
        link={`/options/preference?type=affirmations&moodId=${moodId}`}
      />
      <StyledChip
        label='Self-care'
        link={`/options/preference?type=self-care&moodId=${moodId}`}
      />
      <StyledChip
        label='Coping strategies'
        link={`/options/preference?type=coping-strategies&moodId=${moodId}`}
      />
      <StyledChip
        label='Not today'
        link={`/options/preference?type=none&moodId=${moodId}`}
      />
    </div>
    <button className='absolute left-4 text-med-orange text-lg pt-4 md:pt-12 sm:text-2xl italic whitespace-nowrap' type='button' onClick={() => navigate(-1)}>← Back</button>
    </div>
    </Layout>
    </>
  );
}