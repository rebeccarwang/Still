import LogoutButton from './LogoutButton';
import {Link} from 'react-router-dom';

function NavBar() {
  return (
    <>
    <nav className='navbar' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div className='navbar-left'>
        <a href='/home' className='home'>Home</a>
      </div>
      <div className='navbar-centre' style={{display: 'flex', flex: 0.5, justifyContent: 'space-between', alignItems: 'center'}}>
        <Link to='/check-in'>Check In</Link>
        <Link to='/entries'>Journal Entries</Link>
        <Link to='/trends'>Trends</Link>
        <Link to='/preferences'>Preferences</Link>
      </div>
      <div className='navbar-right'>
        <LogoutButton />
      </div>
    </nav>
    </>
  )
}
export default NavBar;