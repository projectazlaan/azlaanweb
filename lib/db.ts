import fs from 'fs'
import path from 'path'

const projectRoot = process.cwd()
const dataDir = path.join(projectRoot, 'data')
const jsonPath = path.join(dataDir, 'azlaan.json')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

interface DataStore {
  products: any[]
  testimonials: any[]
  orders: any[]
  customers: any[]
  activity_log: any[]
  settings: any
  hero: any
  admin_users: any[]
}

interface Statement {
  run(...args: any[]): Statement
  get(...args: any[]): any
  all(...args: any[]): any[]
  execute(): Statement
}

interface DbMock {
  prepare(sql: string): Statement
  pragma(...args: any[]): void
  exec(sql: string): DbMock
}

function loadData(): DataStore {
  if (!fs.existsSync(jsonPath)) {
    return { products: [], testimonials: [], orders: [], customers: [], activity_log: [], settings: null, hero: null, admin_users: [] }
  }
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  } catch {
    return { products: [], testimonials: [], orders: [], customers: [], activity_log: [], settings: null, hero: null, admin_users: [] }
  }
}

function saveData(data: DataStore) {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
}

// Mock SQLite interface
export function getDb(): DbMock {
  const data = loadData()

  return {
    prepare(sql: string): Statement {
      const lowerSql = sql.toLowerCase().trim()

      return {
        run(...args: any[]): Statement {
          if (lowerSql.startsWith('insert')) {
            // Simplified insert logic
          } else if (lowerSql.startsWith('update')) {
            saveData(data)
          }
          return this
        },
        get(...args: any[]): any {
          if (lowerSql.includes('settings')) return data.settings || {}
          if (lowerSql.includes('hero')) return data.hero || {}
          if (lowerSql.includes('products')) {
            const id = args[0]
            return data.products.find((p: any) => p.id === id) || null
          }
          return null
        },
        all(...args: any[]): any[] {
          if (lowerSql.includes('products')) return data.products || []
          if (lowerSql.includes('testimonials')) return data.testimonials || []
          if (lowerSql.includes('orders')) return data.orders || []
          if (lowerSql.includes('customers')) return data.customers || []
          if (lowerSql.includes('activity_log')) return data.activity_log || []
          if (lowerSql.includes('settings')) return data.settings ? [data.settings] : []
          if (lowerSql.includes('hero')) return data.hero ? [data.hero] : []
          if (lowerSql.includes('admin_users')) return data.admin_users || []
          return []
        },
        execute(): Statement { return this }
      }
    },
    pragma() {},
    exec(sql: string): DbMock {
      // Handle CREATE TABLE
      return this
    }
  }
}

export function closeDb() {}
