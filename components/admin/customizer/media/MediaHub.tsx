'use client'

import { useState } from 'react'
import { 
  Upload, Image as ImageIcon, Scissors, Wand2, Sparkles, MessageSquare,
  ChevronRight, CheckCircle, X
} from 'lucide-react'
import { 
  MediaHubOverlay, ImageEditor, BackgroundRemoval, AltTextGenerator, PromptToSection, UploadFile 
} from './'

type TabType = 'upload' | 'editor' | 'background' | 'alttext' | 'prompt'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  description: string
}

const tabs: Tab[] = [
  { 
    id: 'upload', 
    label: 'Media Upload', 
    icon: <Upload size={16} />,
    description: 'Bulk upload files or import from URLs with parallel processing'
  },
  { 
    id: 'editor', 
    label: 'Image Editor', 
    icon: <ImageIcon size={16} />,
    description: 'Crop images and apply filters using Canvas API'
  },
  { 
    id: 'background', 
    label: 'AI Background Removal', 
    icon: <Scissors size={16} />,
    description: 'Remove backgrounds using Replicate API (SDXL)'
  },
  { 
    id: 'alttext', 
    label: 'AI Alt-text & Tags', 
    icon: <Wand2 size={16} />,
    description: 'Generate accessibility text and auto-tags with Gemini Vision'
  },
  { 
    id: 'prompt', 
    label: 'AI Prompt-to-Section', 
    icon: <MessageSquare size={16} />,
    description: 'Chat with AI to generate UI sections from natural language'
  },
]

export function MediaHub() {
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [isHubOpen, setIsHubOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [backgroundOpen, setBackgroundOpen] = useState(false)
  const [altTextOpen, setAltTextOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)

  const handleUploadComplete = (files: UploadFile[]) => {
    setUploadedFiles(files)
    if (files.length > 0) {
      setCurrentImage(files[0].preview || files[0].url || null)
    }
  }

  const handleImageEdit = (editedImage: string) => {
    setCurrentImage(editedImage)
    setEditorOpen(false)
  }

  const handleBackgroundRemoved = (resultImage: string) => {
    setCurrentImage(resultImage)
    setBackgroundOpen(false)
  }

  const handleAltTextGenerated = (data: { altText: string; tags: string[] }) => {
    console.log('Alt text:', data.altText, 'Tags:', data.tags)
    setAltTextOpen(false)
  }

  const handleSectionGenerated = (section: { html: string; css: string }) => {
    console.log('Generated section:', section)
    setPromptOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Media Hub & AI Tools</h2>
          <p className="text-sm text-gray-400 mt-1">Upload, edit, and generate media with AI</p>
        </div>
        <button
          onClick={() => setIsHubOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Upload size={16} />
          Open Media Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              activeTab === tab.id
                ? 'bg-indigo-900/30 border-indigo-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              activeTab === tab.id ? 'bg-indigo-600' : 'bg-gray-700'
            }`}>
              {tab.icon}
            </div>
            <h3 className="font-medium text-white">{tab.label}</h3>
            <p className="text-xs text-gray-400 mt-1">{tab.description}</p>
          </button>
        ))}
      </div>

      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-sm font-medium text-white mb-4">Current Image</h3>
        {currentImage ? (
          <div className="flex gap-4">
            <div className="w-48 h-48 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <img src={currentImage} alt="Current" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setEditorOpen(true)}
                  className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <ImageIcon size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setBackgroundOpen(true)}
                  className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <Scissors size={14} />
                  Remove BG
                </button>
                <button
                  onClick={() => setAltTextOpen(true)}
                  className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <Wand2 size={14} />
                  AI Alt-text
                </button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="text-xs text-gray-400">
                  {uploadedFiles.length} file(s) uploaded
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No image selected. Use Media Hub to upload images.</p>
        )}
      </div>

      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <button
          onClick={() => setPromptOpen(true)}
          className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-3"
        >
          <MessageSquare size={20} className="text-indigo-400" />
          <span className="text-gray-400">Open AI Prompt-to-Section Generator</span>
        </button>
      </div>

      <MediaHubOverlay
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {editorOpen && currentImage && (
        <ImageEditor
          imageSrc={currentImage}
          onSave={handleImageEdit}
          onCancel={() => setEditorOpen(false)}
        />
      )}

      {backgroundOpen && currentImage && (
        <BackgroundRemoval
          imageSrc={currentImage}
          onSave={handleBackgroundRemoved}
          onCancel={() => setBackgroundOpen(false)}
        />
      )}

      {altTextOpen && currentImage && (
        <AltTextGenerator
          imageSrc={currentImage}
          onSave={handleAltTextGenerated}
          onCancel={() => setAltTextOpen(false)}
        />
      )}

      {promptOpen && (
        <PromptToSection
          onSave={handleSectionGenerated}
          onCancel={() => setPromptOpen(false)}
        />
      )}
    </div>
  )
}