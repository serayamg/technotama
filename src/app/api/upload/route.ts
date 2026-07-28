import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    // 2. Parse request payload
    const { image, serviceId } = await request.json();
    if (!image || !serviceId) {
      return NextResponse.json(
        { error: 'Missing required parameters: image or serviceId.' },
        { status: 400 }
      );
    }

    // 3. Decode base64 image data
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image format.' },
        { status: 400 }
      );
    }

    const imageType = matches[1]; // e.g. 'image/png' or 'image/jpeg'
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 4. Determine file extension
    let extension = 'png';
    if (imageType === 'image/jpeg' || imageType === 'image/jpg') {
      extension = 'jpg';
    } else if (imageType === 'image/webp') {
      extension = 'webp';
    }

    // 5. Generate a unique, cache-proof filename
    const filename = `uploaded_${serviceId}_${Date.now()}.${extension}`;
    const publicDir = path.join(process.cwd(), 'public/illustrations');
    const filePath = path.join(publicDir, filename);

    // Ensure directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/illustrations/${filename}`;

    console.log(`[AUDIT LOG] Image uploaded successfully for service ${serviceId}: ${imageUrl}`);

    return NextResponse.json(
      { success: true, imageUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to process image upload:', err);
    return NextResponse.json(
      { error: 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
