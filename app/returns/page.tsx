import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>
      <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
        <p>Your satisfaction is our priority. If you are not completely satisfied with your purchase, we are here to help.</p>
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">Return Policy</h2>
          <p>You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">Exchanges</h2>
          <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at our customer support.</p>
        </section>
      </div>
      <Link href="/" className="inline-block mt-12 text-sm font-bold uppercase tracking-widest text-[#0071E3] hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
