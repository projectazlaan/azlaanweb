'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Sparkles, ArrowUp, Zap, Package, RotateCcw, Star,
  ChevronRight, X, Check, Heart, RefreshCw, Shirt,
  Search, CornerDownLeft, Minimize2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

/* ─────────────────────── TYPES ─────────────────────── */
type MessageKind =
  | 'text' | 'loader' | 'prompt_builder' | 'carousel'
  | 'order_tracker' | 'size_finder' | 'swipe_deck'
  | 'return_flow' | 'deals' | 'rating';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  kind: MessageKind;
  text?: string;
  products?: Product[];
}

/* ─────────────────────── CONSTANTS ─────────────────────── */
const SLASH_COMMANDS = [
  { cmd: '/track',  icon: Package,   labelBn: '/ট্র্যাক',  descBn: 'অর্ডারের বর্তমান অবস্থা', labelEn: '/track',  descEn: 'Live order status' },
  { cmd: '/find',   icon: Search,    labelBn: '/খোঁজো',   descBn: 'স্মার্ট আউটফিট বিল্ডার', labelEn: '/find',   descEn: 'Smart outfit builder' },
  { cmd: '/size',   icon: Shirt,     labelBn: '/সাইজ',    descBn: 'সঠিক সাইজ বের করুন',    labelEn: '/size',   descEn: 'Find your perfect size' },
  { cmd: '/deals',  icon: Zap,       labelBn: '/ডিল',     descBn: 'সেরা ছাড়ের অফার',       labelEn: '/deals',  descEn: 'Best discount offers' },
  { cmd: '/return', icon: RotateCcw, labelBn: '/রিটার্ন', descBn: 'পণ্য ফেরত বা এক্সচেঞ্জ', labelEn: '/return', descEn: 'Return or exchange item' },
];

const LOADING_TEXTS_BN = ['সংগ্রহ স্ক্যান হচ্ছে...', 'পছন্দ বিশ্লেষণ হচ্ছে...', 'পারফেক্ট ম্যাচ খোঁজা হচ্ছে...', 'ফলাফল প্রস্তুত হচ্ছে...'];
const LOADING_TEXTS_EN = ['Scanning collection...', 'Analysing your taste...', 'Finding perfect match...', 'Preparing results...'];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

/* ═══════════════════════════════════════════════════════
   INTENT DETECTION ENGINE
   Covers: বাংলা · English · Banglish (Romanized Bengali)
═══════════════════════════════════════════════════════ */
const INTENT_MAP: [string[], string][] = [
  // ── TRACK ORDER ──────────────────────────────────────
  [[
    // English
    'track','order status','where is my order','my order','delivery status',
    'parcel','shipment','shipping','dispatch','out for delivery','delivered',
    'when will i get','estimated delivery','courier',
    // বাংলা
    'ট্র্যাক','অর্ডার','ডেলিভারি','পার্সেল','কোথায়','কখন আসবে',
    'অর্ডার কোথায়','অর্ডার স্ট্যাটাস','কুরিয়ার','পৌঁছাবে','পাঠানো হয়েছে',
    // Banglish
    'amar order','order kothay','order ki holo','order track','delivery kobe',
    'parcel kothay','shipment status','order status','kobe ashbe','courier status',
    'order diechi','order koreci','order koresi','order pelam na','order pailam na',
  ], '/track'],

  // ── FIND OUTFIT ──────────────────────────────────────
  [[
    // English
    'find outfit','show clothes','show me','outfit','dress','clothing','collection',
    'panjabi','kurta','shirt','saree','salwar','kameez','lehenga','suit','sherwani',
    'fabric','new arrival','latest collection','browse','shop','buy','purchase',
    // বাংলা
    'পোশাক','কাপড়','পাঞ্জাবি','কুর্তা','শার্ট','শাড়ি','পোশাক খুঁজুন',
    'দেখাও','দেখান','খুঁজে দাও','কী কিনবো','নতুন','কালেকশন','নিতে চাই','কিনতে চাই',
    // Banglish
    'poshak','kapor','kapd','panjabi','kurta dekhao','dress dekhao','ki kinbo',
    'ki nibo','poshak khujchi','outfit khujchi','notun ki ache','collection dekhao',
    'kinte chai','nite chai','show koro','dekhao','ki ache','ki pabo',
  ], '/find'],

  // ── SIZE FINDER ──────────────────────────────────────
  [[
    // English
    'size','fit','fitting','small','medium','large','xl','xxl','what size','my size',
    'size chart','measurement','height','weight','which size',
    // বাংলা
    'সাইজ','মাপ','কত সাইজ','আমার সাইজ','কোন সাইজ','ফিটিং','উচ্চতা','ওজন',
    // Banglish
    'saiz','amar size','koto size','size ki hobe','konta size nibo','fit hobe ki',
    'size chart','size guide','size koto','size janin','size bolo',
  ], '/size'],

  // ── DEALS ────────────────────────────────────────────
  [[
    // English
    'deal','deals','discount','offer','sale','promo','coupon','voucher','flash sale',
    'best price','cheap','affordable','budget','low price','off','percent off',
    // বাংলা
    'ডিল','ছাড়','অফার','সেল','কম দাম','সস্তা','সেরা দাম','ডিসকাউন্ট',
    'প্রমো','আজকের অফার','কুপন',
    // Banglish
    'deal ache ki','kono offer ache','discount ache','sale ache','kom dame',
    'shosta kono kichu','best deal','flash deal','ajker deal','kono promo',
    'voucher ache','off ache','ছার','chhar','chhad','shad',
  ], '/deals'],

  // ── STYLE SUGGESTIONS (SWIPE) ─────────────────────────
  [[
    // English
    'suggest','suggestion','recommend','recommendation','style','trending',
    'fashion','what to wear','inspire me','idea','pick for me','surprise me',
    'popular','hot right now','best seller','top pick',
    // বাংলা
    'সাজেস্ট','সাজেশন','পছন্দ করে দাও','কী পরব','ট্রেন্ডিং','স্টাইল',
    'ইন্সপায়ার','আইডিয়া দাও','বেস্টসেলার','জনপ্রিয়',
    // Banglish
    'suggest koro','ki porbo','style idea','trending ki','fashion ki','konta valo',
    'ami ki porbo','amar jonno ki valo hobe','popular ki','hot ki ache','idea dao',
    'inspire koro','pick kore dao','surprise koro',
  ], '/swipe'],

  // ── RETURN / EXCHANGE ─────────────────────────────────
  [[
    // English
    'return','exchange','refund','replace','replacement','send back','wrong item',
    'damaged','defective','not happy','complaint','problem','issue',
    // বাংলা
    'রিটার্ন','ফেরত','এক্সচেঞ্জ','রিফান্ড','পছন্দ হয়নি','সমস্যা','নষ্ট',
    'ভুল পণ্য','বদলাতে চাই','ফেরত দিতে চাই','ক্যান্সেল',
    // Banglish
    'return dite chai','ferot dite chai','exchange korte chai','refund chai',
    'poshak valo na','product valo na','notun ta dao','bodlate chai',
    'cancel korte chai','problem ache','item nosto','damaged ache','wrong item',
  ], '/return'],
];

function detectIntent(text: string): string | null {
  const lower = text.toLowerCase().normalize('NFC');
  for (const [keywords, cmd] of INTENT_MAP) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) return cmd;
  }
  return null;
}

/* Friendly echo message for each detected intent */
const INTENT_ECHO: Record<string, { bn: string; en: string }> = {
  '/track':  { bn: 'অর্ডার ট্র্যাক করে দেখছি...', en: 'Let me track your order...' },
  '/find':   { bn: 'পারফেক্ট পোশাক খুঁজে দিচ্ছি!', en: 'Finding the perfect outfit for you!' },
  '/size':   { bn: 'সাইজ ফাইন্ডার চালু হচ্ছে...', en: 'Opening size finder...' },
  '/deals':  { bn: 'আজকের সেরা ডিল লোড হচ্ছে!', en: 'Loading best deals for today!' },
  '/swipe':  { bn: 'আপনার জন্য স্টাইল সাজেশন আনছি!', en: 'Fetching style picks just for you!' },
  '/return': { bn: 'রিটার্ন প্রক্রিয়া শুরু করছি...', en: 'Starting return process...' },
};

/* ═══════════════════════════════════════════════════════
   CHAT CORE — shared by popup & full page
   onClose: only provided in popup mode
═══════════════════════════════════════════════════════ */
export default function ChatCore({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState('');
  const [slashOpen, setSlashOpen] = useState(false);
  const [products, setProducts]   = useState<Product[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [lang, setLang]           = useState<'bn' | 'en'>('bn');
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS_BN[0]);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const timerRef    = useRef<NodeJS.Timeout | null>(null);

  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  /* products */
  useEffect(() => {
    import('@/data/products.json').then(d => setProducts((d.default as Product[]).slice(0, 12)));
  }, []);

  /* greeting */
  useEffect(() => {
    const id = setTimeout(() =>
      setMessages([{ id: uid(), sender: 'bot', kind: 'text',
        text: t('আসসালামু আলাইকুম! আমি Azlaan Concierge। আপনাকে কীভাবে সাহায্য করতে পারি?',
                 'Hello! I\'m Azlaan Concierge. How can I help you today?') }])
    , 500);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* scroll */
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* cycling loader text */
  const startLoader = useCallback(() => {
    let i = 0;
    const texts = lang === 'bn' ? LOADING_TEXTS_BN : LOADING_TEXTS_EN;
    setLoadingText(texts[0]);
    timerRef.current = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 600);
  }, [lang]);
  const stopLoader = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  /* message helpers */
  const push = (msg: ChatMessage) => setMessages(p => [...p, msg]);
  const pushBot  = (kind: MessageKind, text?: string, prods?: Product[]) =>
    push({ id: uid(), sender: 'bot', kind, text, products: prods });
  const pushUser = (text: string) => { push({ id: uid(), sender: 'user', kind: 'text', text }); setChatStarted(true); };

  const withLoader = (ms: number, cb: () => void) => {
    const lid = uid();
    startLoader();
    setMessages(p => [...p, { id: lid, sender: 'bot', kind: 'loader' }]);
    setTimeout(() => { stopLoader(); setMessages(p => p.filter(m => m.id !== lid)); cb(); }, ms);
  };

  /* command handler */
  const handleCommand = (cmd: string) => {
    setSlashOpen(false); setInput('');
    if (cmd === '/track')  { pushUser(t('অর্ডার ট্র্যাক করতে চাই','I want to track my order')); withLoader(1400, () => pushBot('order_tracker')); }
    else if (cmd === '/find')   { pushUser(t('পোশাক খুঁজতে চাই','I want to find an outfit')); withLoader(900, () => pushBot('prompt_builder')); }
    else if (cmd === '/size')   { pushUser(t('আমার সাইজ জানতে চাই','I want to find my size')); withLoader(900, () => pushBot('size_finder')); }
    else if (cmd === '/deals')  {
      pushUser(t('সেরা ডিল দেখাও','Show me today\'s deals'));
      withLoader(1200, () => {
        pushBot('text', t('🔥 আজকের সেরা অফার! সীমিত সময়ের জন্য:','🔥 Today\'s best deals! Limited time:'));
        setTimeout(() => pushBot('deals', undefined, products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 6)), 300);
      });
    }
    else if (cmd === '/return') { pushUser(t('পণ্য ফেরত দিতে চাই','I want to return an item')); withLoader(900, () => pushBot('return_flow')); }
    else if (cmd === '/swipe')  {
      pushUser(t('আমাকে সাজেস্ট করো','Give me style suggestions'));
      withLoader(1000, () => {
        pushBot('text', t('পছন্দ হলে ❤️, না হলে ✕ চাপুন:','Swipe ❤️ to like, ✕ to skip:'));
        setTimeout(() => pushBot('swipe_deck', undefined, products.slice(0, 5)), 300);
      });
    }
  };

  const handleSend = () => {
    const v = input.trim(); if (!v) return;
    setInput(''); setSlashOpen(false);

    // 1. Exact slash command
    if (v.startsWith('/') && SLASH_COMMANDS.find(c => c.cmd === v)) {
      handleCommand(v); return;
    }

    // 2. Intent detection — Bangla / English / Banglish
    const intent = detectIntent(v);
    if (intent) {
      const echo = INTENT_ECHO[intent];
      pushUser(v);
      // Show smart acknowledgement then route to the feature
      setTimeout(() => {
        setMessages(p => [...p, { id: uid(), sender: 'bot', kind: 'text', text: t(echo.bn, echo.en) }]);
        setTimeout(() => handleCommand(intent), 600);
      }, 180);
      setChatStarted(true);
      return;
    }

    // 3. Fallback — show outfit builder
    pushUser(v);
    withLoader(1100, () => {
      pushBot('text', t(
        'বুঝতে পেরেছি! আপনার জন্য সেরা অপশনগুলো নিচে দেখুন 👇',
        'Got it! Here are the best options for you 👇'
      ));
      setTimeout(() => pushBot('prompt_builder'), 350);
    });
  };

  const handlePromptSubmit = (sel: { category: string; occasion: string; color: string; price: string }) => {
    pushUser(`${t('আমি একটি','I am looking for a')} ${sel.color} ${sel.category} ${t('খুঁজছি','')}, ${t('যা পরবো','for a')} ${sel.occasion}${t('-এ','')}${t(', দাম ৳',', under ৳')}${sel.price}${t('-এর মধ্যে','.')}`);
    withLoader(2000, () => {
      pushBot('text', t(`দারুণ! ${products.length} টি পোশাক খুঁজে পেয়েছি:`, `Found ${products.length} great matches for you:`));
      setTimeout(() => pushBot('carousel', undefined, products), 400);
    });
  };

  const handleSwipeComplete = (liked: Product[]) => {
    withLoader(1500, () => {
      pushBot('text', liked.length > 0
        ? t(`আপনার রুচি বুঝে গেছি! ${liked.length}টি পোশাক পছন্দ। এই স্টাইলে আরো:`, `Got your taste! You liked ${liked.length} items. See more like this:`)
        : t('মনমতো না পেলে চিন্তা নেই! নতুন কালেকশন শীঘ্রই আসছে।','No worries! New collection dropping soon.'));
      if (liked.length > 0) setTimeout(() => pushBot('carousel', undefined, liked), 300);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#EFEDE8]">

      {/* ── HEADER ── */}
      <div className="shrink-0 bg-white/95 backdrop-blur-xl border-b border-black/[0.06] px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="relative">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-[12px] uppercase tracking-widest leading-none">Azlaan Concierge</h2>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
            {t('সবসময় অনলাইন', 'Always Online')}
          </p>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')}
          className="shrink-0 flex items-center bg-black/5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'bn' ? 'bg-black text-white' : 'text-black/40'}`}>বাং</span>
          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-black text-white' : 'text-black/40'}`}>ENG</span>
        </button>

        {/* Close / Minimize (popup mode only) */}
        {onClose && (
          <button onClick={onClose} className="ml-1 w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors shrink-0">
            <Minimize2 className="w-3.5 h-3.5 text-black/50" />
          </button>
        )}
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-4 scrollbar-none" style={{ overscrollBehavior: 'contain' }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MsgBubble
              key={msg.id}
              msg={msg}
              onPromptSubmit={handlePromptSubmit}
              onSwipeComplete={handleSwipeComplete}
              onCommand={handleCommand}
              loadingText={loadingText}
              t={t}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── QUICK SUGGESTIONS (glass pills, right-aligned) ── */}
      <AnimatePresence>
        {!chatStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="shrink-0 px-3 md:px-4 pb-2 flex flex-col items-end gap-1.5"
          >
            {[
              { bn: 'অর্ডার ট্র্যাক করুন', en: 'Track my Order',      emoji: '📦', cmd: '/track'  },
              { bn: 'পোশাক খুঁজুন',        en: 'Find an Outfit',      emoji: '👔', cmd: '/find'   },
              { bn: 'সাইজ বের করুন',       en: 'Find my Size',        emoji: '📏', cmd: '/size'   },
              { bn: 'আজকের ডিল দেখুন',     en: "Today's Deals",       emoji: '🔥', cmd: '/deals'  },
              { bn: 'স্টাইল সাজেশন নিন',   en: 'Get Style Picks',     emoji: '❤️', cmd: '/swipe'  },
              { bn: 'রিটার্ন / এক্সচেঞ্জ', en: 'Return or Exchange',  emoji: '↩️', cmd: '/return' },
            ].map((chip, i) => (
              <motion.button
                key={chip.cmd}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ delay: i * 0.065, type: 'spring', stiffness: 360, damping: 30 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCommand(chip.cmd)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/65 hover:border-white/90 transition-all shadow-sm"
              >
                <span className="text-sm leading-none">{chip.emoji}</span>
                <span className="text-[11px] font-semibold text-neutral-700 whitespace-nowrap">{t(chip.bn, chip.en)}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SLASH COMMAND MENU ── */}
      <AnimatePresence>
        {slashOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="shrink-0 mx-3 md:mx-4 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/10 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-black/[0.05]">
              <p className="text-[9px] font-black uppercase tracking-widest text-black/30">{t('কমান্ড', 'Commands')}</p>
            </div>
            {SLASH_COMMANDS.map(({ cmd, icon: Icon, labelBn, descBn, labelEn, descEn }) => (
              <button key={cmd} onClick={() => handleCommand(cmd)}
                className="w-full text-left px-4 py-3 hover:bg-black/5 transition-colors flex items-center gap-3 border-b border-black/[0.04] last:border-0">
                <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-black/60" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest">{t(labelBn, labelEn)}</p>
                  <p className="text-[10px] text-black/40 mt-0.5">{t(descBn, descEn)}</p>
                </div>
                <CornerDownLeft className="w-3 h-3 text-black/20 ml-auto shrink-0" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INPUT BAR ── */}
      <div className="shrink-0 px-3 md:px-4 pt-2 pb-3">
        <div className="relative bg-white rounded-full shadow-md border border-black/10 flex items-center p-1.5 gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setSlashOpen(e.target.value === '/'); }}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); if (e.key === 'Escape') setSlashOpen(false); }}
            placeholder={t('বাংলা, English বা Banglish-এ লিখুন...', 'Type in Bangla, English or Banglish...')}
            className="flex-1 bg-transparent px-3 outline-none text-[13px] font-medium placeholder:text-black/30 min-w-0"
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
            className="w-9 h-9 bg-black rounded-full flex items-center justify-center shrink-0">
            <ArrowUp className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════════════════════ */
function MsgBubble({ msg, onPromptSubmit, onSwipeComplete, onCommand, loadingText, t }:
  { msg: ChatMessage; onPromptSubmit: (s: any) => void; onSwipeComplete: (l: Product[]) => void;
    onCommand: (c: string) => void; loadingText: string; t: (bn: string, en: string) => string }) {
  const isUser = msg.sender === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      {!isUser && msg.kind === 'loader' && <div className="w-7 mr-2" />}

      <div className={`max-w-[85%] ${['carousel','deals','swipe_deck'].includes(msg.kind) ? 'w-full max-w-full' : ''}`}>
        {msg.kind === 'text' && (
          <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm
            ${isUser ? 'bg-black text-white rounded-tr-sm' : 'bg-white text-neutral-800 rounded-tl-sm border border-black/[0.06]'}`}>
            {msg.text}
          </div>
        )}
        {msg.kind === 'loader' && (
          <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] px-5 py-3 shadow-sm flex items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw className="w-3.5 h-3.5 text-black/40" />
            </motion.div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-black/40">{loadingText}</span>
          </div>
        )}
        {msg.kind === 'prompt_builder' && <MadLibsBuilder onSubmit={onPromptSubmit} t={t} />}
        {msg.kind === 'carousel'        && <ProductCarousel products={msg.products || []} />}
        {msg.kind === 'deals'           && <DealsWidget products={msg.products || []} />}
        {msg.kind === 'order_tracker'   && <OrderTracker t={t} />}
        {msg.kind === 'size_finder'     && <SizeFinder t={t} />}
        {msg.kind === 'swipe_deck'      && <SwipeDeck products={msg.products || []} onComplete={onSwipeComplete} t={t} />}
        {msg.kind === 'return_flow'     && <ReturnFlow t={t} />}
        {msg.kind === 'rating'          && <RatingWidget t={t} />}
      </div>
    </motion.div>
  );
}

/* ─── MAD LIBS ─── */
function MadLibsBuilder({ onSubmit, t }: { onSubmit: (s: any) => void; t: (bn: string, en: string) => string }) {
  const [category, setCategory] = useState('পাঞ্জাবি');
  const [occasion, setOccasion] = useState('বিয়েতে');
  const [color, setColor]       = useState('কালো');
  const [price, setPrice]       = useState('৳৫০০০');
  const sel = `px-2.5 py-1.5 rounded-xl bg-black text-white font-bold text-[13px] cursor-pointer outline-none mx-1 appearance-none`;
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-black rounded-l-2xl" />
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-3.5 h-3.5" />
        <span className="text-[9px] font-black uppercase tracking-widest text-black/40">{t('স্মার্ট আউটফিট বিল্ডার','Smart Outfit Builder')}</span>
      </div>
      <p className="text-[14px] font-medium text-neutral-700 leading-[2.8] flex flex-wrap items-center">
        {t('আমি একটি','I want a')}
        <select value={color} onChange={e => setColor(e.target.value)} className={sel}>
          <option>কালো</option><option>সাদা</option><option>নেভি ব্লু</option><option>বেজ</option><option>Black</option><option>White</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} className={sel}>
          <option>পাঞ্জাবি</option><option>কুর্তা</option><option>শার্ট</option><option>শাড়ি</option><option>Panjabi</option><option>Kurta</option><option>Shirt</option>
        </select>
        {t(' খুঁজছি, যা পরবো',' for')}
        <select value={occasion} onChange={e => setOccasion(e.target.value)} className={sel}>
          <option>বিয়েতে</option><option>ঈদে</option><option>অফিসে</option><option>পার্টিতে</option><option>Wedding</option><option>Eid</option><option>Office</option>
        </select>
        {t(', দাম',', under')}
        <select value={price} onChange={e => setPrice(e.target.value)} className={sel}>
          <option>৳৩০০০</option><option>৳৫০০০</option><option>৳১০,০০০</option><option>৳২০,০০০</option>
        </select>
        {t('-এর মধ্যে।','.')}
      </p>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSubmit({ category, occasion, color, price })}
        className="mt-4 w-full bg-black text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition-colors">
        {t('পারফেক্ট পোশাক খুঁজে দাও →', 'Find My Perfect Match →')}
      </motion.button>
    </div>
  );
}

/* ─── PRODUCT CAROUSEL ─── */
function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
      {products.slice(0, 8).map(p => (
        <Link key={p.id} href={`/product/${p.slug}`}
          className="shrink-0 w-[130px] md:w-[150px] bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow group">
          <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
            <Image src={(p.images?.[0] || p.image) ?? ''} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="150px" />
            {p.badge && <span className="absolute top-2 left-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white rounded-sm">{p.badge}</span>}
          </div>
          <div className="p-2">
            <p className="text-[10px] font-bold line-clamp-2 text-neutral-800 leading-tight">{p.name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-black">৳{p.price.toLocaleString()}</span>
              {p.originalPrice && p.originalPrice > p.price && (
                <span className="text-[8px] text-gray-400 line-through">৳{p.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── DEALS ─── */
function DealsWidget({ products }: { products: Product[] }) {
  return (
    <div className="bg-black rounded-2xl rounded-tl-sm p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">Flash Deals · সীমিত সময়</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
        {products.map(p => {
          const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
          return (
            <Link key={p.id} href={`/product/${p.slug}`} className="shrink-0 w-[110px] bg-white/10 hover:bg-white/20 transition-colors rounded-xl overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Image src={(p.images?.[0] || p.image) ?? ''} alt={p.name} fill className="object-cover" sizes="110px" />
                {disc > 0 && <div className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black rounded-full px-1 py-0.5">-{disc}%</div>}
              </div>
              <div className="p-1.5">
                <p className="text-white text-[9px] font-bold line-clamp-1">{p.name}</p>
                <p className="text-yellow-400 text-[10px] font-black">৳{p.price.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ORDER TRACKER ─── */
function OrderTracker({ t }: { t: (bn: string, en: string) => string }) {
  const steps = [
    { bn: 'অর্ডার কনফার্ম',          en: 'Order Confirmed',     time: t('গতকাল, বিকাল ৩:২০','Yesterday, 3:20 PM'),  done: true },
    { bn: 'ওয়্যারহাউস থেকে পাঠানো',  en: 'Shipped from Warehouse', time: t('আজকে, সকাল ৯:৩০','Today, 9:30 AM'),    done: true },
    { bn: 'ডেলিভারিতে রওনা',          en: 'Out for Delivery',   time: t('আজকে, দুপুর ১২:০০','Today, 12:00 PM'), done: true, active: true },
    { bn: 'ডেলিভারি সম্পন্ন',         en: 'Delivered',          time: t('আনুমানিক রাত ৮:০০','Est. 8:00 PM'),       done: false },
  ];
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-5 shadow-sm w-full max-w-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-black/30">{t('অর্ডার নম্বর','Order Number')}</p>
          <p className="font-black text-sm tracking-wider">#AZL-9842</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded-full">{t('পথে আছে','In Transit')}</span>
      </div>
      <div className="relative pl-5 border-l-2 border-black/10 space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white shadow
              ${s.done ? s.active ? 'bg-black scale-125' : 'bg-black' : 'bg-gray-200'}`} />
            <p className={`text-[12px] font-bold ${s.active ? 'text-black' : s.done ? 'text-black/70' : 'text-black/30'}`}>{t(s.bn, s.en)}</p>
            <p className="text-[10px] text-black/40 mt-0.5">{s.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SIZE FINDER ─── */
function SizeFinder({ t }: { t: (bn: string, en: string) => string }) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const getSize = () => {
    const bmi = weight / ((height / 100) ** 2);
    if (bmi < 18.5) return { size: 'S',   tip: t('স্লিম ফিট পারফেক্ট','Slim fit is perfect for you') };
    if (bmi < 23)   return { size: 'M',   tip: t('রেগুলার ফিট সবচেয়ে ভালো','Regular fit is your best bet') };
    if (bmi < 27)   return { size: 'L',   tip: t('রিল্যাক্সড ফিট ভালো লাগবে','Relaxed fit will feel great') };
    if (bmi < 30)   return { size: 'XL',  tip: t('কমফোর্ট ফিট বেছে নিন','Comfort fit recommended') };
    return           { size: 'XXL', tip: t('ওভারসাইজড ট্রেন্ডি!','Oversized is trending!') };
  };
  const { size, tip } = getSize();
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-4 shadow-sm w-full max-w-xs">
      <div className="flex items-center gap-2 mb-4">
        <Shirt className="w-3.5 h-3.5" />
        <span className="text-[9px] font-black uppercase tracking-widest text-black/40">{t('সাইজ ফাইন্ডার','Size Finder')}</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">{t('উচ্চতা','Height')}</label>
            <span className="text-[12px] font-black">{height} {t('সেমি','cm')}</span>
          </div>
          <input type="range" min={150} max={200} value={height} onChange={e => setHeight(+e.target.value)} className="w-full accent-black h-1.5 rounded-full cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">{t('ওজন','Weight')}</label>
            <span className="text-[12px] font-black">{weight} {t('কেজি','kg')}</span>
          </div>
          <input type="range" min={40} max={120} value={weight} onChange={e => setWeight(+e.target.value)} className="w-full accent-black h-1.5 rounded-full cursor-pointer" />
        </div>
      </div>
      <motion.div key={size} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="mt-4 bg-black text-white rounded-xl p-3.5 flex items-center gap-4">
        <div className="text-5xl font-black leading-none">{size}</div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-0.5">{t('আপনার সাইজ','Your Size')}</p>
          <p className="text-[11px] text-white/80 font-medium">{tip}</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── SWIPE DECK ─── */
function SwipeDeck({ products, onComplete, t }:
  { products: Product[]; onComplete: (liked: Product[]) => void; t: (bn: string, en: string) => string }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked]     = useState<Product[]>([]);
  const x = useMotionValue(0);
  const rotate  = useTransform(x, [-150, 150], [-18, 18]);
  const likeOp  = useTransform(x, [20, 100], [0, 1]);
  const nopeOp  = useTransform(x, [-100, -20], [1, 0]);

  const swipe = (dir: 'left' | 'right') => {
    const p = products[current];
    const newLiked = dir === 'right' ? [...liked, p] : liked;
    const next = current + 1;
    if (next >= products.length) { onComplete(newLiked); }
    else {
      animate(x, dir === 'right' ? 300 : -300, { duration: 0.3 }).then(() => { x.set(0); setCurrent(next); setLiked(newLiked); });
    }
  };

  if (current >= products.length) return null;
  const card = products[current];

  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-3.5 shadow-sm w-full max-w-[240px]">
      <div className="flex justify-between mb-2.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/30">{t('পছন্দ করুন','Pick your style')}</span>
        <span className="text-[9px] font-bold text-black/40">{current + 1} / {products.length}</span>
      </div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <motion.div style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => { if (info.offset.x > 80) swipe('right'); else if (info.offset.x < -80) swipe('left'); }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing">
          <Image src={(card.images?.[0] || card.image) ?? ''} alt={card.name} fill className="object-cover" sizes="240px" />
          <motion.div style={{ opacity: likeOp }} className="absolute top-3 left-3 bg-green-500 text-white text-sm font-black px-2 py-1 rounded-xl rotate-[-12deg]">❤️ {t('পছন্দ','Like')}</motion.div>
          <motion.div style={{ opacity: nopeOp }} className="absolute top-3 right-3 bg-red-500 text-white text-sm font-black px-2 py-1 rounded-xl rotate-[12deg]">✕ {t('না','Nope')}</motion.div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-white text-[12px] font-bold">{card.name}</p>
            <p className="text-white/60 text-[10px]">৳{card.price.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-2.5 mt-2.5">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => swipe('left')}
          className="flex-1 py-2 border-2 border-red-200 text-red-500 rounded-xl font-black text-base hover:bg-red-50 transition-colors">✕</motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => swipe('right')}
          className="flex-1 py-2 border-2 border-green-200 text-green-500 rounded-xl font-black text-base hover:bg-green-50 transition-colors">❤️</motion.button>
      </div>
    </div>
  );
}

/* ─── RETURN FLOW ─── */
function ReturnFlow({ t }: { t: (bn: string, en: string) => string }) {
  const [step, setStep]     = useState(0);
  const [reason, setReason] = useState('');
  const [type, setType]     = useState('');
  const reasons = [t('সাইজ ঠিক হয়নি','Wrong size'), t('রং আশানুরূপ না','Color not as expected'), t('পণ্য নষ্ট এসেছে','Item arrived damaged'), t('অন্য কারণ','Other reason')];
  const types   = [t('রিফান্ড চাই','I want a refund'), t('এক্সচেঞ্জ চাই','I want an exchange')];

  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-4 shadow-sm w-full max-w-xs">
      <div className="flex items-center gap-2 mb-4">
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="text-[9px] font-black uppercase tracking-widest text-black/40">{t('রিটার্ন / এক্সচেঞ্জ','Return / Exchange')}</span>
      </div>
      {/* Step dots */}
      <div className="flex items-center gap-1 mb-4">
        {[0,1,2,3].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-black' : 'bg-black/10'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-[12px] font-medium text-neutral-600 mb-3">{t('আপনার অর্ডার:','Your order:')}</p>
            <div className="bg-black/5 rounded-xl px-4 py-3 font-black text-sm tracking-wider mb-4">#AZL-9842</div>
            <button onClick={() => setStep(1)} className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">{t('এগিয়ে যান →','Continue →')}</button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-[12px] font-medium mb-3">{t('কারণ বলুন:','Select a reason:')}</p>
            <div className="space-y-1.5 mb-4">
              {reasons.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${reason === r ? 'bg-black text-white border-black' : 'border-black/10 hover:border-black/30'}`}>
                  {r}
                </button>
              ))}
            </div>
            <button disabled={!reason} onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30">{t('এগিয়ে যান →','Continue →')}</button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-[12px] font-medium mb-3">{t('আপনি কী চান?','What would you prefer?')}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {types.map(tp => (
                <button key={tp} onClick={() => setType(tp)}
                  className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${type === tp ? 'bg-black text-white border-black' : 'border-black/10 hover:border-black/30'}`}>
                  {tp}
                </button>
              ))}
            </div>
            <button disabled={!type} onClick={() => setStep(3)} className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30">{t('নিশ্চিত করুন','Confirm')}</button>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </motion.div>
            <h3 className="font-black text-sm mb-1">{t('রিকোয়েস্ট পাঠানো হয়েছে!','Request Submitted!')}</h3>
            <p className="text-[10px] text-black/40 font-medium leading-relaxed">{t('২৪ ঘণ্টার মধ্যে যোগাযোগ করা হবে।','We will contact you within 24 hours.')}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mt-2">REF: RTN-2024-581</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── RATING ─── */
function RatingWidget({ t }: { t: (bn: string, en: string) => string }) {
  const [sel, setSel] = useState(0);
  const [done, setDone] = useState(false);
  const emojis = ['😞','😕','😐','😊','🤩'];
  const labels = [t('খুব খারাপ','Very Poor'), t('খারাপ','Poor'), t('ঠিকঠাক','Okay'), t('ভালো','Good'), t('অসাধারণ!','Excellent!')];
  if (done) return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-4 text-center shadow-sm">
      <div className="text-3xl mb-1">{emojis[sel - 1]}</div>
      <p className="font-black text-sm">{t('ধন্যবাদ!','Thank you!')}</p>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm border border-black/[0.06] p-4 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-3">{t('আমাদের রেটিং দিন','Rate your experience')}</p>
      <div className="flex justify-between mb-3">
        {emojis.map((e, i) => (
          <motion.button key={i} whileTap={{ scale: 0.8 }} onClick={() => setSel(i + 1)}
            className={`text-2xl transition-all ${sel === i + 1 ? 'scale-125' : 'opacity-40 hover:opacity-70'}`}>{e}</motion.button>
        ))}
      </div>
      {sel > 0 && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-center text-[11px] font-bold mb-3">{labels[sel - 1]}</p>
          <button onClick={() => setDone(true)} className="w-full bg-black text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">{t('জমা দিন','Submit')}</button>
        </motion.div>
      )}
    </div>
  );
}
