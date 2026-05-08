import { MapPin, Phone, Mail, Clock } from 'lucide-react';
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const isBangla = resolvedSearchParams?.lang === 'bn';
  return (
    <main className="min-h-screen pt-24 pb-12">
      <section className="relative h-48 sm:h-64 md:h-80 bg-primary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              {isBangla ? 'যোগাযোগ' : 'Contact Us'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg">
              {isBangla ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in touch with us'}
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white p-5 md:p-6 rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-secondary/10 rounded-lg">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-sm md:text-base text-primary">Address</h3>
                  <p className="text-text-muted text-sm">
                    123 Fashion Avenue<br />
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-secondary/10 rounded-lg">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-sm md:text-base text-primary">Phone</h3>
                  <p className="text-text-muted text-sm">+880 123-456-789</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-secondary/10 rounded-lg">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-sm md:text-base text-primary">Email</h3>
                  <p className="text-text-muted text-sm">info@azlaan.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 md:p-6 rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-secondary/10 rounded-lg">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-sm md:text-base text-primary">
                    {isBangla ? 'খোলার সময়' : 'Opening Hours'}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {isBangla ? 'শনি - বৃহস্পতি: সকাল ১০টা - রাত ৮টা' : 'Sat - Thu: 10:00 AM - 8:00 PM'}<br />
                    {isBangla ? 'শুক্রবার: বন্ধ' : 'Friday: Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 md:p-8 rounded-2xl">
            <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-6 text-primary">
              {isBangla ? 'মেসেজ পাঠান' : 'Send Message'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-primary">
                  {isBangla ? 'নাম' : 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={isBangla ? 'আপনার নাম' : 'Your name'}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-primary">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-primary">
                  {isBangla ? 'মেসেজ' : 'Message'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-border-light rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={isBangla ? 'আপনার মেসেজ লিখুন...' : 'Write your message...'}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors cursor-pointer text-sm md:text-base"
              >
                {isBangla ? 'মেসেজ পাঠান' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
