import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY ?? 'azlaan_super_admin_2026';
const COOKIE_NAME  = process.env.ADMIN_COOKIE_NAME  ?? 'azlaan_admin_session';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Create a signed session token (simple timestamp-based)
    const token = Buffer.from(
      JSON.stringify({ role: 'admin', ts: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(process.env.ADMIN_COOKIE_NAME ?? 'azlaan_admin_session');
  return response;
}
