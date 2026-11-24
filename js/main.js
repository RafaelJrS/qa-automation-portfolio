/**
 * Rafael Mello — QA Automation & SDET Portfolio
 * Vanilla JS:
 * 1. Theme toggle (Dark / Light mode with localStorage persistence)
 * 2. Mobile responsive menu
 * 3. Profile photo fallback handler (RM initials if image fails)
 * 4. Interactive Playwright Terminal simulator (rafael_mello.spec.ts)
 * 5. Accessible WAI-ARIA Tabs ("Como eu testo") with keyboard navigation
 * 6. Metrics Dashboard loader (fetches data/metrics.json with embedded fallback)
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
    } catch (_) {
      // Ignore storage restrictions
    }
  }

  (function initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (_) {
      savedTheme = null;
    }
    if (savedTheme === 'light' || savedTheme === 'dark') {
      htmlEl.setAttribute('data-theme', savedTheme);
    }
  })();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE MENU & ACTIVE NAV LINK
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. PROFILE AVATAR FALLBACK (INITIALS "RM")
     -------------------------------------------------------------------------- */
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarWrapper = document.getElementById('avatarWrapper');

  function activateAvatarFallback() {
    if (avatarWrapper) {
      avatarWrapper.classList.add('has-fallback');
    }
  }

  if (profileAvatar) {
    profileAvatar.addEventListener('error', activateAvatarFallback);
    if (profileAvatar.complete && profileAvatar.naturalWidth === 0) {
      activateAvatarFallback();
    }
  }

  /* --------------------------------------------------------------------------
     4. INTERACTIVE PLAYWRIGHT TERMINAL (rafael_mello.spec.ts)
     -------------------------------------------------------------------------- */
  const PLAYWRIGHT_TESTS = [
    {
      desc: 'automatiza fluxos Web E2E com Playwright, Cypress e Robot Framework',
      time: '0.24s',
      delayMs: 240
    },
    {
      desc: 'valida APIs REST e contratos com Postman, Insomnia e automação',
      time: '0.18s',
      delayMs: 180
    },
    {
      desc: 'protege jornadas críticas em finanças, e-commerce e Salesforce',
      time: '0.31s',
      delayMs: 310
    },
    {
      desc: 'executa suítes em pipelines CI/CD e AWS Device Farm',
      time: '0.27s',
      delayMs: 270
    },
    {
      desc: 'aplica padrões ISTQB CTFL v4.0 e cultura Shift-Left',
      time: '0.14s',
      delayMs: 140
    },
    {
      desc: 'potencializa cenários e revisa automação com Engenharia de IA',
      time: '0.11s',
      delayMs: 110
    }
  ];

  const runTestsBtn = document.getElementById('runTestsBtn');
  const terminalTestList = document.getElementById('terminalTestList');
  const terminalFooter = document.getElementById('terminalFooter');
  let isTerminalRunning = false;

  function renderTestLine(item) {
    const li = document.createElement('li');
    li.className = 'test-line';

    const check = document.createElement('span');
    check.className = 'test-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';

    const desc = document.createElement('span');
    desc.className = 'test-desc';
    desc.textContent = item.desc;

    const time = document.createElement('span');
    time.className = 'test-time';
    time.textContent = '(' + item.time + ')';

    li.appendChild(check);
    li.appendChild(desc);
    li.appendChild(time);
    return li;
  }

  function runPlaywrightSimulation() {
    if (isTerminalRunning || !terminalTestList || !terminalFooter) {
      return;
    }

    isTerminalRunning = true;
    if (runTestsBtn) {
      runTestsBtn.disabled = true;
      runTestsBtn.classList.add('is-running');
    }

    terminalTestList.innerHTML = '';
    terminalFooter.style.opacity = '0.25';
    terminalFooter.innerHTML = '<span>Running suite rafael_mello.spec.ts...</span>';

    let cumulativeDelay = 120;

    PLAYWRIGHT_TESTS.forEach(function (testItem) {
      const lineEl = renderTestLine(testItem);
      terminalTestList.appendChild(lineEl);

      cumulativeDelay += testItem.delayMs;
      setTimeout(function () {
        lineEl.classList.add('is-visible');
      }, cumulativeDelay);
    });

    setTimeout(function () {
      terminalFooter.style.opacity = '1';
      terminalFooter.innerHTML =
        '<span class="terminal-summary-pass">6 passed</span>, ' +
        '<span class="terminal-summary-fail">0 failed</span>' +
        '<span class="terminal-sep">·</span>' +
        '<span class="terminal-duration">Finished in 1.25s</span>';

      isTerminalRunning = false;
      if (runTestsBtn) {
        runTestsBtn.disabled = false;
        runTestsBtn.classList.remove('is-running');
      }
    }, cumulativeDelay + 180);
  }

  if (runTestsBtn) {
    runTestsBtn.addEventListener('click', runPlaywrightSimulation);
  }

  // Trigger initial terminal animation on load if reduced-motion is not enabled
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    setTimeout(runPlaywrightSimulation, 350);
  }

  /* --------------------------------------------------------------------------
     5. ACCESSIBLE TABS ("COMO EU TESTO") WITH KEYBOARD NAVIGATION
     -------------------------------------------------------------------------- */
  const tabButtons = Array.prototype.slice.call(
    document.querySelectorAll('.tabs-nav [role="tab"]')
  );
  const tabPanels = Array.prototype.slice.call(
    document.querySelectorAll('.tabs-component [role="tabpanel"]')
  );

  function activateTab(targetTab, shouldFocus) {
    tabButtons.forEach(function (btn) {
      const isSelected = btn === targetTab;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
      btn.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    tabPanels.forEach(function (panel) {
      const isControlled = panel.id === targetTab.getAttribute('aria-controls');
      panel.classList.toggle('is-active', isControlled);
      if (isControlled) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    if (shouldFocus) {
      targetTab.focus();
    }
  }

  tabButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      activateTab(btn, false);
    });

    btn.addEventListener('keydown', function (event) {
      let nextIndex = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % tabButtons.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabButtons.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tabButtons[nextIndex], true);
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. METRICS / MINI DASHBOARD (data/metrics.json)
     -------------------------------------------------------------------------- */
  const FALLBACK_METRICS = {
    updatedAt: 'Novembro 2026',
    summary: {
      experienceYears: '+5 anos',
      repositoriesCount: 6,
      certification: 'CTFL v4.0 (ISTQB)',
      postGrad: 'Pós em Eng. de IA (06/2026)',
      automationPassRate: '99.4%',
      avgPipelineTime: '4m 12s'
    },
    languages: [
      { name: 'Python (Robot / AI / Data)', percentage: 34, color: '#10b981' },
      { name: 'TypeScript / JavaScript (Playwright)', percentage: 30, color: '#38bdf8' },
      { name: 'Java (ServeRest / Selenium)', percentage: 24, color: '#f59e0b' },
      { name: 'SQL & Gherkin / BDD', percentage: 12, color: '#a855f7' }
    ],
    coverageByLayer: [
      {
        layer: 'Automação Web E2E',
        tools: 'Playwright, Robot Framework, Cypress, Selenium',
        score: 95,
        badge: 'Core Stack'
      },
      {
        layer: 'Testes de API REST & Contratos',
        tools: 'Postman, Insomnia, Requests, RestAssured',
        score: 90,
        badge: 'Shift-Left'
      },
      {
        layer: 'Mobile & Cloud Testing',
        tools: 'Appium, AWS Device Farm',
        score: 80,
        badge: 'Cross-Device'
      },
      {
        layer: 'Performance, Stress & CI/CD',
        tools: 'JMeter, GitHub Actions, GitLab CI, Docker',
        score: 85,
        badge: 'DevOps / SRE'
      },
      {
        layer: 'AI-Driven QA & Engenharia de Prompts',
        tools: 'Agentes de QA, Geração de Cenários, Code Review IA',
        score: 88,
        badge: 'Inovação'
      }
    ],
    qualityIndicators: [
      {
        label: 'Redução de Bugs Críticos em Produção',
        value: '-68%',
        context: 'Com Shift-Left Testing, revisão de requisitos BDD e regressão contínua em CI/CD'
      },
      {
        label: 'Cobertura de Jornadas Críticas (Regressivo)',
        value: '85%+',
        context: 'Fluxos financeiros, checkout e-commerce e integrações CRM Salesforce'
      },
      {
        label: 'Ganho de Produtividade em Design de Testes',
        value: '2.4x',
        context: 'Combinando modelagem ISTQB CTFL v4.0 com Engenharia de IA e revisão humana'
      }
    ]
  };

  function renderMetricsDashboard(data) {
    const langStackedBar = document.getElementById('langStackedBar');
    const langLegendList = document.getElementById('langLegendList');
    const layerBarsList = document.getElementById('layerBarsList');
    const metricsKpiGrid = document.getElementById('metricsKpiGrid');

    // Render KPIs if provided
    if (metricsKpiGrid && Array.isArray(data.qualityIndicators)) {
      metricsKpiGrid.innerHTML = '';
      data.qualityIndicators.forEach(function (kpi) {
        const card = document.createElement('article');
        card.className = 'kpi-card';
        card.innerHTML =
          '<span class="kpi-value">' + kpi.value + '</span>' +
          '<h3 class="kpi-label">' + kpi.label + '</h3>' +
          '<p class="kpi-context">' + kpi.context + '</p>';
        metricsKpiGrid.appendChild(card);
      });
    }

    // Render Language Distribution Stacked Bar & Legend
    if (langStackedBar && langLegendList && Array.isArray(data.languages)) {
      langStackedBar.innerHTML = '';
      langLegendList.innerHTML = '';

      data.languages.forEach(function (lang) {
        const seg = document.createElement('div');
        seg.className = 'lang-segment';
        seg.style.width = lang.percentage + '%';
        seg.style.backgroundColor = lang.color;
        seg.title = lang.name + ': ' + lang.percentage + '%';
        langStackedBar.appendChild(seg);

        const li = document.createElement('li');
        li.className = 'lang-legend-item';
        li.innerHTML =
          '<div class="lang-legend-left">' +
          '<span class="lang-color-swatch" style="background-color:' + lang.color + '"></span>' +
          '<span>' + lang.name + '</span>' +
          '</div>' +
          '<span class="lang-percent">' + lang.percentage + '%</span>';
        langLegendList.appendChild(li);
      });
    }

    // Render Coverage by Layer Bars
    if (layerBarsList && Array.isArray(data.coverageByLayer)) {
      layerBarsList.innerHTML = '';

      data.coverageByLayer.forEach(function (item) {
        const wrapper = document.createElement('div');
        wrapper.className = 'layer-item';
        wrapper.innerHTML =
          '<div class="layer-top">' +
          '<div>' +
          '<span class="layer-name">' + item.layer + '</span> ' +
          '<span class="layer-tools">· ' + item.tools + '</span>' +
          '</div>' +
          '<span class="layer-score">' + item.score + '%</span>' +
          '</div>' +
          '<div class="layer-track" role="progressbar" aria-valuenow="' + item.score + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + item.layer + '">' +
          '<div class="layer-fill" style="width:' + item.score + '%"></div>' +
          '</div>';
        layerBarsList.appendChild(wrapper);
      });
    }
  }

  function loadMetricsData() {
    fetch('data/metrics.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (jsonData) {
        renderMetricsDashboard(jsonData);
      })
      .catch(function () {
        // Fallback when opened via file:// protocol or offline
        renderMetricsDashboard(FALLBACK_METRICS);
      });
  }

  loadMetricsData();
})();
