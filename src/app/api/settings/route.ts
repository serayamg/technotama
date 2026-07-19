import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

const getFilePath = () => path.join(process.cwd(), 'src/lib/site-content.json');

export async function GET() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, 'utf8');
    const config = JSON.parse(data);
    return NextResponse.json(config, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to read settings:', err);
    return NextResponse.json(
      { error: 'Failed to read settings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const filePath = getFilePath();
    
    // Simple validation
    if (!body.general || !body.hero || !body.menus || !body.services) {
      return NextResponse.json(
        { error: 'Invalid settings structure.' },
        { status: 400 }
      );
    }

    // Write to file
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
    console.log('[AUDIT LOG] Site settings updated successfully.');

    return NextResponse.json(
      { success: true, message: 'Settings saved successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to update settings:', err);
    return NextResponse.json(
      { error: 'Failed to update settings.' },
      { status: 500 }
    );
  }
}
