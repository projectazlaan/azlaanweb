import { nanoid } from 'nanoid'

export type VersionStatus = 'draft' | 'staging' | 'production'

export interface Version {
  id: string
  pageId: string
  versionNumber: number
  status: VersionStatus
  content: any
  snapshot: string
  createdAt: string
  createdBy: string
  note?: string
  changes?: string[]
}

export interface SyncResult {
  success: boolean
  message: string
  syncedVersion?: Version
  conflicts?: string[]
}

export interface VersionDiff {
  added: string[]
  removed: string[]
  modified: string[]
}

const STORAGE_KEY = 'page_versions'
const DRAFT_KEY = 'page_draft'
const PRODUCTION_KEY = 'page_production'

function getStorageKey(pageId: string): string {
  return `${STORAGE_KEY}_${pageId}`
}

export function getVersions(pageId: string): Version[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(getStorageKey(pageId))
  return stored ? JSON.parse(stored) : []
}

export function saveVersion(version: Version): void {
  if (typeof window === 'undefined') return
  const versions = getVersions(version.pageId)
  versions.push(version)
  localStorage.setItem(getStorageKey(version.pageId), JSON.stringify(versions))
}

export function createVersion(
  pageId: string,
  content: any,
  status: VersionStatus,
  createdBy = 'admin',
  note?: string
): Version {
  const versions = getVersions(pageId)
  const versionNumber = versions.length > 0 
    ? Math.max(...versions.map(v => v.versionNumber)) + 1 
    : 1
  
  const version: Version = {
    id: nanoid(),
    pageId,
    versionNumber,
    status,
    content,
    snapshot: JSON.stringify(content),
    createdAt: new Date().toISOString(),
    createdBy,
    note,
    changes: []
  }
  
  saveVersion(version)
  return version
}

export function getDraft(pageId: string): Version | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(`${DRAFT_KEY}_${pageId}`)
  return stored ? JSON.parse(stored) : null
}

export function saveDraft(pageId: string, content: any): Version {
  const draft = createVersion(pageId, content, 'draft')
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${DRAFT_KEY}_${pageId}`, JSON.stringify(draft))
  }
  return draft
}

export function publishToProduction(pageId: string, content: any, note?: string): Version {
  const version = createVersion(pageId, content, 'production', 'admin', note)
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${PRODUCTION_KEY}_${pageId}`, JSON.stringify(version))
  }
  return version
}

export function getProductionVersion(pageId: string): Version | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(`${PRODUCTION_KEY}_${pageId}`)
  return stored ? JSON.parse(stored) : null
}

export function syncDraftToProduction(pageId: string): SyncResult {
  const draft = getDraft(pageId)
  if (!draft) {
    return { success: false, message: 'No draft found to sync' }
  }
  
  const production = getProductionVersion(pageId)
  const conflicts: string[] = []
  
  if (production) {
    const diff = compareVersions(draft, production)
    if (diff.modified.length > 0) {
      conflicts.push(...diff.modified)
    }
  }
  
  const newVersion = publishToProduction(pageId, draft.content, `Synced from draft v${draft.versionNumber}`)
  
  return {
    success: true,
    message: `Successfully synced draft to production as v${newVersion.versionNumber}`,
    syncedVersion: newVersion,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  }
}

export function compareVersions(v1: Version, v2: Version): VersionDiff {
  const snap1 = JSON.parse(v1.snapshot)
  const snap2 = JSON.parse(v2.snapshot)
  
  const diff: VersionDiff = {
    added: [],
    removed: [],
    modified: []
  }
  
  const keys1 = Object.keys(snap1)
  const keys2 = Object.keys(snap2)
  
  keys1.forEach(key => {
    if (!keys2.includes(key)) {
      diff.removed.push(key)
    } else if (JSON.stringify(snap1[key]) !== JSON.stringify(snap2[key])) {
      diff.modified.push(key)
    }
  })
  
  keys2.forEach(key => {
    if (!keys1.includes(key)) {
      diff.added.push(key)
    }
  })
  
  return diff
}

export function rollbackToVersion(pageId: string, versionId: string): Version | null {
  const versions = getVersions(pageId)
  const targetVersion = versions.find(v => v.id === versionId)
  
  if (!targetVersion) return null
  
  const rolledBack = createVersion(
    pageId,
    targetVersion.content,
    'production',
    'admin',
    `Rollback to v${targetVersion.versionNumber}`
  )
  
  return rolledBack
}

export function deleteVersion(pageId: string, versionId: string): boolean {
  if (typeof window === 'undefined') return false
  const versions = getVersions(pageId)
  const filtered = versions.filter(v => v.id !== versionId)
  
  if (filtered.length === versions.length) return false
  
  localStorage.setItem(getStorageKey(pageId), JSON.stringify(filtered))
  return true
}

export function clearDrafts(pageId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${DRAFT_KEY}_${pageId}`)
}

export function getVersionHistory(pageId: string): Version[] {
  return getVersions(pageId).sort((a, b) => b.versionNumber - a.versionNumber)
}

export function exportVersionData(pageId: string): string {
  const versions = getVersions(pageId)
  const draft = getDraft(pageId)
  const production = getProductionVersion(pageId)
  
  return JSON.stringify({
    pageId,
    versions,
    draft,
    production,
    exportedAt: new Date().toISOString()
  }, null, 2)
}

export function importVersionData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    if (typeof window === 'undefined') return false
    
    if (data.versions) {
      localStorage.setItem(getStorageKey(data.pageId), JSON.stringify(data.versions))
    }
    if (data.draft) {
      localStorage.setItem(`${DRAFT_KEY}_${data.pageId}`, JSON.stringify(data.draft))
    }
    if (data.production) {
      localStorage.setItem(`${PRODUCTION_KEY}_${data.pageId}`, JSON.stringify(data.production))
    }
    
    return true
  } catch {
    return false
  }
}
