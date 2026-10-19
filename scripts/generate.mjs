import {mkdir, rm, cp, copyFile, writeFile, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {siteContent} from '../src/content.mjs';
import {renderPage} from '../src/template.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const originIndex = process.argv.indexOf('--origin');
const originValue = originIndex >= 0 ? process.argv[originIndex + 1] : process.env.SITE_ORIGIN;
if (!originValue) throw new Error('Provide --origin with the website origin.');
const url = new URL(originValue);
if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid Site origin.');
const baseIndex = process.argv.indexOf('--base-path');
const basePath = (baseIndex >= 0 ? process.argv[baseIndex + 1] ?? '' : '').replace(/\/$/, '');
if (basePath && (!/^\/[A-Za-z0-9._~/-]+$/.test(basePath) || basePath.includes('//') || basePath.split('/').some(part => part === '.' || part === '..'))) throw new Error('Invalid --base-path.');
const publicRoot = new URL(basePath + '/', url.origin).href;
const output = path.join(root, 'dist');
await rm(output, {recursive: true, force: true});
await mkdir(path.join(output, 'en'), {recursive: true});
await cp(path.join(root, 'src/assets'), path.join(output, 'assets'), {recursive: true});
await copyFile(path.join(root, 'src/styles.css'), path.join(output, 'assets/styles.css'));
for (const file of ['state.mjs', 'interactions.mjs']) {
  const source = path.join(root, 'src', file);
  try { await access(source); } catch { continue; }
  await copyFile(source, path.join(output, 'assets', file));
}
for (const locale of ['pt', 'en']) {
  await writeFile(path.join(output, locale === 'en' ? 'en/index.html' : 'index.html'), renderPage({locale, content: siteContent[locale], origin: url.origin, basePath}));
}
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${publicRoot}sitemap.xml\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${publicRoot}</loc></url><url><loc>${publicRoot}en/</loc></url></urlset>`);
console.log('Generated Portuguese and English pages with local assets.');
