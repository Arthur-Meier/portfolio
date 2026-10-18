import assert from 'node:assert/strict';
import test from 'node:test';
import {resolveTheme, readPreference, writePreference} from '../src/state.mjs';

test('autoThemeFollowsSystem: a system appearance change updates the effective theme', () => {
  assert.equal(resolveTheme('auto', true), 'dark');
  assert.equal(resolveTheme('auto', false), 'light');
});
test('manualThemeOverridesSystem: a manual choice survives opposite system appearance', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
});
test('blockedStorageReturnsFallback: privacy settings do not prevent initial rendering', () => {
  const storage = {getItem() {throw new Error('blocked');}};
  assert.equal(readPreference(storage, 'arthur-portfolio-theme', 'auto'), 'auto');
  assert.equal(readPreference(undefined, 'arthur-portfolio-theme', 'auto'), 'auto');
});
test('blockedStorageDoesNotThrowOnWrite: visitor can change theme even without persistence', () => {
  const storage = {setItem() {throw new Error('blocked');}};
  assert.doesNotThrow(() => writePreference(storage, 'arthur-portfolio-theme', 'dark'));
});
test('malformedThemePreferenceFallsBack: stale local data never becomes a theme name', () => {
  const storage = {getItem() {return 'undefined';}};
  assert.equal(readPreference(storage, 'arthur-portfolio-theme', 'auto'), 'auto');
});
