import esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const isWatch = process.argv.includes('--watch');
const isDev = process.argv.includes('--dev') || isWatch;

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Ensure icons directory exists in dist
if (!existsSync('dist/icons')) {
  mkdirSync('dist/icons', { recursive: true });
}

// Copy static files
function copyFiles() {
  try {
    // Copy manifest
    copyFileSync('manifest.json', 'dist/manifest.json');
    console.log('✓ Copied manifest.json');

    // Copy CSS
    copyFileSync('src/content/styles.css', 'dist/content.css');
    console.log('✓ Copied content.css');

    // Copy icons (if they exist)
    const iconSizes = [16, 48, 128];
    iconSizes.forEach(size => {
      const iconPath = `public/icons/icon${size}.png`;
      if (existsSync(iconPath)) {
        copyFileSync(iconPath, `dist/icons/icon${size}.png`);
        console.log(`✓ Copied icon${size}.png`);
      }
    });
  } catch (error) {
    console.error('Error copying files:', error.message);
  }
}

// Build configuration
const buildOptions = {
  entryPoints: ['src/content/index.ts'],
  bundle: true,
  outfile: 'dist/content.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  sourcemap: isDev ? 'inline' : false,
  minify: !isDev,
  logLevel: 'info',
};

async function build() {
  try {
    console.log('🔨 Building extension...\n');
    
    // Copy static files first
    copyFiles();
    console.log('');

    if (isWatch) {
      // Watch mode
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 Watching for changes...\n');
      console.log('Press Ctrl+C to stop\n');
    } else {
      // Single build
      await esbuild.build(buildOptions);
      console.log('\n✅ Build complete!\n');
      console.log('📦 Output files:');
      console.log('   - dist/content.js');
      console.log('   - dist/content.css');
      console.log('   - dist/manifest.json\n');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();