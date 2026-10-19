import assert from 'node:assert/strict';
import test from 'node:test';
import {cp, mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {siteContent} from '../src/content.mjs';
import {renderPage} from '../src/template.mjs';

for (const locale of ['pt', 'en']) {
  test(`${locale}: project-path deployment keeps assets, language links and downloads inside the site`, () => {
    const html = renderPage({locale, content: siteContent[locale], origin: 'https://arthur-meier.github.io', basePath: '/portfolio/'});
    const route = locale === 'en' ? '/portfolio/en/' : '/portfolio/';
    assert.ok(html.includes(`rel="canonical" href="https://arthur-meier.github.io${route}"`));
    assert.ok(html.includes('href="/portfolio/en/"'));
    assert.ok(html.includes('href="/portfolio/"'));
    for (const [, reference] of html.matchAll(/(?:href|src)="(\/[^\"]*)"/g)) {
      assert.ok(reference.startsWith('/portfolio/'), reference);
      assert.ok(!reference.includes('/portfolio/portfolio/'), reference);
    }
    assert.ok(html.includes('src="/portfolio/assets/interactions.mjs"'));
    const pdf = locale === 'en' ? 'resume-arthur-meier-en.pdf' : 'curriculo-arthur-meier-pt.pdf';
    assert.ok(html.includes(`href="/portfolio/assets/${pdf}"`));
  });
}

test('build: a project-path artifact has complete pages, assets, sitemap and valid links', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const temporary = await mkdtemp(path.join(tmpdir(), 'portfolio-pages-'));
  try {
    await cp(path.join(root, 'src'), path.join(temporary, 'src'), {recursive: true});
    await cp(path.join(root, 'scripts'), path.join(temporary, 'scripts'), {recursive: true});
    const build = spawnSync(process.execPath, ['scripts/generate.mjs', '--origin', 'https://arthur-meier.github.io', '--base-path', '/portfolio'], {cwd: temporary, encoding: 'utf8'});
    assert.equal(build.status, 0, build.stderr);
    const html = await readFile(path.join(temporary, 'dist/en/index.html'), 'utf8');
    assert.ok(html.includes('src="/portfolio/assets/arthur.webp"'));
    const sitemap = await readFile(path.join(temporary, 'dist/sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes('<loc>https://arthur-meier.github.io/portfolio/</loc>'));
    assert.ok(sitemap.includes('<loc>https://arthur-meier.github.io/portfolio/en/</loc>'));
    const check = spawnSync('python3', ['scripts/check-site.py', 'dist', '--base-path', '/portfolio'], {cwd: temporary, encoding: 'utf8'});
    assert.equal(check.status, 0, check.stderr || check.stdout);
  } finally {
    await rm(temporary, {recursive: true, force: true});
  }
});
