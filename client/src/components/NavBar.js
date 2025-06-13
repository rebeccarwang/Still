import LogoutButton from './LogoutButton';
import {NavLink} from 'react-router-dom';

function NavBar() {
  return (
    <>
    <nav className='bg-dark-blue text-white flex justify-between whitespace-nowrap'>
      <div className='flex items-center space-x-4 h-full'>
        <NavLink to='/home' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Home</NavLink>
        <NavLink to='/check-in' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Check In</NavLink>
        <NavLink to='/entries' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Journal Entries</NavLink>
        <NavLink to='/trends' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Trends</NavLink>
        <NavLink to='/preferences' className={({isActive}) => `rounded-md hover:bg-navy px-2 lg:px-8 py-2 lg:py-4 ${isActive ? 'font-semibold' : 'font-normal'}`}>Preferences</NavLink>
      </div>
      <div className='rounded-md bg-dark-blue hover:bg-navy px-2 lg:px-8 py-2 lg:py-4'><LogoutButton /></div>
    </nav>
    </>
  )
}
export default NavBar;