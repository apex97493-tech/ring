import { NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { createClient } from '@supabase/supabase-js';

// Allowed image MIME types and extensions
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB per file
const MAX_FILES_PER_REQUEST = 12;

function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qphfuzfsjggfskwszdco.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables.');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

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

    const uploadedUrls: string[] = [];
    const supabase = getSupabaseClient();

    for (const file of files) {
      if (typeof file === 'string' || !file.name) continue;

      // ── File size validation ────────────────────────────────────
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the 15 MB size limit.` },
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

      // ── Extension validation ────────────────────────────────────
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

      // ── Safe clean unique filename ─────────────────────────────
      const cleanName = path.basename(file.name).replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;

      // ── Direct Cloud Upload to Supabase Storage Bucket ────────
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadErr) {
        console.error('[Supabase Storage Upload Error]:', uploadErr);
        return NextResponse.json(
          { success: false, error: `Supabase Storage upload failed: ${uploadErr.message}` },
          { status: 502 }
        );
      }

      const { data: pubData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uniqueName);

      if (!pubData?.publicUrl) {
        return NextResponse.json(
          { success: false, error: 'Could not generate public URL for uploaded photo.' },
          { status: 500 }
        );
      }

      console.log(`[Supabase Storage ✓]: Uploaded ${uniqueName} -> ${pubData.publicUrl}`);
      uploadedUrls.push(pubData.publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid files were uploaded.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
      storage: 'supabase-cloud',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
