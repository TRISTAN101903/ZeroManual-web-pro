(function () {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Language toggle ---------------- */
  const langButtons = document.querySelectorAll('[data-set-lang]');
  const binTimeEl = document.getElementById('bin-time');

  const binTimeText = {
    vi: '6 tệp đã đổi tên trong 0.3s',
    en: '6 files renamed in 0.3s'
  };

  const CONTACT_EMAIL = 'thanhtuhaibabon@gmail.com';

  const mailCopy = {
    vi: {
      proSubject: 'Mua LeaniZ_Flow Studio PRO',
      proBody: 'Xin chào,\n\nTôi muốn mua bản Lifetime PRO của LeaniZ_Flow Studio.\n\nTên:\nSố máy cần kích hoạt:\nGhi chú:\n',
      supportSubject: 'Hỗ trợ ZeroManual',
      supportBody: 'Xin chào,\n\nTôi cần hỗ trợ về LeaniZ_Flow Studio.\n\n'
    },
    en: {
      proSubject: 'Purchase LeaniZ_Flow Studio PRO',
      proBody: 'Hi,\n\nI would like to buy the Lifetime PRO license for LeaniZ_Flow Studio.\n\nName:\nSeats needed:\nNotes:\n',
      supportSubject: 'ZeroManual support',
      supportBody: 'Hi,\n\nI need help with LeaniZ_Flow Studio.\n\n'
    }
  };

  function mailUrls(subject, body) {
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { mailto };
  }

  function openCompose(subject, body) {
    window.location.href = mailUrls(subject, body).mailto;
  }

  function currentLang() {
    return root.getAttribute('lang') === 'en' ? 'en' : 'vi';
  }

  function syncMailLinks() {
    const copy = mailCopy[currentLang()];
    const pro = mailUrls(copy.proSubject, copy.proBody);
    const support = mailUrls(copy.supportSubject, copy.supportBody);
    document.querySelectorAll('.js-pro-mail').forEach(a => { a.href = pro.mailto; });
    document.querySelectorAll('.js-support-mail').forEach(a => { a.href = support.mailto; });
    const topic = document.getElementById('cf-topic');
    if (topic) {
      [...topic.options].forEach(opt => {
        const label = currentLang() === 'en' ? opt.dataset.labelEn : opt.dataset.labelVi;
        if (label) opt.textContent = label;
      });
    }
  }

  function applyLang(lang) {
    root.setAttribute('lang', lang);
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.setLang === lang);
    });
    if (binTimeEl && binTimeEl.dataset.done === 'true') {
      binTimeEl.textContent = binTimeText[lang];
    }
    syncMailLinks();
    try { localStorage.setItem('zm_lang', lang); } catch (e) {}
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.setLang));
  });

  let initialLang = 'en';
  try {
    initialLang = localStorage.getItem('zm_lang') || 'en';
  } catch (e) {}
  applyLang(initialLang);

  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Hero bin — single orchestrated load animation ---------------- */
  function playBinDemo() {
    const rows = document.querySelectorAll('.bin-row');
    const arrow = document.getElementById('bin-arrow');
    if (prefersReducedMotion) {
      rows.forEach(r => r.classList.add('show'));
      if (arrow) arrow.classList.add('show');
      if (binTimeEl) { binTimeEl.textContent = binTimeText[root.getAttribute('lang')]; binTimeEl.dataset.done = 'true'; }
      return;
    }
    rows.forEach((row, i) => {
      const col = row.closest('.bin-pane').classList.contains('after') ? 1 : 0;
      const idx = parseInt(row.dataset.row, 10) || 0;
      const delay = col === 0 ? idx * 120 : 700 + idx * 130;
      setTimeout(() => row.classList.add('show'), delay);
    });
    setTimeout(() => arrow && arrow.classList.add('show'), 550);
    setTimeout(() => {
      if (binTimeEl) {
        binTimeEl.textContent = binTimeText[root.getAttribute('lang')];
        binTimeEl.dataset.done = 'true';
      }
    }, 1550);
  }
  window.addEventListener('DOMContentLoaded', () => setTimeout(playBinDemo, 300));

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .section-head');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        } else {
          entry.target.classList.remove('in');
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------------- Timer strip (replays when scrolled into view) ---------------- */
  const timerStrip = document.getElementById('timer-strip');
  if (timerStrip && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timerStrip.classList.add('play');
        } else {
          timerStrip.classList.remove('play');
        }
      });
    }, { threshold: 0.4 });
    tio.observe(timerStrip);
  } else if (timerStrip) {
    timerStrip.classList.add('play');
  }

  /* ---------------- PRO / support mail compose ---------------- */
  document.querySelectorAll('.js-pro-mail').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const copy = mailCopy[currentLang()];
      openCompose(copy.proSubject, copy.proBody);
    });
  });
  document.querySelectorAll('.js-support-mail').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const copy = mailCopy[currentLang()];
      openCompose(copy.supportSubject, copy.supportBody);
    });
  });

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const statusText = {
    vi: {
      opened: 'Đã mở cửa sổ soạn email tới thanhtuhaibabon@gmail.com. Nếu chưa thấy, hãy cho phép popup hoặc dùng ứng dụng Mail.',
      err: 'Vui lòng điền đầy đủ Tên, Email và Nội dung.'
    },
    en: {
      opened: 'Opened a draft to thanhtuhaibabon@gmail.com. If nothing appeared, allow pop-ups or use your Mail app.',
      err: 'Please fill in Name, Email, and Message.'
    }
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const lang = currentLang();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const topic = (form.topic && form.topic.value) || 'pro';

      if (!name || !email || !message) {
        statusEl.textContent = statusText[lang].err;
        statusEl.className = 'form-status err';
        return;
      }

      const copy = mailCopy[lang];
      const subject = topic === 'pro'
        ? copy.proSubject + ' — ' + name
        : copy.supportSubject + ' — ' + name;
      const body = message + '\n\n— ' + name + ' (' + email + ')';
      openCompose(subject, body);

      statusEl.textContent = statusText[lang].opened;
      statusEl.className = 'form-status ok';
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
