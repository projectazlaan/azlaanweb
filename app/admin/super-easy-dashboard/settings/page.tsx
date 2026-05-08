'use client';
import { motion } from 'framer-motion';
import { Save, Link, Smartphone, Globe, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: 'Azlaan',
    tagline: 'Premium Bangladeshi Ethnics',
    contactEmail: 'hello@azlaan.com',
    phoneNumber: '+880 17XX XXXXXX',
    facebook: 'https://facebook.com/azlaan',
    instagram: 'https://instagram.com/azlaan',
    youtube: 'https://youtube.com/@azlaan',
    whatsapp: '+880 17XX XXXXXX',
    deliveryCharge: '100',
    freeDeliveryThreshold: '2000',
    premierPrice: '1000',
    loyaltyRate: '10',
  });
  const handleChange = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const SECTIONS = [
    {
      title: '🏠 Brand Info',
      icon: Globe,
      fields: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contactEmail', label: 'Contact Email', type: 'email' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text' },
      ],
    },
    {
      title: '🔗 Social Links',
      icon: Link,
      fields: [
        { key: 'facebook', label: 'Facebook Page URL', type: 'url' },
        { key: 'instagram', label: 'Instagram URL', type: 'url' },
        { key: 'youtube', label: 'YouTube Channel URL', type: 'url' },
        { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      ],
    },
    {
      title: '🚚 Delivery & Pricing',
      icon: Smartphone,
      fields: [
        { key: 'deliveryCharge', label: 'Standard Delivery Charge (৳)', type: 'number' },
        { key: 'freeDeliveryThreshold', label: 'Free Delivery Above (৳)', type: 'number' },
        { key: 'premierPrice', label: 'Premier Membership Price / Year (৳)', type: 'number' },
        { key: 'loyaltyRate', label: 'Loyalty Points per ৳100 Spent', type: 'number' },
      ],
    },
  ];
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Settings</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Control every micro-detail of your brand from here.</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${saved ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>
          <Save className="w-5 h-5" /> {saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>
      {/* Setting Groups */}
      {SECTIONS.map((section, si) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.12 }}
          key={section.title}
          className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-8 py-5 border-b border-gray-100">
            <h3 className="font-black text-gray-900">{section.title}</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="w-full border border-gray-200 hover:border-gray-300 focus:border-blue-400 rounded-2xl px-5 py-4 outline-none text-gray-900 font-medium transition-colors text-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-red-50 border-2 border-red-100 rounded-[2rem] overflow-hidden"
      >
        <div className="px-8 py-5 border-b border-red-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-500" />
          <h3 className="font-black text-red-700">Danger Zone</h3>
        </div>
        <div className="p-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-100 py-4 px-6 rounded-2xl font-bold transition-colors">
            Clear All Orders (Archived)
          </button>
          <button className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-100 py-4 px-6 rounded-2xl font-bold transition-colors">
            Reset Flash Sale Timers
          </button>
        </div>
      </motion.div>
    </div>
  );
}
