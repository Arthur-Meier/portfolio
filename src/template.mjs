const escape = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
const tags = values => `<ul class="tags">${values.map(value => `<li>${escape(value)}</li>`).join('')}</ul>`;
const external = (url, label, className = '') => `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const sectionHeader = (eyebrow, title, subtitle = '') => `<div class="section-heading"><p class="eyebrow">${escape(eyebrow)}</p><h2>${escape(title)}</h2>${subtitle ? `<p class="section-description">${escape(subtitle)}</p>` : ''}</div>`;
const caseDisclosure = (item, ui, showTags = false) => `<details class="case-details"><summary>${escape(ui.caseDetails)} <span aria-hidden="true">+</span></summary>${item.availability && item.allocation ? `<div class="case-processes"><div><h4>${escape(ui.caseAvailability)}</h4><p>${escape(item.availability)}</p></div><div><h4>${escape(ui.caseAllocation)}</h4><p>${escape(item.allocation)}</p></div></div>` : ''}<div class="case-details-grid"><div><h4>${escape(ui.caseProblem)}</h4><p>${escape(item.problem)}</p></div><div><h4>${escape(ui.caseContribution)}</h4><p>${escape(item.contribution)}</p></div><div><h4>${escape(ui.caseOutcome)}</h4><p>${escape(item.outcome)}</p></div></div>${showTags ? tags(item.tags) : ''}</details>`;

export function renderPage({locale, content, origin}) {
  const {ui, profile, contacts, resume, cases, projects, skills, experience, education, approach} = content;
  const language = locale === 'en' ? 'en' : 'pt-BR';
  const path = locale === 'en' ? '/en/' : '/';
  const alternatePath = locale === 'en' ? '/' : '/en/';
  const primaryCase = cases[0];
  const absolute = pathname => new URL(pathname, origin).href;
  const nav = `<a href="#projects">${escape(ui.navProjects)}</a><a href="#skills">${escape(ui.navSkills)}</a><a href="#experience">${escape(ui.navExperience)}</a><a href="#contact">${escape(ui.navContact)}</a>`;
  const person = JSON.stringify({'@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.title, url: absolute(path), image: absolute('/assets/arthur.webp'), sameAs: [contacts.github, contacts.linkedin]}).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escape(profile.name)} | ${escape(profile.title)}</title>
  <meta name="description" content="${escape(profile.metaDescription)}">
  <link rel="canonical" href="${escape(absolute(path))}">
  <link rel="alternate" hreflang="pt-BR" href="${escape(absolute('/'))}">
  <link rel="alternate" hreflang="en" href="${escape(absolute('/en/'))}">
  <link rel="alternate" hreflang="x-default" href="${escape(absolute('/'))}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escape(profile.name)} | ${escape(profile.title)}">
  <meta property="og:description" content="${escape(profile.metaDescription)}">
  <meta property="og:url" content="${escape(absolute(path))}">
  <meta property="og:image" content="${escape(absolute('/assets/arthur.webp'))}">
  <meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'pt_BR'}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="module" src="/assets/interactions.mjs"></script>
  <script type="application/ld+json">${person}</script>
</head>
<body>
  <a class="skip-link" href="#main-content">${escape(ui.skip)}</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="wordmark" href="${path}" aria-label="${escape(profile.name)}"><span class="monogram" aria-hidden="true">am<span>.</span></span><span class="wordmark-name">Arthur Meier<span>Software Engineer</span></span></a>
      <nav id="site-nav" class="site-nav" data-site-nav aria-label="${escape(ui.menu)}">${nav}</nav>
      <div class="header-controls">
        <label class="theme-control" data-js-only hidden><span class="sr-only">${escape(ui.theme)}</span><select data-theme-select aria-label="${escape(ui.theme)}"><option value="auto">${escape(ui.themeAuto)}</option><option value="light">${escape(ui.themeLight)}</option><option value="dark">${escape(ui.themeDark)}</option></select></label>
        <a class="language-link" data-language-link href="${alternatePath}" lang="${locale === 'en' ? 'pt-BR' : 'en'}" hreflang="${locale === 'en' ? 'pt-BR' : 'en'}" aria-label="${escape(ui.languageAlt)}">${locale === 'en' ? 'PT' : 'EN'}<span aria-hidden="true"> ↗</span></a>
        <button class="menu-toggle" type="button" data-menu-toggle data-open-label="${escape(ui.menu)}" data-close-label="${escape(ui.closeMenu)}" aria-controls="site-nav" aria-expanded="false" hidden>${escape(ui.menu)}</button>
      </div>
    </div>
  </header>
  <main id="main-content">
    <section id="home" class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${escape(ui.heroEyebrow)}</p>
        <h1 id="hero-title">${escape(profile.name)}<span class="name-dot" aria-hidden="true">.</span></h1>
        <p class="role">${escape(profile.title)}</p>
        <h2 class="hero-headline">${escape(profile.headline)}</h2>
        <p class="hero-intro">${escape(profile.intro)}</p>
        <div class="hero-actions"><a class="button button-primary" href="#case-study">${escape(ui.heroProjects)} <span aria-hidden="true">↘</span></a><a class="text-link" href="#contact">${escape(ui.heroContact)} <span aria-hidden="true">↗</span></a></div>
        <p class="hero-availability">${escape(ui.availability)}</p>
      </div>
      <figure class="portrait-block"><div class="portrait-frame"><img src="/assets/arthur.webp" width="1197" height="1600" alt="${escape(ui.portraitAlt)}" fetchpriority="high"><span class="portrait-index" aria-hidden="true">AM / BR</span></div><figcaption><span>${escape(ui.location)}</span><span>${escape(ui.since)}</span></figcaption></figure>
    </section>
    <div class="container">
      <aside class="engineering-strip" aria-label="${escape(ui.profileNote)}"><div><span class="eyebrow">${escape(ui.profileLabel)}</span><p>${escape(ui.profileNote)}</p></div><dl><div><dt>${escape(ui.codeBackend)}</dt><dd>Java <span>/</span> Spring Boot</dd></div><div><dt>${escape(ui.codeFrontend)}</dt><dd>Vue <span>/</span> React <span>/</span> TypeScript</dd></div><div><dt>${escape(ui.codeApproach)}</dt><dd><code>${locale === 'en' ? 'understand → build → evolve' : 'entender → construir → evoluir'}</code></dd></div></dl></aside>
    </div>
    <section id="case-study" class="section container">
      ${sectionHeader(ui.caseEyebrow, ui.caseHeading, ui.caseSubtitle)}
      <article class="featured-case">
        <div class="case-intro"><p class="eyebrow">${escape(ui.caseCompany)}</p><h3>${escape(primaryCase.title)}</h3><p>${escape(primaryCase.summary)}</p>${tags(primaryCase.tags)}</div>
        <div class="allocation-visual" aria-label="${escape(primaryCase.stageLabel)}"><span class="allocation-label">${escape(primaryCase.stageLabel)}</span><div class="allocation-stages">${primaryCase.stages.map((stage, index) => `<div><span class="stage-number" aria-hidden="true">0${index + 1}</span><span>${escape(stage)}</span></div>`).join('')}</div><div class="allocation-baseline"><span></span><code>${locale === 'en' ? 'availability → selection → order allocation' : 'disponibilidade → seleção → alocação no pedido'}</code></div></div>
        ${caseDisclosure(primaryCase, ui)}
      </article>
      <div class="secondary-cases">${cases.slice(1).map(item => `<article><p class="eyebrow">${escape(item.company)}</p><h3>${escape(item.title)}</h3><p>${escape(item.summary)}</p>${caseDisclosure(item, ui, true)}</article>`).join('')}</div>
    </section>
    <section id="projects" class="section section-surface">
      <div class="container">
        ${sectionHeader(ui.projectsEyebrow, ui.projectsHeading, ui.projectsSubtitle)}
        <div class="project-toolbar"><div class="project-filters" role="group" aria-label="${escape(ui.filterLabel)}" data-js-only hidden>${[['all', ui.filterAll], ['systems', ui.filterSystems], ['mobile', ui.filterMobile], ['games', ui.filterGames]].map(([value, label]) => `<button type="button" data-project-filter="${value}" aria-pressed="${value === 'all'}">${escape(label)}</button>`).join('')}</div><p class="project-count" data-project-count data-singular="${escape(ui.projectCountOne)}" data-plural="${escape(ui.projectCountMany)}" aria-live="polite">${projects.length} ${escape(ui.projectCountMany)}</p></div>
        <div class="project-grid">${projects.map((project, index) => `<article class="project-card" data-project-card data-category="${project.category}"><div class="project-card-top"><span class="project-category">${escape({systems: ui.filterSystems, mobile: ui.filterMobile, games: ui.filterGames}[project.category])}</span><span class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></div><h3>${escape(project.title)}</h3><p class="project-summary">${escape(project.summary)}</p><span class="project-status">${escape(project.status)}</span>${tags(project.tags)}<details class="project-details"><summary>${escape(ui.projectDetails)} <span aria-hidden="true">+</span></summary><p>${escape(project.details)}</p></details><div class="project-links">${project.links.map(item => external(item.url, item.label)).join('')}</div></article>`).join('')}</div>
      </div>
    </section>
    <section id="skills" class="section container">
      ${sectionHeader(ui.skillsEyebrow, ui.skillsHeading, ui.skillsSubtitle)}
      <div class="skills-layout"><div class="skill-buttons" role="group" aria-label="${escape(ui.skillsLabel)}" data-js-only hidden>${skills.map((skill, index) => `<button type="button" data-skill-button data-skill-id="${skill.id}" aria-controls="skill-${skill.id}" aria-pressed="${index === 0}"><span>${escape(skill.title)}</span><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="skill-panels" aria-live="polite">${skills.map(skill => `<article id="skill-${skill.id}" class="skill-panel" data-skill-panel data-skill-id="${skill.id}"><p class="eyebrow">${escape(skill.context)}</p><h3>${escape(skill.title)}</h3><p>${escape(skill.description)}</p>${tags(skill.tags)}<p class="skill-evidence">${escape(skill.evidence)}</p></article>`).join('')}</div></div>
    </section>
    <section id="experience" class="section section-surface">
      <div class="container experience-layout"><div class="experience-aside">${sectionHeader(ui.experienceEyebrow, ui.experienceHeading, ui.experienceSubtitle)}<a class="text-link resume-inline" href="${escape(resume.href)}" download="${escape(resume.filename)}">${escape(ui.resumeLabel)} <span aria-hidden="true">↓</span></a><span class="resume-note">${escape(ui.resumeNote)}</span></div><div class="timeline" aria-label="${escape(ui.professionalLabel)}">${experience.map(job => `<article class="timeline-item"><p class="job-period">${escape(job.period)}</p><h3>${escape(job.company)}</h3><p class="job-role">${escape(job.role)}</p><p>${escape(job.description)}</p><ul class="job-highlights">${job.highlights.map(item => `<li>${escape(item)}</li>`).join('')}</ul>${tags(job.tags)}</article>`).join('')}<p class="previous-experience">${escape(content.previousExperience)}</p></div><div class="education"><h3>${escape(ui.educationHeading)}</h3>${education.map(item => `<article><h4>${escape(item.title)}</h4><p>${escape(item.institution)}</p><span>${escape(item.period)}</span></article>`).join('')}</div></div>
    </section>
    <section id="approach" class="section container approach-section">
      ${sectionHeader(ui.approachEyebrow, ui.approachHeading)}
      <p class="approach-intro">${escape(profile.summary)}</p><div class="approach-grid">${approach.map((item, index) => `<article><span class="approach-index" aria-hidden="true">0${index + 1}</span><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></article>`).join('')}</div>
    </section>
    <section id="contact" class="contact-section">
      <div class="container contact-layout"><div><p class="eyebrow">${escape(ui.contactEyebrow)}</p><h2>${escape(ui.contactHeading)}</h2><p class="contact-description">${escape(ui.contactText)}</p><div class="contact-actions"><a class="button button-primary" href="mailto:${escape(contacts.email)}">${escape(ui.emailLabel)} <span aria-hidden="true">↗</span></a>${external(contacts.whatsapp, ui.whatsappLabel, 'button button-outline')}</div></div><div class="contact-direct"><a href="mailto:${escape(contacts.email)}">${escape(contacts.email)}</a><div>${external(contacts.linkedin, 'LinkedIn')}${external(contacts.github, 'GitHub')}</div><a class="resume-download" href="${escape(resume.href)}" download="${escape(resume.filename)}">${escape(ui.resumeLabel)} <span aria-hidden="true">↓</span></a><span class="resume-note">${escape(ui.resumeNote)}</span></div></div>
    </section>
  </main>
  <footer class="site-footer container"><div><a class="footer-name" href="#home">Arthur Meier<span aria-hidden="true">.</span></a><p>${escape(ui.footerNote)}</p></div><a class="back-top" href="#home">${escape(ui.backTop)} <span aria-hidden="true">↑</span></a></footer>
</body>
</html>`;
}
