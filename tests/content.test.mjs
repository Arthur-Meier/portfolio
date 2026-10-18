import assert from 'node:assert/strict';
import test from 'node:test';
import {siteContent} from '../src/content.mjs';

test('contentHasEquivalentLocales: changing language preserves every project, skill and contact', () => {
  assert.deepEqual(Object.keys(siteContent.pt.ui).sort(), Object.keys(siteContent.en.ui).sort());
  assert.deepEqual(siteContent.pt.projects.map(p => [p.id, p.category]), siteContent.en.projects.map(p => [p.id, p.category]));
  assert.deepEqual(siteContent.pt.skills.map(s => s.id), siteContent.en.skills.map(s => s.id));
  assert.deepEqual(siteContent.pt.contacts, siteContent.en.contacts);
  assert.equal(siteContent.pt.profile.title, 'Software Engineer | Full Stack');
  assert.equal(siteContent.en.profile.title, 'Software Engineer | Full Stack');
});
