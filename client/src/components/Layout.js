import NavBar from './NavBar';

export default function Layout({children}) {
  return (
    <>
    <NavBar />
    <div className='p-4 sm:p-8'>{children}</div>
    </>
  )
}