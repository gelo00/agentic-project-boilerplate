import fs from 'node:fs';

const copyIfNotExists = (src, dest) => {
  if (!fs.existsSync(dest) && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Created ${dest} from ${src}`);
  }
};

copyIfNotExists('apps/api/.env.example', 'apps/api/.env');
copyIfNotExists('apps/web/.env.example', 'apps/web/.env.local');
console.log('🎉 Environment files initialized for offline In-Memory development.');