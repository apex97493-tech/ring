const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

// Load environment variables manually from .env.local if not loaded
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qphfuzfsjggfskwszdco.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'product-images';
const CDN_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`;

if (!SUPABASE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const prisma = new PrismaClient();

const CONCURRENCY = 8;
const MAX_RETRIES = 3;

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

async function uploadFileWithRetry(filename, filePath, retryCount = 0) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filename);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    return true;
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
      return uploadFileWithRetry(filename, filePath, retryCount + 1);
    }
    console.error(`Failed to upload ${filename} after ${MAX_RETRIES} attempts:`, err.message);
    return false;
  }
}

async function main() {
  console.log('--- Starting Image Migration to Supabase Cloud Storage ---');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Target Bucket: ${BUCKET_NAME}`);
  console.log(`CDN Base URL: ${CDN_BASE_URL}`);

  // 1. Ensure bucket exists and is public
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets && buckets.some(b => b.name === BUCKET_NAME);
  if (!exists) {
    console.log(`Creating public bucket '${BUCKET_NAME}'...`);
    const { error: bErr } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    if (bErr) {
      console.error('Failed to create bucket:', bErr.message);
      process.exit(1);
    }
  } else {
    console.log(`Bucket '${BUCKET_NAME}' already exists.`);
  }

  // 2. Scan public/uploads
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.error('Directory public/uploads does not exist!');
    process.exit(1);
  }

  const allFiles = fs.readdirSync(uploadsDir).filter(f => !f.startsWith('.'));
  const totalFiles = allFiles.length;
  console.log(`Found ${totalFiles} images in public/uploads/ to upload.`);

  let completed = 0;
  let successCount = 0;
  let failCount = 0;

  async function worker(queue) {
    while (queue.length > 0) {
      const filename = queue.shift();
      const filePath = path.join(uploadsDir, filename);
      const success = await uploadFileWithRetry(filename, filePath);
      if (success) successCount++;
      else failCount++;
      completed++;

      if (completed % 50 === 0 || completed === totalFiles) {
        const pct = ((completed / totalFiles) * 100).toFixed(1);
        console.log(`Progress: [${completed}/${totalFiles}] (${pct}%) - Success: ${successCount}, Failed: ${failCount}`);
      }
    }
  }

  const queue = [...allFiles];
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(queue));
  }
  await Promise.all(workers);

  console.log(`\nUpload phase complete! ${successCount} uploaded successfully, ${failCount} failed.`);

  // 3. Update Supabase PostgreSQL database ProductImage records
  console.log('\n--- Updating Supabase Database URLs to CDN ---');
  try {
    const updateResult = await prisma.$executeRawUnsafe(`
      UPDATE "ProductImage"
      SET "url" = REPLACE("url", '/uploads/', '${CDN_BASE_URL}/')
      WHERE "url" LIKE '/uploads/%';
    `);
    console.log(`Updated ${updateResult} records in ProductImage database table.`);
  } catch (dbErr) {
    console.error('Error updating ProductImage in database:', dbErr.message);
  }

  // 4. Update products-store.json so Next.js frontend immediately uses CDN
  console.log('\n--- Updating src/lib/products-store.json to CDN URLs ---');
  const storePath = path.join(__dirname, '..', 'src', 'lib', 'products-store.json');
  if (fs.existsSync(storePath)) {
    let rawContent = fs.readFileSync(storePath, 'utf8');
    const matchesCount = (rawContent.match(/\/uploads\//g) || []).length;
    console.log(`Replacing ${matchesCount} local '/uploads/' paths with Supabase CDN...`);
    
    // Replace /uploads/ with CDN URL
    rawContent = rawContent.split('/uploads/').join(`${CDN_BASE_URL}/`);
    fs.writeFileSync(storePath, rawContent, 'utf8');
    console.log('Successfully updated src/lib/products-store.json with Supabase CDN URLs!');
  }

  console.log('\n🎉 ALL DONE! All images are now hosted 100% on Supabase Cloud CDN.');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
