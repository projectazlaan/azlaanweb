import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Azlaan',
  description: 'Read the Terms of Service for Azlaan Premium clothing brand.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the Azlaan website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: '2. Products & Pricing',
    body: 'All products are subject to availability. Prices are listed in BDT and may change without notice. We reserve the right to refuse or cancel orders at our discretion.',
  },
  {
    title: '3. Orders & Payment',
    body: 'Orders are confirmed upon successful payment. We accept major payment methods available at checkout. All transactions are encrypted and secure.',
  },
  {
    title: '4. Shipping & Delivery',
    body: 'Delivery timelines vary by location. Please refer to our Shipping Policy for detailed information on delivery estimates and charges.',
  },
  {
    title: '5. Returns & Refunds',
    body: 'We offer returns within 7 days of delivery for eligible items. Please review our Returns Policy for full terms and conditions.',
  },
  {
    title: '6. Intellectual Property',
    body: 'All content on this website, including images, text, and branding, is the property of Azlaan Premium and may not be used without written permission.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'Azlaan shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We reserve the right to update these Terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black">Terms of Service</h1>
          <p className="text-sm text-neutral-500 mt-4 font-medium">Last updated: January 2026</p>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <h2 className="text-base font-black text-black mb-3 tracking-tight">{s.title}</h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
