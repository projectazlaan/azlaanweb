'use client'

import { useState, useEffect } from 'react'
import { GitBranch, Cloud, RotateCcw, Clock, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { 
  getVersions, 
  createVersion, 
  getDraft, 
  saveDraft, 
  publishToProduction, 
  syncDraftToProduction, 
  rollbackToVersion, 
  deleteVersion, 
  getVersionHistory,
  getProductionVersion,
  exportVersionData,
  importVersionData,
  Version 
} from '@/lib/versioning'

interface StagingVersioningProps {
  pageId?: string
  currentContent?: any
}

export default function StagingVersioning({ 
  pageId = 'main-page', 
  currentContent = {} 
}: StagingVersioningProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [draft, setDraft] = useState<Version | null>(null)
  const [production, setProduction] = useState<Version | null>(null)
  const [note, setNote] = useState('')
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null)
  const [importJson, setImportJson] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadData()
  }, [pageId])

  const loadData = () => {
    setVersions(getVersionHistory(pageId))
    setDraft(getDraft(pageId))
    setProduction(getProductionVersion(pageId))
  }

  const handleSaveDraft = () => {
    const version = saveDraft(pageId, currentContent)
    setDraft(version)
    loadData()
  }

  const handlePublishToProduction = () => {
    const version = publishToProduction(pageId, currentContent, note || undefined)
    setProduction(version)
    setNote('')
    loadData()
  }

  const handleSyncToProduction = () => {
    const result = syncDraftToProduction(pageId)
    setSyncResult({ success: result.success, message: result.message })
    if (result.success) {
      loadData()
    }
    setTimeout(() => setSyncResult(null), 5000)
  }

  const handleRollback = (versionId: string) => {
    const rolledBack = rollbackToVersion(pageId, versionId)
    if (rolledBack) {
      setProduction(rolledBack)
      loadData()
    }
  }

  const handleDeleteVersion = (versionId: string) => {
    if (confirm('Are you sure you want to delete this version?')) {
      deleteVersion(pageId, versionId)
      loadData()
    }
  }

  const handleExportData = () => {
    const data = exportVersionData(pageId)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `version-history-${pageId}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    if (!importJson.trim()) return
    const success = importVersionData(importJson)
    if (success) {
      loadData()
      setImportJson('')
      alert('Import successful!')
    } else {
      alert('Import failed. Please check the JSON format.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'text-green-400 bg-green-900/30 border-green-700'
      case 'staging': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700'
      case 'draft': return 'text-blue-400 bg-blue-900/30 border-blue-700'
      default: return 'text-gray-400 bg-gray-800 border-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <GitBranch size={18} className="text-indigo-400" />
          Staging & Versioning
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <Clock size={14} />
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>
      </div>

      {syncResult && (
        <div className={`p-3 rounded-lg border text-sm ${
          syncResult.success 
            ? 'bg-green-900/30 border-green-700 text-green-200' 
            : 'bg-red-900/30 border-red-700 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {syncResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {syncResult.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={16} className="text-blue-400" />
            <h4 className="text-sm font-medium text-white">Draft</h4>
            {draft && (
              <span className="ml-auto text-xs text-gray-400">
                v{draft.versionNumber}
              </span>
            )}
          </div>
          
          {draft ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                Created: {new Date(draft.createdAt).toLocaleString()}
              </p>
              {draft.note && (
                <p className="text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  {draft.note}
                </p>
              )}
              <button
                onClick={handleSyncToProduction}
                className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
              >
                <Cloud size={14} />
                Sync to Production
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500">No draft saved</p>
          )}
          
          <button
            onClick={handleSaveDraft}
            className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Save Draft
          </button>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-400" />
            <h4 className="text-sm font-medium text-white">Production</h4>
            {production && (
              <span className="ml-auto text-xs text-gray-400">
                v{production.versionNumber}
              </span>
            )}
          </div>
          
          {production ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                Published: {new Date(production.createdAt).toLocaleString()}
              </p>
              {production.note && (
                <p className="text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  {production.note}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No production version</p>
          )}
          
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Release notes (optional)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handlePublishToProduction}
              className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
            >
              <Cloud size={14} />
              Publish to Production
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Clock size={16} />
            Version History
          </h4>
          
          {versions.length === 0 ? (
            <p className="text-xs text-gray-500">No versions yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-auto">
              {versions.map(version => (
                <div 
                  key={version.id} 
                  className={`p-3 rounded border text-xs ${getStatusColor(version.status)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">v{version.versionNumber}</span>
                    <span className="capitalize">{version.status}</span>
                  </div>
                  <p className="text-gray-400">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                  {version.note && (
                    <p className="mt-1 text-gray-300">{version.note}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {version.status !== 'production' && (
                      <button
                        onClick={() => handleRollback(version.id)}
                        className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw size={10} />
                        Rollback
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteVersion(version.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Upload size={16} />
          Import Version Data
        </h4>
        <textarea
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste version data JSON here..."
          className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-xs font-mono resize-none focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleImportData}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
        >
          Import Data
        </button>
      </div>
    </div>
  )
}

function Upload(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
