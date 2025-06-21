import LogoutButton from './LogoutButton';

export default function Layout({children}) {
  return (
    <>
    <LogoutButton/>
    <div className='p-4 sm:p-8 flex flex-col justify-center items-center h-screen pt-[30vh]'>{children}</div>
    </>
  )
}