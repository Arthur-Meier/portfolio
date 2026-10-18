import assert from 'node:assert/strict';
import test from 'node:test';
import {siteContent} from '../src/content.mjs';
import {renderPage} from '../src/template.mjs';

for (const [locale, language] of [['pt', 'pt-BR'], ['en', 'en']]) {
  test(`${locale}PageWorksStandalone: direct route has localized metadata and root-relative assets`, () => {
    const html = renderPage({locale, content: siteContent[locale], origin: 'https://portfolio.example'});
    assert.match(html, new RegExp(`<html[^>]*lang="${language}"`));
    assert.match(html, /href="\/en\//);
    assert.match(html, /href="\//);
    assert.match(html, /src="\/assets\//);
    assert.ok(html.includes(locale === 'en' ? 'Download résumé' : 'Baixar currículo'));
    assert.match(html, /https:\/\/portfolio\.example\/assets\/arthur\.webp/);
  });

  test(`${locale}PageRetainsContentWithoutJavaScript: projects, skills and contacts are server-rendered`, () => {
    const content = siteContent[locale];
    const html = renderPage({locale, content, origin: 'https://portfolio.example'});
    for (const project of content.projects) {
      assert.ok(html.includes(project.title), project.id);
      assert.ok(html.includes(project.summary), project.id);
    }
    for (const skill of content.skills) assert.ok(html.includes(`data-skill-panel data-skill-id="${skill.id}"`));
    assert.ok(html.includes(content.profile.name));
    assert.match(html, /mailto:arthurcmeier@outlook\.com/);
    const expectedFile = locale === 'en' ? 'resume-arthur-meier-en.pdf' : 'curriculo-arthur-meier-pt.pdf';
    assert.ok(html.includes(`href="/assets/${expectedFile}"`));
  });

  test(`${locale}ResumeDownloads: both download locations use the page language`, () => {
    const html = renderPage({locale, content: siteContent[locale], origin: 'https://portfolio.example'});
    const expectedFile = locale === 'en' ? 'resume-arthur-meier-en.pdf' : 'curriculo-arthur-meier-pt.pdf';
    const expectedName = locale === 'en' ? 'Arthur-Meier-Resume.pdf' : 'Arthur-Meier-Curriculo.pdf';
    const downloads = [...html.matchAll(/<a\b(?=[^>]*\bdownload=)[^>]*>/g)].map(match => match[0]);
    assert.equal(downloads.length, 2, 'experience and contact each provide a résumé download');
    for (const link of downloads) {
      assert.ok(link.includes(`href="/assets/${expectedFile}"`));
      assert.ok(link.includes(`download="${expectedName}"`));
    }
    assert.ok(!html.includes('Résumé in Portuguese'));
    assert.ok(!html.includes('Currículo em português'));
  });
}

test('renderPage escapes text and attributes rather than treating content as markup', () => {
  const content = structuredClone(siteContent.en);
  content.profile.name = '<script>alert("x")</script>';
  const html = renderPage({locale: 'en', content, origin: 'https://portfolio.example'});
  assert.ok(html.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>alert("x")</script>'));
});
