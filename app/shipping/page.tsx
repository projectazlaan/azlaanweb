import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
        <p>At Azlaan, we strive to deliver your premium handcrafted products as quickly and safely as possible.</p>
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">Delivery Timeline</h2>
          <p>Inside Dhaka: 2-3 business days</p>
          <p>Outside Dhaka: 3-5 business days</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-black mb-4">Shipping Costs</h2>
          <p>Standard delivery charges apply based on your location and order volume. Free shipping is available for orders over BDT 10,000.</p>
        </section>
      </div>
      <Link href="/" className="inline-block mt-12 text-sm font-bold uppercase tracking-widest text-[#0071E3] hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
