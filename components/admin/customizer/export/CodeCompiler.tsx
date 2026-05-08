'use client'
import { useState } from 'react'
import { Code, Trash2, Download, CheckCircle } from 'lucide-react'
import { compileJSONToCleanCode, generatePageComponent } from '@/lib/export/compiler'
interface CodeCompilerProps {
  components?: any[]
}
export default function CodeCompiler({ components = [] }: CodeCompilerProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [output, setOutput] = useState('')
  const [cssOutput, setCssOutput] = useState('')
  const [unusedStyles, setUnusedStyles] = useState<string[]>([])
  const [compiled, setCompiled] = useState(false)
  const [error, setError] = useState('')
  const handleCompile = () => {
    try {
      setError('')
      let parsed: any[] = []
      if (jsonInput.trim()) {
        parsed = JSON.parse(jsonInput)
      } else if (components.length > 0) {
        parsed = components
      } else {
        setError('No JSON input or components provided')
        return
      }
      if (!Array.isArray(parsed)) {
        parsed = [parsed]
      }
      const result = compileJSONToCleanCode(parsed)
      setOutput(result.optimizedJSX)
      setCssOutput(result.globalCSS)
      setUnusedStyles(result.unusedStyles)
      setCompiled(true)
    } catch (err) {
      setError(`Compilation error: ${err instanceof Error ? err.message : 'Invalid JSON'}`)
    }
  }
  const handleExportJSX = () => {
    const pageComponent = generatePageComponent(
      jsonInput.trim() ? JSON.parse(jsonInput) : components,
      'ExportedPage'
    )
    const blob = new Blob([pageComponent], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ExportedPage.tsx'
    a.click()
    URL.revokeObjectURL(url)
  }
  const handlePurgeStyles = () => {
    try {
      const parsed = jsonInput.trim() ? JSON.parse(jsonInput) : components
      const { purgeUnusedStyles } = require('@/lib/export/compiler')
      const result = purgeUnusedStyles(
        Array.isArray(parsed) ? parsed : [parsed],
        cssOutput
      )
      setCssOutput(result.purgedCSS)
      setUnusedStyles(result.unusedStyles)
    } catch (err) {
      setError(`Purge error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Code size={18} className="text-indigo-400" />
          Clean Code Compiler
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCompile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Compile JSON
          </button>
          {compiled && (
            <button
              onClick={handleExportJSX}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Download size={14} />
              Export JSX
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">JSON Input</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste JSON or click "Use Current Components"'
            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-sm font-mono resize-none focus:border-indigo-500 focus:outline-none"
          />
          {components.length > 0 && (
            <button
              onClick={() => setJsonInput(JSON.stringify(components, null, 2))}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
            >
              Use Current Components
            </button>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Compiled JSX Output</label>
          <pre className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-xs font-mono overflow-auto">
            {output || 'Compiled code will appear here...'}
          </pre>
        </div>
      </div>
      {compiled && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Global CSS</label>
              <button
                onClick={handlePurgeStyles}
                className="text-xs px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Purge Unused
              </button>
            </div>
            <pre className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-xs font-mono overflow-auto">
              {cssOutput || 'No CSS generated'}
            </pre>
          </div>
          {unusedStyles.length > 0 && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-yellow-200 text-sm font-medium mb-2 flex items-center gap-1">
                <CheckCircle size={14} />
                {unusedStyles.length} Unused Style(s) Found
              </p>
              <div className="space-y-1 max-h-24 overflow-auto">
                {unusedStyles.map((style, idx) => (
                  <div key={idx} className="text-xs text-yellow-300 font-mono bg-yellow-900/20 p-1 rounded">
                    {style.substring(0, 100)}...
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-200 text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Code compiled successfully! Export as Next.js component or copy to clipboard.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
