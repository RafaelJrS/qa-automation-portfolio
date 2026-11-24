/**
 * Rafael Mello — QA Automation & SDET Portfolio
 * 1. Slide-Deck Pagination Router (#topo, #experiencia, #projetos, #como-testo, #contato)
 *    with Hash Routing, Mouse Wheel Page-Flip at scroll boundaries, and Keyboard Navigation
 * 2. Interactive Playwright Terminal (rafael_mello.spec.ts)
 * 3. WAI-ARIA Method Tabs (#como-testo)
 * 4. Dedicated QA Dashboard (dashboard.html) SVG Line & Bar Charts + Time Window Slider
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. THEME TOGGLE (DARK / LIGHT)
     -------------------------------------------------------------------------- */
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const THEME_STORAGE_KEY = 'rafael_qa_theme';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  }

  (function initTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        htmlEl.setAttribute('data-theme', saved);
      }
    } catch (_) {}
  })();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE MENU & AVATAR FALLBACK
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const profileAvatar = document.getElementById('profileAvatar');
  const avatarWrapper = document.getElementById('avatarWrapper');
  if (profileAvatar && avatarWrapper) {
    profileAvatar.addEventListener('error', function () {
      avatarWrapper.classList.add('has-fallback');
    });
    if (profileAvatar.complete && profileAvatar.naturalWidth === 0) {
      avatarWrapper.classList.add('has-fallback');
    }
  }

  /* --------------------------------------------------------------------------
     3. PAGINATED SLIDE DECK ROUTER (index.html)
     -------------------------------------------------------------------------- */
  const SLIDE_ORDER = ['topo', 'experiencia', 'projetos', 'como-testo', 'contato'];
  const slides = Array.prototype.slice.call(document.querySelectorAll('.page-slide'));

  if (slides.length > 0) {
    let currentSlideId = 'topo';
    let wheelCooldown = false;

    function normalizeSlideHash(hashStr) {
      const raw = (hashStr || '').replace(/^#/, '').trim();
      if (raw === 'como-eu-testo') return 'como-testo';
      if (SLIDE_ORDER.indexOf(raw) !== -1) return raw;
      return 'topo';
    }

    function showSlide(slideId, updateHistory) {
      const targetId = SLIDE_ORDER.indexOf(slideId) !== -1 ? slideId : 'topo';
      currentSlideId = targetId;

      slides.forEach(function (sec) {
        const isMatch = sec.id === targetId;
        sec.classList.toggle('is-active', isMatch);
      });

      // Highlight active navigation link
      document.querySelectorAll('[data-slide-link]').forEach(function (link) {
        if (link.classList.contains('nav-link') || link.classList.contains('btn-nav-contact')) {
          link.classList.toggle('is-active', link.getAttribute('data-slide-link') === targetId);
        }
      });

      if (navLinks) {
        navLinks.classList.remove('is-open');
      }

      if (updateHistory) {
        if (history.pushState) {
          history.pushState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Intercept clicks on any [data-slide-link]
    document.querySelectorAll('[data-slide-link]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        const target = el.getAttribute('data-slide-link');
        if (target && SLIDE_ORDER.indexOf(target) !== -1) {
          e.preventDefault();
          showSlide(target, true);
        }
      });
    });

    // Listen to browser Back/Forward hash changes
    window.addEventListener('hashchange', function () {
      const target = normalizeSlideHash(window.location.hash);
      showSlide(target, false);
    });

    // Mouse Wheel Pagination between slides when at top/bottom boundary
    window.addEventListener(
      'wheel',
      function (e) {
        if (wheelCooldown) return;
        if (Math.abs(e.deltaY) < 42) return;

        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
        const atTop = window.scrollY <= 6;
        const currentIndex = SLIDE_ORDER.indexOf(currentSlideId);

        if (e.deltaY > 0 && atBottom && currentIndex < SLIDE_ORDER.length - 1) {
          wheelCooldown = true;
          showSlide(SLIDE_ORDER[currentIndex + 1], true);
          setTimeout(function () {
            wheelCooldown = false;
          }, 720);
        } else if (e.deltaY < 0 && atTop && currentIndex > 0) {
          wheelCooldown = true;
          showSlide(SLIDE_ORDER[currentIndex - 1], true);
          setTimeout(function () {
            wheelCooldown = false;
          }, 720);
        }
      },
      { passive: true }
    );

    // Keyboard PageDown / PageUp support
    window.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const currentIndex = SLIDE_ORDER.indexOf(currentSlideId);

      if (e.key === 'PageDown' && currentIndex < SLIDE_ORDER.length - 1) {
        e.preventDefault();
        showSlide(SLIDE_ORDER[currentIndex + 1], true);
      } else if (e.key === 'PageUp' && currentIndex > 0) {
        e.preventDefault();
        showSlide(SLIDE_ORDER[currentIndex - 1], true);
      }
    });

    // Initial slide activation from URL hash
    const initialSlide = normalizeSlideHash(window.location.hash);
    showSlide(initialSlide, Boolean(window.location.hash));
  }

  /* --------------------------------------------------------------------------
     4. INTERACTIVE PLAYWRIGHT TERMINAL (rafael_mello.spec.ts)
     -------------------------------------------------------------------------- */
  const PLAYWRIGHT_TESTS = [
    {
      desc: 'automatiza fluxos Web E2E com Playwright, Cypress e Robot Framework',
      time: '0.24s',
      delay: 190
    },
    {
      desc: 'valida APIs REST e contratos com Postman, Insomnia e automação',
      time: '0.18s',
      delay: 160
    },
    {
      desc: 'protege jornadas críticas em finanças, e-commerce e Salesforce',
      time: '0.31s',
      delay: 210
    },
    {
      desc: 'executa suítes em pipelines CI/CD e AWS Device Farm',
      time: '0.27s',
      delay: 190
    },
    {
      desc: 'aplica padrões ISTQB CTFL v4.0 e cultura Shift-Left',
      time: '0.14s',
      delay: 150
    },
    {
      desc: 'potencializa cenários e revisa automação com Engenharia de IA',
      time: '0.11s',
      ai: true,
      delay: 140
    }
  ];

  const runTestsBtn = document.getElementById('runTestsBtn');
  const terminalTestList = document.getElementById('terminalTestList');
  const terminalFooter = document.getElementById('terminalFooter');
  const termDotsProgress = document.getElementById('termDotsProgress');
  const termProgressFill = document.getElementById('termProgressFill');
  let isRunning = false;

  function runTerminalSuite() {
    if (isRunning || !terminalTestList || !terminalFooter) return;
    isRunning = true;

    if (runTestsBtn) {
      runTestsBtn.disabled = true;
      runTestsBtn.classList.add('is-running');
    }

    terminalTestList.innerHTML = '';
    if (termDotsProgress) termDotsProgress.textContent = '';
    if (termProgressFill) termProgressFill.style.width = '0%';
    terminalFooter.style.opacity = '0.35';

    let elapsed = 100;

    PLAYWRIGHT_TESTS.forEach(function (t, idx) {
      const li = document.createElement('li');
      li.className = 'term-item';
      li.innerHTML =
        '<span class="term-pass">✓</span>' +
        '<span class="term-text">' + t.desc + '</span>' +
        '<span class="term-ms">' + t.time + '</span>' +
        (t.ai ? '<span class="term-ai-badge">IA</span>' : '');
      terminalTestList.appendChild(li);

      elapsed += t.delay;
      setTimeout(function () {
        li.classList.add('is-visible');
        if (termDotsProgress) {
          termDotsProgress.textContent = Array(idx + 2).join('. ').trim();
        }
        if (termProgressFill) {
          termProgressFill.style.width = Math.round(((idx + 1) / PLAYWRIGHT_TESTS.length) * 100) + '%';
        }
      }, elapsed);
    });

    setTimeout(function () {
      terminalFooter.style.opacity = '1';
      isRunning = false;
      if (runTestsBtn) {
        runTestsBtn.disabled = false;
        runTestsBtn.classList.remove('is-running');
      }
    }, elapsed + 160);
  }

  if (runTestsBtn) {
    runTestsBtn.addEventListener('click', runTerminalSuite);
  }

  /* --------------------------------------------------------------------------
     5. ACCESSIBLE TABS (#como-testo)
     -------------------------------------------------------------------------- */
  const tabBtns = Array.prototype.slice.call(
    document.querySelectorAll('.method-tabs-grid [role="tab"]')
  );
  const tabPanels = Array.prototype.slice.call(
    document.querySelectorAll('#como-testo [role="tabpanel"]')
  );

  function activateMethodTab(targetBtn, focusIt) {
    tabBtns.forEach(function (btn) {
      const active = btn === targetBtn;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });

    tabPanels.forEach(function (panel) {
      const match = panel.id === targetBtn.getAttribute('aria-controls');
      panel.classList.toggle('is-active', match);
      if (match) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    if (focusIt) targetBtn.focus();
  }

  tabBtns.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      activateMethodTab(btn, false);
    });

    btn.addEventListener('keydown', function (e) {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabBtns.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabBtns.length) % tabBtns.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabBtns.length - 1;
      if (next !== null) {
        e.preventDefault();
        activateMethodTab(tabBtns[next], true);
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. DEDICATED DASHBOARD PAGE (dashboard.html)
     -------------------------------------------------------------------------- */
  const FALLBACK_DATA = {
    updatedAt: '24 de novembro de 2026',
    summary: {
      experienceYears: '+5 anos',
      repositoriesCount: 8,
      starredRepositories: 3,
      automatedScenarios: 86,
      totalCommits: 248
    },
    timelineQuarters: [
      { quarter: '2021 T1', scenarios: 6, commits: 12 },
      { quarter: '2021 T3', scenarios: 14, commits: 18 },
      { quarter: '2022 T1', scenarios: 22, commits: 21 },
      { quarter: '2022 T3', scenarios: 28, commits: 16 },
      { quarter: '2023 T1', scenarios: 35, commits: 24 },
      { quarter: '2023 T3', scenarios: 42, commits: 19 },
      { quarter: '2024 T1', scenarios: 50, commits: 28 },
      { quarter: '2024 T3', scenarios: 58, commits: 22 },
      { quarter: '2025 T1', scenarios: 66, commits: 26 },
      { quarter: '2025 T3', scenarios: 74, commits: 31 },
      { quarter: '2026 T1', scenarios: 80, commits: 15 },
      { quarter: '2026 T4', scenarios: 86, commits: 16 }
    ],
    languages: [
      { name: 'Python (Robot Framework / AI / Data)', percentage: 34, color: '#10b981' },
      { name: 'TypeScript / JavaScript (Playwright / Cypress)', percentage: 30, color: '#38bdf8' },
      { name: 'Java (ServeRest / Selenium / Appium)', percentage: 24, color: '#f59e0b' },
      { name: 'SQL & Gherkin / BDD', percentage: 12, color: '#a855f7' }
    ],
    coverageByLayer: [
      { layer: 'Automação Web E2E', tools: 'Playwright, Robot Framework, Cypress, Selenium', score: 95, scenarios: 42 },
      { layer: 'Testes de API REST & Contratos', tools: 'ServeRest-java, Postman, Insomnia, RestAssured', score: 90, scenarios: 24 },
      { layer: 'Mobile & Cloud Device Farm', tools: 'Appium, AWS Device Farm', score: 82, scenarios: 10 },
      { layer: 'Performance, Stress & CI/CD', tools: 'JMeter, GitHub Actions, GitLab CI, Docker', score: 86, scenarios: 10 }
    ],
    repositories: [
      { name: 'ServeRest-java', starred: true, language: 'Java', layer: 'API REST & E2E', scenarios: 18, url: 'https://github.com/RafaelJrS/ServeRest-java' },
      { name: 'Play-swaglabs', starred: true, language: 'TypeScript', layer: 'Web E2E (Playwright)', scenarios: 16, url: 'https://github.com/RafaelJrS/Play-swaglabs' },
      { name: 'swaglabs_robotframework', starred: true, language: 'Robot Framework / Python', layer: 'Web E2E (Keyword-Driven)', scenarios: 15, url: 'https://github.com/RafaelJrS/swaglabs_robotframework' },
      { name: 'AmazonTesteRobot', starred: false, language: 'Robot Framework', layer: 'E-commerce E2E', scenarios: 12, url: 'https://github.com/RafaelJrS/AmazonTesteRobot' },
      { name: 'SeuBarrigaSeleniumWebDriver', starred: false, language: 'Java', layer: 'Financeiro Web E2E', scenarios: 11, url: 'https://github.com/RafaelJrS/SeuBarrigaSeleniumWebDriver' },
      { name: 'webdriver-java', starred: false, language: 'Java', layer: 'Web E2E (Selenium)', scenarios: 8, url: 'https://github.com/RafaelJrS/webdriver-java' },
      { name: 'Projeto_IAGoogleAlura', starred: false, language: 'Python', layer: 'AI-Driven QA / GenAI', scenarios: 6, url: 'https://github.com/RafaelJrS/Projeto_IAGoogleAlura' }
    ]
  };

  const lineChartContainer = document.getElementById('lineChartContainer');
  const barChartContainer = document.getElementById('barChartContainer');
  const quarterRangeSlider = document.getElementById('quarterRangeSlider');

  function renderSvgCharts(quartersSlice) {
    if (!lineChartContainer || !barChartContainer || !quartersSlice.length) return;

    const w = 460;
    const h = 210;
    const padL = 34;
    const padR = 16;
    const padT = 16;
    const padB = 28;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // 1. Line Chart: Scenarios
    const maxScenarios = 100;
    const points = quartersSlice.map(function (q, i) {
      const x =
        padL +
        (quartersSlice.length === 1 ? plotW / 2 : (i / (quartersSlice.length - 1)) * plotW);
      const y = padT + plotH - (q.scenarios / maxScenarios) * plotH;
      return { x: x, y: y, q: q };
    });

    const polylinePoints = points
      .map(function (p) {
        return p.x.toFixed(1) + ',' + p.y.toFixed(1);
      })
      .join(' ');

    const areaPoints =
      points[0].x.toFixed(1) +
      ',' +
      (padT + plotH) +
      ' ' +
      polylinePoints +
      ' ' +
      points[points.length - 1].x.toFixed(1) +
      ',' +
      (padT + plotH);

    let gridLines = '';
    [0, 25, 50, 75, 100].forEach(function (val) {
      const gy = padT + plotH - (val / maxScenarios) * plotH;
      gridLines +=
        '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="rgba(148,163,184,0.12)" stroke-width="1"/>' +
        '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + val + '</text>';
    });

    let circlesHtml = '';
    points.forEach(function (p) {
      circlesHtml +=
        '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4" fill="#0f151e" stroke="#7dd3fc" stroke-width="2">' +
        '<title>' + p.q.quarter + ': ' + p.q.scenarios + ' cenários</title>' +
        '</circle>';
    });

    lineChartContainer.innerHTML =
      '<svg viewBox="0 0 ' + w + ' ' + h + '">' +
      gridLines +
      '<polygon points="' + areaPoints + '" fill="rgba(125,211,252,0.10)"/>' +
      '<polyline fill="none" stroke="#7dd3fc" stroke-width="2.2" points="' + polylinePoints + '"/>' +
      circlesHtml +
      '<text x="' + padL + '" y="' + (h - 6) + '" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + quartersSlice[0].quarter + '</text>' +
      '<text x="' + (w - padR) + '" y="' + (h - 6) + '" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + quartersSlice[quartersSlice.length - 1].quarter + '</text>' +
      '</svg>';

    // 2. Bar Chart: Commits
    const maxCommits = 40;
    let barGrid = '';
    [0, 10, 20, 30, 40].forEach(function (val) {
      const gy = padT + plotH - (val / maxCommits) * plotH;
      barGrid +=
        '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="rgba(148,163,184,0.12)" stroke-width="1"/>' +
        '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + val + '</text>';
    });

    const stepW = plotW / quartersSlice.length;
    const barW = Math.min(20, stepW * 0.58);
    let barsHtml = '';

    quartersSlice.forEach(function (q, i) {
      const bh = (q.commits / maxCommits) * plotH;
      const bx = padL + i * stepW + (stepW - barW) / 2;
      const by = padT + plotH - bh;
      barsHtml +=
        '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="#86efac" opacity="0.85">' +
        '<title>' + q.quarter + ': ' + q.commits + ' commits</title>' +
        '</rect>';
    });

    barChartContainer.innerHTML =
      '<svg viewBox="0 0 ' + w + ' ' + h + '">' +
      barGrid +
      barsHtml +
      '<text x="' + padL + '" y="' + (h - 6) + '" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + quartersSlice[0].quarter + '</text>' +
      '<text x="' + (w - padR) + '" y="' + (h - 6) + '" text-anchor="end" fill="#64748b" font-size="10" font-family="JetBrains Mono">' + quartersSlice[quartersSlice.length - 1].quarter + '</text>' +
      '</svg>';
  }

  function initDashboardPage(data) {
    if (!lineChartContainer) return;

    const allQuarters = data.timelineQuarters || FALLBACK_DATA.timelineQuarters;
    const kpiScenarios = document.getElementById('kpiScenarios');
    const kpiScenariosDelta = document.getElementById('kpiScenariosDelta');
    const kpiCommits = document.getElementById('kpiCommits');
    const kpiWindowRange = document.getElementById('kpiWindowRange');
    const sliderStatusText = document.getElementById('sliderStatusText');

    function updateTimeWindow(count) {
      const slice = allQuarters.slice(allQuarters.length - count);
      const lastScenarios = slice[slice.length - 1].scenarios;
      const firstScenarios = slice[0].scenarios;
      const deltaScenarios =
        count === allQuarters.length ? lastScenarios : lastScenarios - firstScenarios;
      const sumCommits = slice.reduce(function (acc, item) {
        return acc + item.commits;
      }, 0);

      if (kpiScenarios) kpiScenarios.textContent = String(lastScenarios);
      if (kpiScenariosDelta) kpiScenariosDelta.textContent = '+' + deltaScenarios + ' no período';
      if (kpiCommits) kpiCommits.textContent = String(sumCommits);
      if (kpiWindowRange) {
        kpiWindowRange.textContent = slice[0].quarter + ' a ' + slice[slice.length - 1].quarter;
      }
      if (sliderStatusText) {
        sliderStatusText.textContent =
          count === allQuarters.length
            ? 'todo o histórico (' + count + ' marcos trimestrais)'
            : 'últimos ' + count + ' marcos trimestrais';
      }

      renderSvgCharts(slice);
    }

    if (quarterRangeSlider) {
      quarterRangeSlider.max = String(allQuarters.length);
      quarterRangeSlider.value = String(allQuarters.length);
      quarterRangeSlider.addEventListener('input', function () {
        updateTimeWindow(Number(quarterRangeSlider.value));
      });
    }

    updateTimeWindow(allQuarters.length);

    // Languages
    const dashLangBar = document.getElementById('dashLangBar');
    const dashLangLegend = document.getElementById('dashLangLegend');
    if (dashLangBar && dashLangLegend && Array.isArray(data.languages)) {
      dashLangBar.innerHTML = '';
      dashLangLegend.innerHTML = '';
      data.languages.forEach(function (lang) {
        const seg = document.createElement('div');
        seg.className = 'lang-segment';
        seg.style.width = lang.percentage + '%';
        seg.style.backgroundColor = lang.color;
        dashLangBar.appendChild(seg);

        const li = document.createElement('li');
        li.className = 'lang-legend-item';
        li.innerHTML =
          '<div class="lang-legend-left">' +
          '<span class="lang-color-swatch" style="background-color:' + lang.color + '"></span>' +
          '<span>' + lang.name + '</span>' +
          '</div>' +
          '<span class="lang-percent">' + lang.percentage + '%</span>';
        dashLangLegend.appendChild(li);
      });
    }

    // Layers
    const dashLayerBars = document.getElementById('dashLayerBars');
    if (dashLayerBars && Array.isArray(data.coverageByLayer)) {
      dashLayerBars.innerHTML = '';
      data.coverageByLayer.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'layer-item';
        div.innerHTML =
          '<div class="layer-top">' +
          '<div><span class="layer-name">' + item.layer + '</span> <span class="layer-tools">· ' + item.tools + '</span></div>' +
          '<span class="layer-score">' + item.scenarios + ' cenários (' + item.score + '%)</span>' +
          '</div>' +
          '<div class="layer-track"><div class="layer-fill" style="width:' + item.score + '%"></div></div>';
        dashLayerBars.appendChild(div);
      });
    }

    // Repositories Table
    const dashReposTableBody = document.getElementById('dashReposTableBody');
    if (dashReposTableBody && Array.isArray(data.repositories)) {
      dashReposTableBody.innerHTML = '';
      data.repositories.forEach(function (repo) {
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td><a href="' + repo.url + '" target="_blank" rel="noopener noreferrer" class="tag-code">' + repo.name + ' ↗</a></td>' +
          '<td>' + repo.language + '</td>' +
          '<td>' + repo.layer + '</td>' +
          '<td><strong>' + repo.scenarios + '</strong></td>' +
          '<td>' + (repo.starred ? '<span class="status-pill pill-warn">★ Starred</span>' : '<span class="status-pill pill-info">Público</span>') + '</td>';
        dashReposTableBody.appendChild(tr);
      });
    }
  }

  if (lineChartContainer) {
    fetch('data/metrics.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) {
        initDashboardPage(json);
      })
      .catch(function () {
        initDashboardPage(FALLBACK_DATA);
      });
  }
})();
