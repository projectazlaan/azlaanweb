'use client'
import { useState } from 'react'
import { Zap, Accessibility, Search, Image, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react'
import { runFullAudit, generateWebPHtml, AuditResult } from '@/lib/audit/performance'
interface PerformanceAuditorProps {
  htmlContent?: string
  components?: any[]
}
export default function PerformanceAuditor({ htmlContent = '', components = [] }: PerformanceAuditorProps) {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [htmlInput, setHtmlInput] = useState(htmlContent)
  const [webpPreview, setWebpPreview] = useState('')
  const runAudit = () => {
    setLoading(true)
    setTimeout(() => {
      try {
        const html = htmlInput || generateMockHTML()
        const result = runFullAudit(html)
        setAuditResult(result)
      } catch (err) {
        console.error('Audit error:', err)
      }
      setLoading(false)
    }, 500)
  }
  const generateMockHTML = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Sample Page</title>
  <meta name="description" content="A sample page for auditing">
</head>
<body>
  <h1>Main Heading</h1>
  <img src="image1.jpg" alt="Sample image">
  <img src="image2.png">
  <button>Click me</button>
  <a href="/about">About</a>
  <a href="https://external.com">External</a>
</body>
</html>`
  }
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }
  const getRatingIcon = (rating: string) => {
    if (rating === 'good') return <CheckCircle size={16} className="text-green-400" />
    if (rating === 'needs-improvement') return <AlertTriangle size={16} className="text-yellow-400" />
    return <XCircle size={16} className="text-red-400" />
  }
  const handleWebPConversion = () => {
    if (!auditResult) return
    const html = htmlInput || generateMockHTML()
    const webp = generateWebPHtml(html)
    setWebpPreview(webp)
  }
  const handleDownloadReport = () => {
    if (!auditResult) return
    const report = {
      timestamp: new Date().toISOString(),
      score: auditResult.score,
      lcp: auditResult.lcp,
      accessibility: auditResult.accessibility,
      seo: auditResult.seo,
      webpConversion: auditResult.webpConversion,
      recommendations: auditResult.recommendations
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Zap size={18} className="text-indigo-400" />
          Performance & SEO Auditor
        </h3>
        <div className="flex gap-2">
          {auditResult && (
            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
            >
              <Download size={14} />
              Report
            </button>
          )}
          <button
            onClick={runAudit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Search size={14} />
            {loading ? 'Auditing...' : 'Run Audit'}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">HTML Content to Audit</label>
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          placeholder="Paste HTML content or leave empty for sample"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-xs font-mono resize-none focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {auditResult && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-medium">Overall Score</span>
              <span className={`text-3xl font-bold ${getScoreColor(auditResult.score)}`}>
                {auditResult.score}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  auditResult.score >= 90 ? 'bg-green-500' : 
                  auditResult.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${auditResult.score}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-sm text-gray-300">LCP</span>
                {getRatingIcon(auditResult.lcp.rating)}
              </div>
              <p className="text-xl font-bold text-white">{auditResult.lcp.value}ms</p>
              <p className="text-xs text-gray-400 mt-1">
                Rating: {auditResult.lcp.rating}
              </p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Accessibility size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Accessibility</span>
              </div>
              <p className={`text-xl font-bold ${getScoreColor(auditResult.accessibility.score)}`}>
                {auditResult.accessibility.score}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {auditResult.accessibility.violations.length} violations
              </p>
            </div>
            <div className="p-3 bg-gray-808/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-green-400" />
                <span className="text-sm text-gray-300">SEO</span>
              </div>
              <p className={`text-xl font-bold ${getScoreColor(auditResult.seo.score)}`}>
                {auditResult.seo.score}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {auditResult.seo.metaTags.title.exists ? 'Title ✓' : 'No title'}
              </p>
            </div>
          </div>
          <div className="p-4 bg-gray-808/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Image size={16} className="text-purple-400" />
                WebP Conversion
              </h4>
              <button
                onClick={handleWebPConversion}
                className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Convert to WebP
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-400">Images Found</p>
                <p className="text-lg font-bold text-white">{auditResult.webpConversion.total}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Potential Savings</p>
                <p className="text-lg font-bold text-green-400">{auditResult.webpConversion.savings}</p>
              </div>
            </div>
            {webpPreview && (
              <div>
                <p className="text-xs text-gray-400 mb-1">WebP Preview (first 500 chars)</p>
                <pre className="w-full h-24 bg-gray-800 border border-gray-700 rounded p-2 text-gray-300 text-xs font-mono overflow-auto">
                  {webpPreview.substring(0, 500)}...
                </pre>
              </div>
            )}
          </div>
          {auditResult.recommendations.length > 0 && (
            <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-200 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {auditResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-yellow-300 flex items-start gap-1">
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {auditResult.accessibility.violations.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <h4 className="text-sm font-medium text-red-200 mb-2">Accessibility Violations</h4>
              <div className="space-y-2 max-h-48 overflow-auto">
                {auditResult.accessibility.violations.map((v, idx) => (
                  <div key={idx} className="p-2 bg-red-900/30 rounded text-xs">
                    <p className="text-red-300 font-medium">{v.id}</p>
                    <p className="text-gray-400">{v.description}</p>
                    <p className="text-gray-500">Impact: {v.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
