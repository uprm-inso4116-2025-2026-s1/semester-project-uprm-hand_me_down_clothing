import Link from 'next/link';

export default function Home() {
  return (
    <main className='p-6'>
      <div>
        Hello world!
      </div>
      <div className="text-white">
        <Link href="/listings/sell_piece" className="inline-block rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-400">
          Go to Sell Page
        </Link>
      </div>
    </main>
  );
}
