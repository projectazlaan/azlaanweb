import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Azlaan',
  description: 'Read the Privacy Policy for Azlaan Premium clothing brand.',
};

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide when placing an order or creating an account, including your name, email address, shipping address, and payment details. We also collect usage data to improve our services.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to process orders, communicate with you about your purchases, improve our website, and send you promotional offers (with your consent).',
  },
  {
    title: '3. Data Security',
    body: 'We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology.',
  },
  {
    title: '4. Sharing of Information',
    body: 'We do not sell or rent your personal information to third parties. We may share data with trusted service providers who assist in operating our website and processing orders.',
  },
  {
    title: '5. Cookies',
    body: 'Our website uses cookies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at support@azlaan.com.',
  },
  {
    title: '7. Updates to This Policy',
    body: 'We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice on our website.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black">Privacy Policy</h1>
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
