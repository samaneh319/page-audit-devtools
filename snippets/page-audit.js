(() => {
  // ─────────────────────────────────────────
  //        🛠️ PAGE AUDIT SNIPPET v2.1
  // ─────────────────────────────────────────

  const report = {

    // ════════════════════════════════════════
    // 🔐 SECURITY
    // ════════════════════════════════════════
    security: {
      unsafeLinks:            document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])').length,
      inlineHandlers:         document.querySelectorAll('[onclick],[onload],[onerror]').length,
      unsafeIframes:          document.querySelectorAll('iframe:not([sandbox])').length,
      httpForms:              document.querySelectorAll('form[action^="http://"]').length,
      httpImages:             [...document.querySelectorAll('img')].filter(i => i.src.startsWith('http://')).length,
      httpScripts:            [...document.querySelectorAll('script[src]')].filter(s => s.src.startsWith('http://')).length,
      inputsWithAutoComplete: document.querySelectorAll('input[autocomplete="on"], input:not([autocomplete])').length,
      passwordVisible:        [...document.querySelectorAll('input[type="password"]')].filter(i => i.type !== 'password').length,
    },

    // ════════════════════════════════════════
    // ♿ ACCESSIBILITY
    // ════════════════════════════════════════
    accessibility: {
      imgsWithoutAlt:      document.querySelectorAll('img:not([alt])').length,
      buttonsWithoutLabel: [...document.querySelectorAll('button')].filter(b =>
                             !b.textContent.trim() && !b.getAttribute('aria-label')
                           ).length,
      inputsWithoutLabel:  [...document.querySelectorAll('input:not([type="hidden"])')].filter(i =>
                             !i.getAttribute('aria-label') &&
                             !i.getAttribute('placeholder') &&
                             !document.querySelector(`label[for="${i.id}"]`)
                           ).length,
      h1Count:             document.querySelectorAll('h1').length,
      missingLangAttr:     !document.documentElement.getAttribute('lang') ? 1 : 0,
      lowContrastLinks:    [...document.querySelectorAll('a')].filter(a =>
                             !a.textContent.trim()
                           ).length,
      tabIndexAbuse:       document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').length,
    },

    // ════════════════════════════════════════
    // ⚡ PERFORMANCE
    // ════════════════════════════════════════
    performance: {
      totalNodes:       document.querySelectorAll('*').length,
      imgsWithoutLazy:  [...document.querySelectorAll('img')].filter(i =>
                          !i.getAttribute('loading')
                        ).length,
      syncScripts:      document.querySelectorAll('script[src]:not([defer]):not([async])').length,
      totalImages:      document.querySelectorAll('img').length,
      totalScripts:     document.querySelectorAll('script').length,
      totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      inlineStyles:     document.querySelectorAll('[style]').length,
      heavyVideos:      document.querySelectorAll('video:not([preload="none"])').length,
    },

    // ════════════════════════════════════════
    // 🔎 SEO
    // ════════════════════════════════════════
    seo: {
      title:          document.title || '❌ ندارد',
      titleLength:    document.title.length,
      hasDescription: !!document.querySelector('meta[name="description"]'),
      hasCanonical:   !!document.querySelector('link[rel="canonical"]'),
      hasOgTags:      !!document.querySelector('meta[property="og:title"]'),
      hasRobots:      !!document.querySelector('meta[name="robots"]'),
      hasViewport:    !!document.querySelector('meta[name="viewport"]'),
      hasCharset:     !!document.querySelector('meta[charset]'),
      h1Count:        document.querySelectorAll('h1').length,
      h2Count:        document.querySelectorAll('h2').length,
    },

    // ════════════════════════════════════════
    // 📋 FORMS (مخصوص فین‌تک)
    // ════════════════════════════════════════
    forms: {
      totalForms:            document.querySelectorAll('form').length,
      formsWithoutAction:    document.querySelectorAll('form:not([action])').length,
      formsWithoutMethod:    document.querySelectorAll('form:not([method])').length,
      sensitiveInputVisible: [...document.querySelectorAll('input')].filter(i =>
                               ['card', 'cvv', 'pan', 'otp'].some(k =>
                                 (i.name || i.id || i.placeholder || '').toLowerCase().includes(k)
                               ) && i.type !== 'password' && i.type !== 'hidden'
                             ).length,
      inputsWithoutType:     document.querySelectorAll('input:not([type])').length,
    },

  };

  // ════════════════════════════════════════
  // 📊 SCORE CALCULATOR
  // ════════════════════════════════════════
  const calcScore = (section) => {
    const values = Object.values(section).filter(v => typeof v === 'number');
    const passed = values.filter(v => v === 0).length;
    return `${passed}/${values.length}`;
  };

  const summary = {
    '🔐 Security':     calcScore(report.security),
    '♿ Accessibility': calcScore(report.accessibility),
    '⚡ Performance':  calcScore(report.performance),
    '🔎 SEO':          calcScore(report.seo),
    '📋 Forms':        calcScore(report.forms),
  };

  // ════════════════════════════════════════
  // ⚠️ WARNINGS & ERRORS
  // ════════════════════════════════════════
  const warnings = [];
  const errors   = [];

  // Security
  if (report.security.unsafeLinks > 0)
    warnings.push(`🔗 ${report.security.unsafeLinks} لینک ناامن با target="_blank"`);
  if (report.security.httpForms > 0)
    errors.push(`🔴 ${report.security.httpForms} فرم روی HTTP (نه HTTPS)`);
  if (report.security.inlineHandlers > 0)
    warnings.push(`⚡ ${report.security.inlineHandlers} Inline Event Handler (onclick, ...)`);
  if (report.security.unsafeIframes > 0)
    warnings.push(`🖼️ ${report.security.unsafeIframes} iframe بدون sandbox`);
  if (report.security.httpImages > 0)
    warnings.push(`🖼️ ${report.security.httpImages} تصویر روی HTTP`);

  // Accessibility
  if (report.accessibility.h1Count !== 1)
    warnings.push(`📌 تعداد H1 برابر ${report.accessibility.h1Count} است (باید دقیقاً ۱ باشد)`);
  if (report.accessibility.imgsWithoutAlt > 0)
    warnings.push(`🖼️ ${report.accessibility.imgsWithoutAlt} تصویر بدون alt`);
  if (report.accessibility.missingLangAttr)
    warnings.push(`🌐 ویژگی lang در تگ <html> تنظیم نشده`);
  if (report.accessibility.inputsWithoutLabel > 0)
    warnings.push(`🏷️ ${report.accessibility.inputsWithoutLabel} input بدون label`);

  // Performance
  if (report.performance.syncScripts > 3)
    warnings.push(`🐢 ${report.performance.syncScripts} اسکریپت بلوک‌کننده رندر (sync)`);
  if (report.performance.totalNodes > 1500)
    warnings.push(`🌳 تعداد DOM Node برابر ${report.performance.totalNodes} است (بهینه: زیر ۱۵۰۰)`);
  if (report.performance.imgsWithoutLazy > 3)
    warnings.push(`🖼️ ${report.performance.imgsWithoutLazy} تصویر بدون loading="lazy"`);

  // SEO
  if (!report.seo.hasDescription)
    errors.push('❌ Meta Description وجود ندارد');
  if (!report.seo.hasCanonical)
    warnings.push('🔗 Canonical Tag وجود ندارد');
  if (!report.seo.hasViewport)
    errors.push('❌ Meta Viewport وجود ندارد');
  if (report.seo.titleLength > 60)
    warnings.push(`📝 طول title برابر ${report.seo.titleLength} کاراکتر است (بهینه: زیر ۶۰)`);

  // Forms (fintech)
  if (report.forms.sensitiveInputVisible > 0)
    errors.push(`🔴 ${report.forms.sensitiveInputVisible} فیلد حساس (کارت/CVV/OTP) به صورت متن نمایش داده می‌شه!`);

  // ════════════════════════════════════════
  // 🖨️ OUTPUT
  // ════════════════════════════════════════
  console.clear();

  console.log(
    '%c 🛠️ PAGE AUDIT REPORT v2.1 ',
    'background:#1a1a2e;color:#e94560;font-size:16px;font-weight:bold;padding:6px 12px;border-radius:4px'
  );
  console.log('%c📍 URL:  ' + location.href,                    'color:#888');
  console.log('%c🕐 Time: ' + new Date().toLocaleString('fa-IR'), 'color:#888');

  console.log(
    '\n%c 📊 SUMMARY ',
    'background:#0f3460;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(summary);

  console.log(
    '\n%c 🔐 SECURITY ',
    'background:#b71c1c;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(report.security);

  console.log(
    '\n%c ♿ ACCESSIBILITY ',
    'background:#1565c0;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(report.accessibility);

  console.log(
    '\n%c ⚡ PERFORMANCE ',
    'background:#e65100;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(report.performance);

  console.log(
    '\n%c 🔎 SEO ',
    'background:#2e7d32;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(report.seo);

  console.log(
    '\n%c 📋 FORMS ',
    'background:#6a1b9a;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
  console.table(report.forms);

  if (errors.length > 0) {
    console.log(
      '\n%c 🔴 ERRORS ',
      'background:#c62828;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
    );
    errors.forEach(e => console.error(e));
  }

  if (warnings.length > 0) {
    console.log(
      '\n%c ⚠️ WARNINGS ',
      'background:#f57f17;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
    );
    warnings.forEach(w => console.warn(w));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(
      '\n%c ✅ هیچ مشکلی پیدا نشد! ',
      'background:#1b5e20;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px'
    );
  }

  console.log('%c ─────────────────────────────────────── ', 'color:#444');
  console.log(
    `%c 🔴 Errors: ${errors.length}   ⚠️ Warnings: ${warnings.length} `,
    errors.length > 0
      ? 'color:#e53935;font-weight:bold;font-size:13px'
      : 'color:#43a047;font-weight:bold;font-size:13px'
  );

  // ✅ مقدار نهایی - جلوی undefined رو می‌گیره
  return `✅ Audit Done! | Errors: ${errors.length} | Warnings: ${warnings.length}`;

})();
