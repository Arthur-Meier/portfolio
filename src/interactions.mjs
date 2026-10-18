import {resolveTheme, readPreference, writePreference} from './state.mjs';

const root = document.documentElement;
const themeSelect = document.querySelector('[data-theme-select]');
let storage;
try { storage = window.localStorage; } catch { /* Privacy settings can block the storage getter itself. */ }
const themeKey = 'arthur-portfolio-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let themePreference = readPreference(storage, themeKey, 'auto');
function applyTheme() {
  root.dataset.theme = resolveTheme(themePreference, systemTheme.matches);
  if (themeSelect) themeSelect.value = themePreference;
}
applyTheme();
themeSelect?.addEventListener('change', () => {
  themePreference = ['auto', 'light', 'dark'].includes(themeSelect.value) ? themeSelect.value : 'auto';
  applyTheme();
  writePreference(storage, themeKey, themePreference);
});
systemTheme.addEventListener('change', () => { if (themePreference === 'auto') applyTheme(); });

const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-site-nav]');
if (menuButton && nav) {
  function setMenu(open, restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel;
    nav.toggleAttribute('data-open', open);
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  menuButton.hidden = false;
}

const filterButtons = [...document.querySelectorAll('[data-project-filter]')];
const projectCards = [...document.querySelectorAll('[data-project-card]')];
const projectCount = document.querySelector('[data-project-count]');
function filterProjects(category) {
  let visible = 0;
  for (const card of projectCards) {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) visible++;
  }
  for (const button of filterButtons) button.setAttribute('aria-pressed', String(button.dataset.projectFilter === category));
  if (projectCount) projectCount.textContent = `${visible} ${visible === 1 ? projectCount.dataset.singular : projectCount.dataset.plural}`;
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.projectFilter)));
filterProjects('all');

const skillButtons = [...document.querySelectorAll('[data-skill-button]')];
const skillPanels = [...document.querySelectorAll('[data-skill-panel]')];
function selectSkill(id) {
  if (!skillPanels.some(panel => panel.dataset.skillId === id)) return;
  skillPanels.forEach(panel => { panel.hidden = panel.dataset.skillId !== id; });
  skillButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.skillId === id)));
}
skillButtons.forEach(button => button.addEventListener('click', () => selectSkill(button.dataset.skillId)));
if (skillButtons.length) selectSkill(skillButtons[0].dataset.skillId);

function preserveSection() {
  let id = '';
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { /* An invalid hash should not affect language navigation. */ }
  const hash = id && document.getElementById(id) ? '#' + encodeURIComponent(id) : '';
  document.querySelectorAll('[data-language-link]').forEach(link => {
    const target = new URL(link.href);
    link.setAttribute('href', target.pathname + hash);
  });
}
preserveSection();
window.addEventListener('hashchange', preserveSection);
document.querySelectorAll('[data-js-only]').forEach(element => { element.hidden = false; });
root.classList.add('enhanced');
