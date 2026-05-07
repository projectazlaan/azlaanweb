export interface CollectionField {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'url' | 'richtext'
  required: boolean
  defaultValue?: unknown
}

export interface Collection {
  id: string
  name: string
  slug: string
  fields: CollectionField[]
  items: Record<string, unknown>[]
  createdAt: Date
  updatedAt: Date
}

const collections: Collection[] = []

export function createCollection(name: string, fields: CollectionField[]): Collection {
  const collection: Collection = {
    id: crypto.randomUUID(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    fields,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  collections.push(collection)
  return collection
}

export function getCollections(): Collection[] {
  return [...collections]
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug)
}

export function addCollectionItem(collectionSlug: string, item: Record<string, unknown>): Record<string, unknown> | undefined {
  const collection = collections.find(c => c.slug === collectionSlug)
  if (!collection) return undefined
  
  const newItem = { id: crypto.randomUUID(), ...item }
  collection.items.push(newItem)
  collection.updatedAt = new Date()
  return newItem
}

export function getCollectionItems(collectionSlug: string): Record<string, unknown>[] {
  const collection = collections.find(c => c.slug === collectionSlug)
  return collection?.items || []
}

