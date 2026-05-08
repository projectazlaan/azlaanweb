'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ScanLine, Sparkles, Save, Plus, X, Check, Settings2, RefreshCw } from 'lucide-react';
// ---------- Types ----------
type Warehouse = 'main' | 'store';
type Variant = { id: string; size: string; color: string; sku: string; stock: { [key in Warehouse]: number }; };
type Product = { id: string; name: string; metaTitle: string; metaDescription: string; variants: Variant[]; };
// ---------- Mock Data ----------
const initialProduct: Product = {
  id: 'prod_1', name: 'Urban Cargo Loose Fit', metaTitle: '', metaDescription: '',
  variants: [
    { id: 'v1', size: 'M', color: 'Olive', sku: 'UC-M-OL', stock: { main: 12, store: 5 } },
    { id: 'v2', size: 'L', color: 'Olive', sku: 'UC-L-OL', stock: { main: 8, store: 2 } },
  ],
};
// ---------- AI SEO Mock ----------
const mockSeoGeneration = async (productName: string) => {
  return new Promise<{title: string, description: string}>(resolve => {
    setTimeout(() => resolve({
      title: `${productName} – Premium Quality | Azlaan`,
      description: `Shop the ${productName}. Best selling item. Free shipping over ৳5000. Limited stock.`
    }), 1200);
  });
};
// ---------- Barcode Scanner Modal ----------
const BarcodeScanner = ({ onScan, onClose }: { onScan: (sku: string) => void; onClose: () => void; }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const simulateScan = () => {
    if (!cameraActive) {
      setCameraActive(true);
      setTimeout(() => { setScanned(true); onScan('UC-M-OL'); setTimeout(() => onClose(), 500); }, 1500);
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><ScanLine className="w-5 h-5 text-blue-600" /> Barcode Scanner</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-gray-50 rounded-2xl h-48 flex flex-col items-center justify-center overflow-hidden relative border-2 border-dashed border-gray-200">
          {!cameraActive && <p className="text-gray-400 font-bold text-sm">Tap "Activate Camera"</p>}
          {cameraActive && !scanned && <div className="animate-pulse text-blue-600 font-black">Scanning...</div>}
          {scanned && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-green-600"><Check className="w-8 h-8" /><span className="font-black mt-2">Scanned!</span></motion.div>}
          <div className="absolute inset-4 border-2 border-dashed border-blue-500/30 rounded-xl pointer-events-none" />
        </div>
        <button onClick={simulateScan} disabled={cameraActive && !scanned} className="mt-6 w-full bg-black text-white py-4 rounded-xl font-black transition-all hover:scale-105 disabled:opacity-50">
          {cameraActive && !scanned ? 'Scanning...' : scanned ? 'Done' : 'Activate Camera'}
        </button>
      </motion.div>
    </motion.div>
  );
};
// ---------- Variant Matrix Builder ----------
const VariantMatrix = ({ variants, onUpdate }: { variants: Variant[]; onUpdate: (v: Variant[]) => void; }) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [ { name: 'Olive', hex: '#6B705C' }, { name: 'Dusty Pink', hex: '#E2A9BE' }, { name: 'Sand', hex: '#C2A77A' } ];
  const toggleVariant = (size: string, color: string) => {
    const existing = variants.find(v => v.size === size && v.color === color);
    let newVariants = [...variants];
    if (existing) newVariants = newVariants.filter(v => v.id !== existing.id);
    else newVariants.push({ id: `v_${size}_${color}_${Date.now()}`, size, color, sku: `SKU-${size}-${color.slice(0, 2).toUpperCase()}`, stock: { main: 0, store: 0 } });
    onUpdate(newVariants);
  };
  const isActive = (size: string, color: string) => variants.some(v => v.size === size && v.color === color);
  return (
    <div className="space-y-6 pt-6 border-t border-gray-100">
      <h3 className="font-black text-gray-900 flex items-center gap-2"><Settings2 className="w-5 h-5 text-gray-500" /> Auto Variant Builder</h3>
      <div className="grid grid-cols-[auto,1fr] gap-3">
        <div />
        {colors.map(color => (
          <div key={color.name} className="flex justify-center items-center gap-1.5"><span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: color.hex }} /><span className="text-[10px] font-black uppercase text-gray-500">{color.name}</span></div>
        ))}
        {sizes.map(size => (
          <div key={size} className="contents">
            <div className="flex items-center justify-end pr-4 font-black text-gray-900">{size}</div>
            {colors.map(color => (
              <motion.button key={`${size}-${color.name}`} whileTap={{ scale: 0.9 }} onClick={() => toggleVariant(size, color.name)} className={`p-3 rounded-2xl border-2 flex items-center justify-center transition-all ${isActive(size, color.name) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:border-gray-400 text-gray-400'}`}>
                {isActive(size, color.name) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </motion.button>
            ))}
          </div>
        ))}
      </div>
      <div className="grid gap-3 pt-4">
        <AnimatePresence>
          {variants.map(variant => (
            <motion.div key={variant.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-gray-50 rounded-2xl p-4 flex flex-wrap items-center gap-4 border border-gray-100">
              <div className="flex items-center gap-3 min-w-[140px]">
                <span className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: colors.find(c => c.name === variant.color)?.hex || '#ccc' }} />
                <span className="font-black text-gray-900">{variant.size} / {variant.color}</span>
              </div>
              <div className="flex items-center gap-2 flex-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</span><input value={variant.sku} onChange={e => { const nv = variants.map(v => v.id === variant.id ? { ...v, sku: e.target.value } : v); onUpdate(nv); }} className="w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-black" /></div>
              <div className="flex items-center gap-3 ml-auto">
                <WarehouseToggle warehouse="main" label="Main" value={variant.stock.main} onChange={val => { const nv = variants.map(v => v.id === variant.id ? { ...v, stock: { ...v.stock, main: val } } : v); onUpdate(nv); }} />
                <WarehouseToggle warehouse="store" label="Store" value={variant.stock.store} onChange={val => { const nv = variants.map(v => v.id === variant.id ? { ...v, stock: { ...v.stock, store: val } } : v); onUpdate(nv); }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
const WarehouseToggle = ({ label, value, onChange }: { warehouse: Warehouse; label: string; value: number; onChange: (val: number) => void; }) => (
  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200">
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
    <input type="number" min="0" value={value} onChange={e => onChange(parseInt(e.target.value) || 0)} className="w-12 text-center text-sm font-black bg-transparent outline-none" />
  </div>
);
// ---------- Main Page ----------
export default function InventoryPage() {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [seoLoading, setSeoLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const saveProduct = () => alert('✅ Variants and Product saved to Database');
  const handleGenerateSeo = async () => {
    setSeoLoading(true);
    const generated = await mockSeoGeneration(product.name);
    setProduct(p => ({ ...p, metaTitle: generated.title, metaDescription: generated.description }));
    setSeoLoading(false);
  };
  const handleBarcodeScan = (sku: string) => {
    const variant = product.variants.find(v => v.sku === sku);
    if (variant) {
      const nv = product.variants.map(v => v.id === variant.id ? { ...v, stock: { ...v.stock, main: v.stock.main + 1 } } : v);
      setProduct({ ...product, variants: nv });
      alert(`📷 Scanned ${sku} – stock updated`);
    }
  };
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-blue-600" /> Advanced PIM
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage AI variants, multi-warehouse stock & barcode updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowScanner(true)} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-3 rounded-full text-sm font-black transition-all">
            <ScanLine className="w-4 h-4" /> Scanner
          </button>
          <button onClick={saveProduct} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:scale-105 transition-all">
            <Save className="w-4 h-4" /> Save Setup
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-8">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Base Product Name</label>
          <input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} className="w-full text-3xl font-black outline-none border-b-2 border-dashed border-gray-200 focus:border-black pb-2 transition-colors text-gray-900" placeholder="e.g. Urban Cargo Loose Fit" />
        </div>
        <VariantMatrix variants={product.variants} onUpdate={nv => setProduct({ ...product, variants: nv })} />
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-indigo-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> AI SEO Engine</h4>
            <button disabled={seoLoading} onClick={handleGenerateSeo} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-sm font-black text-indigo-600 shadow-sm hover:scale-105 transition-all disabled:opacity-50">
              {seoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {seoLoading ? 'Thinking...' : 'Auto-Generate'}
            </button>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Meta Title</label>
              <input value={product.metaTitle} onChange={e => setProduct({ ...product, metaTitle: e.target.value })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none shadow-sm" placeholder="AI will generate this..." />
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Meta Description</label>
              <textarea rows={2} value={product.metaDescription} onChange={e => setProduct({ ...product, metaDescription: e.target.value })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none shadow-sm resize-none" placeholder="AI will generate this..." />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showScanner && <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setShowScanner(false)} />}
      </AnimatePresence>
    </div>
  );
}
