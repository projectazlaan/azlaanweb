'use client';
import { motion } from 'framer-motion';
import { Star, Crown, Gift, Send, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';
const VIP_MEMBERS = [
  { id: 1, name: 'Nusrat Jahan', email: 'nusrat@email.com', tier: 'Platinum', points: 4850, totalSpent: '৳ 28,000', joined: 'Jan 2025', avatar: 'bg-pink-500', premier: true },
  { id: 2, name: 'Sajib Rahman', email: 'sajib@email.com', tier: 'Gold', points: 2320, totalSpent: '৳ 14,500', joined: 'Feb 2025', avatar: 'bg-blue-500', premier: false },
  { id: 3, name: 'Karim Uddin', email: 'karim@email.com', tier: 'Gold', points: 1800, totalSpent: '৳ 11,200', joined: 'Mar 2025', avatar: 'bg-green-600', premier: true },
  { id: 4, name: 'Mitu Akter', email: 'mitu@email.com', tier: 'Silver', points: 730, totalSpent: '৳ 4,600', joined: 'Apr 2025', avatar: 'bg-purple-500', premier: false },
  { id: 5, name: 'Farhan Islam', email: 'farhan@email.com', tier: 'Silver', points: 590, totalSpent: '৳ 3,700', joined: 'Apr 2025', avatar: 'bg-orange-500', premier: false },
];
const TIER_STYLE: Record<string, string> = {
  Platinum: 'bg-violet-100 text-violet-700',
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-700',
};
export default function VIPCircle() {
  const [selected, setSelected] = useState<number[]>([]);
  const [sent, setSent] = useState(false);
  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };
  const selectAll = () => setSelected(VIP_MEMBERS.map(m => m.id));
  const clearAll = () => setSelected([]);
  const sendGift = () => {
    setSent(true);
    setTimeout(() => { setSent(false); setSelected([]); }, 3000);
  };
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">VIP Inner Circle</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Your most loyal customers — treat them like royalty.</p>
        </div>
        {selected.length > 0 && (
          <button
            onClick={sendGift}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${sent ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-purple-200'}`}
          >
            {sent ? <><Star className="w-5 h-5" /> Sent!</> : <><Gift className="w-5 h-5" /> Send Gift to {selected.length} Members</>}
          </button>
        )}
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: VIP_MEMBERS.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Premier Members', value: VIP_MEMBERS.filter(m => m.premier).length, icon: Crown, color: 'text-amber-600 bg-amber-50' },
          { label: 'Points Issued', value: '9,290', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 text-center">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 font-bold mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Select Controls */}
      <div className="flex items-center gap-4">
        <button onClick={selectAll} className="text-sm font-bold text-blue-600 hover:underline">Select All</button>
        <button onClick={clearAll} className="text-sm font-bold text-gray-400 hover:underline">Clear</button>
        {selected.length > 0 && <span className="text-sm font-bold text-gray-600">{selected.length} selected</span>}
      </div>
      {/* Members List */}
      <div className="space-y-4">
        {VIP_MEMBERS.map((member, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
            key={member.id}
            onClick={() => toggleSelect(member.id)}
            className={`bg-white p-5 rounded-[1.5rem] shadow-sm border-2 flex items-center gap-4 cursor-pointer transition-all ${selected.includes(member.id) ? 'border-blue-400 shadow-blue-100 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
          >
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-full ${member.avatar} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-inner`}>
              {member.name.charAt(0)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${TIER_STYLE[member.tier]}`}>{member.tier}</span>
                {member.premier && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-black text-white flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premier
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-0.5">{member.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-bold text-amber-600">⭐ {member.points.toLocaleString()} pts</span>
                <span className="text-sm font-bold text-gray-400">Total: {member.totalSpent}</span>
              </div>
            </div>
            {/* Selection Indicator */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.includes(member.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
              {selected.includes(member.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
