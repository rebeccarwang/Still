import {useAuth} from '../hooks/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import LogoutButton from '../components/LogoutButton';

export default function MoodCheckInPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const moods = [{emoji: "😄", score: 5},
    {emoji: "🙂", score: 4},
    {emoji: "😐", score: 3},
    {emoji: "😕", score: 2},
    {emoji: "😔", score: 1}]


  return (
    <>
    <h1>Welcome, {user.firstName}!</h1>
    <h2>How are you feeling today?</h2>
    {moods.map(mood => (
      <button>{mood.emoji}</button>
    ))}
    <br/>
    <LogoutButton />
    </>
  );
}