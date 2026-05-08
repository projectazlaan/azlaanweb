'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Pencil, X, UploadCloud, ChevronDown, ChevronUp, Loader2, Eye, EyeOff } from 'lucide-react';
/* ─── Types ─────────────────────────────────────────── */
type Slide = {
  id: string; title: string; subtitle: string;
  description: string; bgImage: string;
  cta1Text: string; cta1Link: string;
  cta2Text: string; cta2Link: string;
};
type Testimonial = {
  id: string; name: string; nameBn: string;
  location: string; locationBn: string;
  review: string; reviewBn: string;
  image: string; rating: number;
};
type SectionToggle = { key: string; label: string; enabled: boolean };
/* ─── Default Data ───────────────────────────────────── */
const DEFAULT_SLIDES: Slide[] = [
  { id: 's1', title: 'Handcrafted Elegance', subtitle: 'Azlaan Premium Quality', description: 'Discover ethically made, artisan-crafted products that blend tradition with contemporary style.', bgImage: '/media-pro/cover/cover 1.jpg', cta1Text: 'Explore Now', cta1Link: '/shop', cta2Text: 'Learn More', cta2Link: '/about' },
  { id: 's2', title: 'Winter Warmth', subtitle: 'Stay Cozy, Look Sharp', description: 'Premium woolens and modern silhouettes for the cold season.', bgImage: '/media-pro/cover/cover 2.jpg', cta1Text: 'Shop Winter', cta1Link: '/men', cta2Text: 'View Lookbook', cta2Link: '/about' },
  { id: 's3', title: 'New Arrivals', subtitle: 'Fresh Designs Just For You', description: 'Explore our latest collection of handcrafted fashion and lifestyle products.', bgImage: '/media-pro/cover/cover 3.jpg', cta1Text: 'Discover', cta1Link: '/women', cta2Text: 'All Styles', cta2Link: '/shop' },
];
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Rahim Khan', nameBn: 'রহিম খান', location: 'Dhaka', locationBn: 'ঢাকা', review: 'The quality of Azlaan suits is unmatched in Bangladesh. Truly premium feel and perfect fit!', reviewBn: 'আজলানের স্যুটের মান বাংলাদেশে অপ্রতিদ্বন্দ্বী।', image: '', rating: 5 },
  { id: 't2', name: 'Sarah Ahmed', nameBn: 'সারাহ আহমেদ', location: 'Chittagong', locationBn: 'চট্টগ্রাম', review: 'Elegant designs and comfortable fabric. Azlaan has become my go-to brand for festive wear.', reviewBn: 'বিশুদ্ধ ডিজাইন এবং আরামদায়ক কাপড়।', image: '', rating: 5 },
];
const DEFAULT_TOGGLES: SectionToggle[] = [
  { key: 'hero', label: 'Hero Slider', enabled: true },
  { key: 'featured', label: 'Featured Products', enabled: true },
  { key: 'brand_story', label: 'Brand Story / Our Story', enabled: true },
  { key: 'testimonials', label: 'Customer Reviews', enabled: true },
  { key: 'newsletter', label: 'Newsletter / Inner Circle', enabled: true },
  { key: 'reels', label: 'Videos / Reels Section', enabled: true },
  { key: 'announcement', label: 'Top Announcement Bar', enabled: true },
];
/* ─── Helpers ────────────────────────────────────────── */
function SectionCard({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
        <h3 className="font-black text-gray-900 text-lg">{title}</h3>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 text-gray-900 font-medium text-sm resize-none transition-colors" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 text-gray-900 font-medium text-sm transition-colors" />
      )}
    </div>
  );
}
/* ─── Main Page ──────────────────────────────────────── */
export default function HomepageControl() {
  const [open, setOpen] = useState<Record<string, boolean>>({ hero: true });
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [toggles, setToggles] = useState<SectionToggle[]>(DEFAULT_TOGGLES);
  const [announcement, setAnnouncement] = useState('🚚 Free Delivery on orders above ৳2,000');
  const [brandStory, setBrandStory] = useState({ en: 'Azlaan was born from a vision to redefine premium fashion in Bangladesh.', bn: 'আজলান বাংলাদেশে প্রিমিয়াম ফ্যাশনের এক নতুন ধারণা নিয়ে আসে।', clients: '500+', products: '200+', years: '5+' });
  const [newsletter, setNewsletter] = useState({ title: 'Register & Get Free Delivery.', subtitle: 'Join the Azlaan Inner Circle today and enjoy complimentary shipping on your first order.' });
  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState<string | null>(null);
  const toggleSection = (key: string) => setOpen(o => ({ ...o, [key]: !o[key] }));
  const updateSlide = (id: string, field: keyof Slide, value: string) => {
    setSlides(s => s.map(sl => sl.id === id ? { ...sl, [field]: value } : sl));
  };
  const addSlide = () => {
    const id = `s${Date.now()}`;
    setSlides(s => [...s, { id, title: 'New Slide', subtitle: 'Subtitle here', description: 'Description...', bgImage: '', cta1Text: 'Shop Now', cta1Link: '/shop', cta2Text: 'Learn More', cta2Link: '/about' }]);
    setActiveSlide(id);
  };
  const removeSlide = (id: string) => setSlides(s => s.filter(sl => sl.id !== id));
  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(t => t.map(te => te.id === id ? { ...te, [field]: value } : te));
  };
  const addTestimonial = () => {
    const id = `t${Date.now()}`;
    setTestimonials(t => [...t, { id, name: 'New Customer', nameBn: 'নতুন কাস্টমার', location: 'Dhaka', locationBn: 'ঢাকা', review: 'Great product!', reviewBn: 'দারুণ পণ্য!', image: '', rating: 5 }]);
    setActiveTestimonial(id);
  };
  const removeTestimonial = (id: string) => setTestimonials(t => t.filter(te => te.id !== id));
  const toggleSectionVisibility = (key: string) => {
    setToggles(ts => ts.map(t => t.key === key ? { ...t, enabled: !t.enabled } : t));
  };
  const handleSave = async () => {
    setSaved(true);
    // Save to DB
    const payload: Record<string, string> = {
      announcement_text: announcement,
      brand_story_en: brandStory.en,
      brand_story_bn: brandStory.bn,
      brand_story_clients: brandStory.clients,
      brand_story_products: brandStory.products,
      brand_story_years: brandStory.years,
      newsletter_title: newsletter.title,
      newsletter_subtitle: newsletter.subtitle,
      // Serialize arrays as JSON strings
      hero_slides_json: JSON.stringify(slides),
      testimonials_json: JSON.stringify(testimonials),
    };
    // Add visibility toggles
    toggles.forEach(t => {
      payload[`section_${t.key}_enabled`] = t.enabled ? 'true' : 'false';
    });
    await fetch('/api/admin/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Homepage Control</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Click any section to edit it. Changes go live when you save.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${saved ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>
          <Save className="w-5 h-5" /> {saved ? '✅ Saved!' : 'Save All Changes'}
        </button>
      </div>
      {/* ── Section Visibility Toggles ── */}
      <SectionCard title="⚡ Section Visibility (On/Off)" open={!!open['visibility']} onToggle={() => toggleSection('visibility')}>
        <div className="space-y-3">
          {toggles.map(t => (
            <div key={t.key} className="flex items-center justify-between py-2">
              <span className="font-semibold text-gray-800 text-sm">{t.label}</span>
              <button onClick={() => toggleSectionVisibility(t.key)} className={`relative w-12 h-6 rounded-full transition-colors ${t.enabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${t.enabled ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
      {/* ── Announcement Bar ── */}
      <SectionCard title="📢 Announcement Bar (Top of Site)" open={!!open['announcement']} onToggle={() => toggleSection('announcement')}>
        <Field label="Announcement Text" value={announcement} onChange={setAnnouncement} />
        <p className="text-xs text-gray-400 mt-2 font-medium">This shows as a thin bar at the very top of every page.</p>
      </SectionCard>
      {/* ── Hero Slider ── */}
      <SectionCard title="🎬 Hero Slider (Homepage Banner)" open={!!open['hero']} onToggle={() => toggleSection('hero')}>
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div
                onClick={() => setActiveSlide(activeSlide === slide.id ? null : slide.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{slide.title}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {activeSlide === slide.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <AnimatePresence>
                {activeSlide === slide.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100">
                      <Field label="Title" value={slide.title} onChange={v => updateSlide(slide.id, 'title', v)} />
                      <Field label="Subtitle" value={slide.subtitle} onChange={v => updateSlide(slide.id, 'subtitle', v)} />
                      <Field label="Description" value={slide.description} onChange={v => updateSlide(slide.id, 'description', v)} textarea />
                      <Field label="Background Image Path" value={slide.bgImage} onChange={v => updateSlide(slide.id, 'bgImage', v)} />
                      <Field label="Button 1 Text" value={slide.cta1Text} onChange={v => updateSlide(slide.id, 'cta1Text', v)} />
                      <Field label="Button 1 Link" value={slide.cta1Link} onChange={v => updateSlide(slide.id, 'cta1Link', v)} />
                      <Field label="Button 2 Text" value={slide.cta2Text} onChange={v => updateSlide(slide.id, 'cta2Text', v)} />
                      <Field label="Button 2 Link" value={slide.cta2Link} onChange={v => updateSlide(slide.id, 'cta2Link', v)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button onClick={addSlide} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-300 text-gray-400 hover:text-blue-500 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add New Slide
          </button>
        </div>
      </SectionCard>
      {/* ── Brand Story ── */}
      <SectionCard title="📖 Brand Story / Our Story" open={!!open['brandstory']} onToggle={() => toggleSection('brandstory')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Story Text (English)" value={brandStory.en} onChange={v => setBrandStory(b => ({ ...b, en: v }))} textarea />
          <Field label="Story Text (বাংলা)" value={brandStory.bn} onChange={v => setBrandStory(b => ({ ...b, bn: v }))} textarea />
          <Field label="Clients / Customers Count" value={brandStory.clients} onChange={v => setBrandStory(b => ({ ...b, clients: v }))} />
          <Field label="Products Count" value={brandStory.products} onChange={v => setBrandStory(b => ({ ...b, products: v }))} />
          <Field label="Years in Business" value={brandStory.years} onChange={v => setBrandStory(b => ({ ...b, years: v }))} />
        </div>
      </SectionCard>
      {/* ── Testimonials ── */}
      <SectionCard title="⭐ Customer Reviews (Testimonials)" open={!!open['testimonials']} onToggle={() => toggleSection('testimonials')}>
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div
                onClick={() => setActiveTestimonial(activeTestimonial === t.id ? null : t.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-sm flex-shrink-0">
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">{t.review}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); removeTestimonial(t.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {activeTestimonial === t.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <AnimatePresence>
                {activeTestimonial === t.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100">
                      <Field label="Name (English)" value={t.name} onChange={v => updateTestimonial(t.id, 'name', v)} />
                      <Field label="Name (বাংলা)" value={t.nameBn} onChange={v => updateTestimonial(t.id, 'nameBn', v)} />
                      <Field label="Location (English)" value={t.location} onChange={v => updateTestimonial(t.id, 'location', v)} />
                      <Field label="Location (বাংলা)" value={t.locationBn} onChange={v => updateTestimonial(t.id, 'locationBn', v)} />
                      <Field label="Review (English)" value={t.review} onChange={v => updateTestimonial(t.id, 'review', v)} textarea />
                      <Field label="Review (বাংলা)" value={t.reviewBn} onChange={v => updateTestimonial(t.id, 'reviewBn', v)} textarea />
                      <Field label="Photo URL / Path" value={t.image} onChange={v => updateTestimonial(t.id, 'image', v)} />
                      <div>
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => updateTestimonial(t.id, 'rating', star)} className={`w-9 h-9 rounded-xl font-black text-sm transition-colors ${t.rating >= star ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-300'}`}>
                              {star}★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button onClick={addTestimonial} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-300 text-gray-400 hover:text-blue-500 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add New Review
          </button>
        </div>
      </SectionCard>
      {/* ── Newsletter ── */}
      <SectionCard title="💌 Newsletter / Inner Circle Section" open={!!open['newsletter']} onToggle={() => toggleSection('newsletter')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Title" value={newsletter.title} onChange={v => setNewsletter(n => ({ ...n, title: v }))} />
          <Field label="Subtitle / Description" value={newsletter.subtitle} onChange={v => setNewsletter(n => ({ ...n, subtitle: v }))} textarea />
        </div>
      </SectionCard>
    </div>
  );
}
