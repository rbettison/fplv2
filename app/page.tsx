import Link from 'next/link'
import FPLogo from './components/global/FPlogo'

export default function Home() {
  return (
    <main className="p-8 grid grid-cols-2 items-center">
      <div className=''>
        <FPLogo />
      </div>
      <div>
        <p className='text-4xl'>Welcome to FPL Dash.</p>
        <p className='text-md font-bold'>Get more insight into your FPL leagues with detailed weekly summaries and shareable reports.</p>
        <p className='text-2xl mt-8'><Link className="underline text-[#E5002D]" href="/login">Log in</Link> to get started.</p>
      </div>
    </main>
  )
}
