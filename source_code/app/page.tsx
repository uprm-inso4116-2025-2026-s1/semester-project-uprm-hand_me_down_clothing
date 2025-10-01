import Link from 'next/link';

export default function Home() {
  return (
    <main className='p-6'>
      <div>
        Hello world!
      </div>
      <div className="text-black">
        <Link href="/listings/donate_piece" className="inline-block border rounded-lg p-2">
          Donate Page
        </Link>
      </div>
    </main>
  );
}
