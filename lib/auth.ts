import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'data');
const jsonPath = path.join(dataDir, 'azlaan.json');

const JWT_SECRET = process.env.JWT_SECRET || 'azlaan-secret-key-2024';

interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

function loadData() {
  if (!fs.existsSync(jsonPath)) {
    return { products: [], testimonials: [], orders: [], customers: [], settings: null, hero: null, admin_users: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch {
    return { products: [], testimonials: [], orders: [], customers: [], settings: null, hero: null, admin_users: [] };
  }
}

function saveData(data: any) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
}

export function initializeDefaultAdmin() {
  const data = loadData();
  const adminExists = data.admin_users.some((u: AdminUser) => u.username === 'admin');
  
  if (!adminExists) {
    data.admin_users.push({
      id: 'admin-1',
      username: 'admin',
      passwordHash: 'admin123',
      createdAt: new Date().toISOString(),
    });
    saveData(data);
  }
}

export function getAdminByUsername(username: string) {
  const data = loadData();
  return data.admin_users.find((u: AdminUser) => u.username === username) || null;
}

export function verifyPassword(plainPassword: string, storedPasswordHash: string) {
  return plainPassword === storedPasswordHash;
}

export function generateToken(payload: { userId: string; username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string; role?: string };
  } catch {
    return null;
  }
}
