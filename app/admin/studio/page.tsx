'use client';
import dynamic from 'next/dynamic';
// Import the editor component with SSR disabled
const StudioEditorFull = dynamic(() => import('@/components/admin/StudioEditorFull'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-medium animate-pulse">Loading Full Studio Library...</p>
      </div>
    </div>
  )
});
export default function StudioPage() {
  return <StudioEditorFull />;
}
