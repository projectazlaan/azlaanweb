import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(_: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: 'admin_token',
    value: '',
    expires: new Date(0),
    path: '/',
  })
  return response
}
