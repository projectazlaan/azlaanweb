import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path where the design data will be stored
const dataFilePath = path.join(process.cwd(), 'studio-data.json');

// GET: Load existing design
export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ html: '', css: '' });
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // If error occurs, return empty data
    return NextResponse.json({ html: '', css: '' });
  }
}

// POST: Save the design sent from the editor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
