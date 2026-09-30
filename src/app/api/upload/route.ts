import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/adminAuth';

// Allowed image MIME types and extensions
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES_PER_REQUEST = 10;

export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized: Admin access required for file upload' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    let files = formData.getAll('files') as File[];

    // Also accept single 'file' field
    if (files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) files = [singleFile];
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES_PER_REQUEST} files allowed per upload.` },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (typeof file === 'string' || !file.name) continue;

      // ── File size validation ────────────────────────────────────
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the 10 MB size limit.` },
          { status: 400 }
        );
      }

      // ── MIME type validation ────────────────────────────────────
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { success: false, error: `File type "${file.type}" is not allowed. Only images are accepted.` },
          { status: 400 }
        );
      }

      // ── Extension validation (double-check) ────────────────────
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `File extension "${ext}" is not allowed.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ── Magic bytes check for JPEG/PNG/WebP ────────────────────
      // Verify first bytes match expected image signature
      const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
      const isWebP = buffer.slice(8, 12).toString('ascii') === 'WEBP';
      const isGif = buffer.slice(0, 6).toString('ascii') === 'GIF87a' || buffer.slice(0, 6).toString('ascii') === 'GIF89a';

      if (['.jpg', '.jpeg'].includes(ext) && !isJpeg) {
        return NextResponse.json({ success: false, error: 'Invalid JPEG file.' }, { status: 400 });
      }
      if (ext === '.png' && !isPng) {
        return NextResponse.json({ success: false, error: 'Invalid PNG file.' }, { status: 400 });
      }
      if (ext === '.webp' && !isWebP) {
        return NextResponse.json({ success: false, error: 'Invalid WebP file.' }, { status: 400 });
      }
      if (ext === '.gif' && !isGif) {
        return NextResponse.json({ success: false, error: 'Invalid GIF file.' }, { status: 400 });
      }

      // ── Safe filename ───────────────────────────────────────────
      const cleanName = path.basename(file.name).replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid files were uploaded.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
