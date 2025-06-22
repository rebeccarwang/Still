import {Chip} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function StyledChip({label, link}) {
  const navigate = useNavigate();
  return (
    <>
    <Chip
      sx={{
        backgroundColor: '#c9c9c9',
        color: 'white',
        fontSize: '1rem',
        '&:hover': {
          backgroundColor: '#D8693D'
        }
      }}
      label={label}
      onClick={() => navigate(link)}
    />
    </>
  )
}