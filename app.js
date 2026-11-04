/**
 * Wedding Invitation Application Logic
 * Ankit Mishra & Saumya Shukla — Shubh Vivah
 * 7–9 December 2026 · Prayagraj
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Global References & State
  // ---------------------------------------------------------------------------
  const W = window.WEDDING;
  const T = window.I18N;

  let lang = 'en';
  let isBrideSide = location.hash === '#bride';
  let audioStarted = false;
  let wasPlayingBeforeHidden = false;

  const gate = document.getElementById('gate');
  const audio = document.getElementById('au');
  const ppBtn = document.getElementById('pp');

  // ---------------------------------------------------------------------------
  // 2. Language Management
  // ---------------------------------------------------------------------------
  function setLang(l) {
    lang = l;
    localStorage.setItem('lang', l);
    document.documentElement.lang = l === 'hi' ? 'hi' : 'en';

    // Update all static [data-t] elements
    document.querySelectorAll('[data-t]').forEach(el => {
      const key = el.dataset.t;
      const dict = T[lang] || T.en;
      if (dict && dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Update language toggle buttons
    document.querySelectorAll('[data-lg]').forEach(btn => {
      btn.textContent = lang === 'en' ? 'हिंदी' : 'English';
    });

    // Re-render dynamic components
    renderNames();
    renderDate();
    renderTimeline();
    renderRSVP();
    renderCard();
  }

  // Attach language toggle listeners
  document.querySelectorAll('[data-lg]').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(lang === 'en' ? 'hi' : 'en');
    });
  });

  // Listen for hash change (#bride switch)
  window.addEventListener('hashchange', () => {
    isBrideSide = location.hash === '#bride';
    renderNames();
    renderCard();
  });

  // ---------------------------------------------------------------------------
  // 3. Name Rendering & Entrance Animation
  // ---------------------------------------------------------------------------
  function getCoupleNames() {
    const g = W.groom[lang] || W.groom.en;
    const b = W.bride[lang] || W.bride.en;
    const sep = lang === 'hi' ? ' व ' : ' & ';
    return isBrideSide ? (b + sep + g) : (g + sep + b);
  }

  function renderNames() {
    const fullName = getCoupleNames();

    // Gate names
    const gn = document.getElementById('gn');
    if (gn) gn.textContent = fullName;

    // Hero names: only set directly if hero is already revealed or not yet animated
    const hn = document.getElementById('hn');
    if (hn) {
      if (hn.children.length > 0) {
        // Already animated before, re-animate with current language
        animateNames();
      } else {
        hn.textContent = fullName;
      }
    }
  }

  function animateNames() {
    const fullName = getCoupleNames();
    const hn = document.getElementById('hn');
    if (!hn) return;

    hn.innerHTML = '';
    if (lang === 'hi') {
      // Word by word for Devanagari
      const words = fullName.split(' ');
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word + (i < words.length - 1 ? ' ' : '');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.animation = `letterRise 0.6s cubic-bezier(.4,0,.2,1) ${i * 0.16}s forwards`;
        hn.appendChild(span);
      });
    } else {
      // Letter by letter for Latin
      [...fullName].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.animation = `letterRise 0.5s cubic-bezier(.4,0,.2,1) ${i * 0.05}s forwards`;
        hn.appendChild(span);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Date Rendering
  // ---------------------------------------------------------------------------
  function renderDate() {
    const city = W.city[lang] || W.city.en;
    const dateStr = lang === 'hi'
      ? '७–९ दिसम्बर २०२६ · ' + city
      : '7–9 December 2026 · ' + city;

    const gd = document.getElementById('gd');
    if (gd) gd.textContent = dateStr;

    const hd = document.getElementById('hd');
    if (hd) hd.textContent = dateStr;
  }

  // ---------------------------------------------------------------------------
  // 5. Gate Entrance Logic
  // ---------------------------------------------------------------------------
  const openBtn = document.getElementById('ob');
  if (openBtn) {
    openBtn.addEventListener('click', openGate);
  }

  function openGate() {
    if (!gate) return;
    gate.classList.add('gate-open');

    // Start background music at 50% volume
    if (!audioStarted && W.music) {
      audio.src = W.music;
      audio.volume = 0.5;
      audio.play().then(() => {
        if (ppBtn) ppBtn.textContent = '⏸';
      }).catch(() => {
        // Autoplay may be blocked by user agent
        if (ppBtn) ppBtn.textContent = '♪';
      });
      audioStarted = true;
    }

    // Start flower petal canvas animation
    startPetals();

    // Reveal top sticky bar after 1400ms
    setTimeout(() => {
      const bar = document.getElementById('bar');
      if (bar) bar.classList.add('visible');
      gate.style.pointerEvents = 'none';
    }, 1400);

    // Hide gate completely after doors open
    setTimeout(() => {
      gate.style.display = 'none';
    }, 3000);

    // Animate hero couple names
    setTimeout(animateNames, 1800);
  }

  // ---------------------------------------------------------------------------
  // 6. Music Control & Page Visibility
  // ---------------------------------------------------------------------------
  if (ppBtn) {
    ppBtn.addEventListener('click', () => {
      if (!audio.src && W.music) {
        audio.src = W.music;
        audio.volume = 0.5;
      }

      if (audio.paused) {
        audio.play().then(() => {
          ppBtn.textContent = '⏸';
          audioStarted = true;
        }).catch(() => {});
      } else {
        audio.pause();
        ppBtn.textContent = '♪';
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (audio && !audio.paused) {
        audio.pause();
        wasPlayingBeforeHidden = true;
        if (ppBtn) ppBtn.textContent = '♪';
      }
    } else {
      if (wasPlayingBeforeHidden && audioStarted) {
        audio.play().then(() => {
          if (ppBtn) ppBtn.textContent = '⏸';
        }).catch(() => {});
        wasPlayingBeforeHidden = false;
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 7. Particle Canvas (Organic Falling Flower Petals)
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const FLOWERS = {
    rose:    [{ shape: 'petal', colors: ['#C0392B', '#E8A0A0', '#FFF5F5', '#A93226'] }],
    genda:   [{ shape: 'petal', colors: ['#F5A623', '#F7DC6F', '#FF8C00', '#F39C12'] }],
    lotus:   [{ shape: 'petal', colors: ['#F1948A', '#FADBD8', '#ffffff', '#E6B0AA'] }],
    pink:    [{ shape: 'petal', colors: ['#E8A0C0', '#F4D0E0', '#ffffff', '#D98880'] }],
    ashoka:  [{ shape: 'leaf',  colors: ['#5D8A4E', '#A8D5A2', '#F7DC6F', '#7D9D64'] }],
    bougain: [{ shape: 'petal', colors: ['#C0392B', '#FF69B4', '#DB7093', '#E91E63'] }],
    glitter: [{ shape: 'star',  colors: ['#C29B58', '#F7E8D0', '#ffffff', '#DFC48E'] }]
  };

  const PARTICLE_COUNT = 55;
  let particles = [];
  let currentFlowerType = 'rose';
  let prevScrollY = window.scrollY;
  let windX = 0;
  let petalsActive = false;

  function createParticle(type, startAnywhere = false) {
    const configs = FLOWERS[type] || FLOWERS.rose;
    const cfg = configs[Math.floor(Math.random() * configs.length)];
    const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];

    return {
      x: Math.random() * canvas.width,
      y: startAnywhere ? (Math.random() * canvas.height) : (-20 - Math.random() * 80),
      vx: (Math.random() - 0.5) * 0.9,
      vy: 0.6 + Math.random() * 1.3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.05,
      op: 0.55 + Math.random() * 0.45,
      size: 7 + Math.random() * 10,
      color: color,
      shape: cfg.shape,
      type: type
    };
  }

  function startPetals() {
    petalsActive = true;
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(currentFlowerType, true));
  }

  function drawPetal(c, p) {
    c.save();
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    c.globalAlpha = p.op;
    c.fillStyle = p.color;
    c.beginPath();

    if (p.shape === 'petal') {
      // Graceful curved flower petal
      c.moveTo(0, -p.size);
      c.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.7, p.size * 0.4, 0, p.size);
      c.bezierCurveTo(-p.size * 0.7, p.size * 0.4, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
    } else if (p.shape === 'leaf') {
      // Slender Ashoka mango leaf
      c.moveTo(0, -p.size * 1.2);
      c.quadraticCurveTo(p.size * 0.4, 0, 0, p.size * 1.2);
      c.quadraticCurveTo(-p.size * 0.4, 0, 0, -p.size * 1.2);
    } else if (p.shape === 'star') {
      // 4-point gold sparkle
      const s = p.size * 0.8;
      const inner = s * 0.25;
      for (let i = 0; i < 4; i++) {
        c.lineTo(0, -s);
        c.lineTo(inner, -inner);
        c.rotate(Math.PI / 2);
      }
      c.closePath();
    }

    c.fill();
    c.restore();
  }

  function updateParticleSection() {
    const sections = [
      { id: 'hero',  type: 'rose' },
      { id: 'bless', type: 'genda' },
      { id: 'card',  type: 'lotus' },
      { id: 'cdn',   type: 'pink' },
      { id: 'fn',    type: 'ashoka' },
      { id: 'gal',   type: 'bougain' },
      { id: 'end',   type: 'glitter' }
    ];

    const midY = window.innerHeight * 0.45;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= midY && r.bottom >= midY) {
        if (currentFlowerType !== s.type) {
          currentFlowerType = s.type;
        }
        break;
      }
    }

    // Wind drift on scroll
    const currentScrollY = window.scrollY;
    const dy = currentScrollY - prevScrollY;
    windX = Math.sign(dy) * Math.min(Math.abs(dy) * 0.05, 3.2);
    prevScrollY = currentScrollY;
  }

  function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!petalsActive) return;

    // Decay wind resistance
    windX *= 0.94;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx + windX;
      p.y += p.vy;
      p.rot += p.rotV;

      // Reset when falling out of viewport
      if (p.y > canvas.height + 25 || p.x < -30 || p.x > canvas.width + 30) {
        particles[i] = createParticle(currentFlowerType);
      }

      drawPetal(ctx, p);
    }
  }
  animateCanvas();

  // ---------------------------------------------------------------------------
  // 8. Countdown Timer
  // ---------------------------------------------------------------------------
  function renderCountdown() {
    const target = new Date('2026-12-09T19:30:00+05:30');
    const cd = document.getElementById('cd');
    if (!cd) return;

    function tick() {
      const now = new Date();
      const diff = target - now;
      const dict = T[lang] || T.en;

      if (diff <= 0) {
        cd.innerHTML = `<p class="cdn">${dict.muhuratArrived || 'The Shubh Muhurat has arrived!'}</p>`;
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      cd.innerHTML = `
        <div class="cdc"><span class="cdn">${d}</span><span class="cdl">${dict.days}</span></div>
        <span class="cds">◆</span>
        <div class="cdc"><span class="cdn">${h}</span><span class="cdl">${dict.hrs}</span></div>
        <span class="cds">◆</span>
        <div class="cdc"><span class="cdn">${m}</span><span class="cdl">${dict.mins}</span></div>
        <span class="cds">◆</span>
        <div class="cdc"><span class="cdn">${s}</span><span class="cdl">${dict.secs}</span></div>
      `;
    }

    tick();
    setInterval(tick, 1000);
  }

  // ---------------------------------------------------------------------------
  // 9. Wedding Functions / Timeline
  // ---------------------------------------------------------------------------
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toUtcISO(d) {
    return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`;
  }

  function generateICS(ev, l) {
    const dt = new Date(ev.start);
    const end = new Date(dt.getTime() + 3.5 * 3600000);
    const evTitle = (l === 'hi' ? (ev.hi || ev.en) : ev.en) + ' - Ankit & Saumya Wedding';
    const venue = l === 'hi' ? (ev.venueHi || ev.venue) : ev.venue;
    const noteText = ev.note ? (l === 'hi' ? (ev.note.hi || ev.note.en) : ev.note.en) : '';
    const desc = noteText ? `${evTitle}\\n${noteText}` : evTitle;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AnkitSaumya//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${ev.id}-202612@ankitsaumya.wedding`,
      `DTSTAMP:${toUtcISO(new Date())}`,
      `DTSTART:${toUtcISO(dt)}`,
      `DTEND:${toUtcISO(end)}`,
      `SUMMARY:${evTitle}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function renderTimeline() {
    const tl = document.getElementById('tl');
    if (!tl) return;

    const dict = T[lang] || T.en;
    const dressMap = {
      haldi: dict.dressHaldi,
      sangeet: dict.dressSangeet,
      pheras: dict.dressPheras
    };

    tl.innerHTML = W.events.map((ev, i) => {
      const dt = new Date(ev.start);
      const endDt = new Date(dt.getTime() + 3.5 * 3600000);

      const dateStr = lang === 'hi'
        ? dt.toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

      const timeStr = dt.toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const venue = lang === 'hi' ? (ev.venueHi || ev.venue) : ev.venue;
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(ev.mapsQ)}`;

      const evTitle = (lang === 'hi' ? (ev.hi || ev.en) : ev.en) + ' - Ankit & Saumya Wedding';
      const calStart = toUtcISO(dt);
      const calEnd = toUtcISO(endDt);
      const calUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(evTitle)}&dates=${calStart}/${calEnd}&details=${encodeURIComponent(venue)}&location=${encodeURIComponent(ev.mapsQ)}`;

      const icsContent = generateICS(ev, lang);
      const icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const icsUrl = URL.createObjectURL(icsBlob);

      const isPheras = ev.id === 'pheras';
      const noteHtml = isPheras ? `<p class="muhurat-note ${lang === 'hi' ? 'dv' : ''}">${dict.muhuratNote}</p>` : '';
      const filmBtn = (isPheras && W.video) ? `<a href="${W.video}" class="btn-ghost" target="_blank" rel="noopener">${dict.film}</a>` : '';

      return `
        <div class="tlc ${i % 2 === 1 ? 'alt' : ''} ${isPheras ? 'muhu' : ''}">
          <div class="tl-dot"></div>
          <div class="tl-card paper">
            <h3 class="${lang === 'hi' ? 'dv' : ''}">${lang === 'hi' ? (ev.hi || ev.en) : ev.en}</h3>
            <p class="tl-dt">${dateStr}</p>
            <p class="tl-time">🕐 ${timeStr}</p>
            <p class="tl-venue">📍 ${venue}</p>
            ${isPheras ? `<p class="tl-muhurat ${lang === 'hi' ? 'dv' : ''}">${dict.muhurat}</p>` : ''}
            <span class="dress-pill">${dict.dressCode}: ${dressMap[ev.id] || ''}</span>
            ${noteHtml}
            <div class="tl-btns">
              <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn-sm">${dict.dir}</a>
              <a href="${calUrl}" target="_blank" rel="noopener" class="btn-sm">${dict.cal}</a>
              <a href="${icsUrl}" download="${ev.id}.ics" class="btn-sm">.ics</a>
              ${filmBtn}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ---------------------------------------------------------------------------
  // 10. Formal Card Rendering
  // ---------------------------------------------------------------------------
  function renderCard() {
    const ct = document.getElementById('ct');
    if (!ct) return;

    const side = isBrideSide ? 'bride' : 'groom';
    const text = W.cardText?.[side]?.[lang] || W.cardText?.[side]?.en;
    const dict = T[lang] || T.en;

    ct.innerHTML = text
      ? `<p class="${lang === 'hi' ? 'dv' : ''}">${text.replace(/\n/g, '<br>')}</p>`
      : `<p class="placeholder">${dict.cardPlaceholder}</p>`;
  }

  // ---------------------------------------------------------------------------
  // 11. RSVP Contacts
  // ---------------------------------------------------------------------------
  function renderRSVP() {
    const rs = document.getElementById('rs');
    const h3 = document.querySelector('#end h3[data-t="rsvp"]');
    if (!rs) return;

    if (!W.rsvp || W.rsvp.length === 0) {
      rs.innerHTML = '';
      if (h3) h3.style.display = 'none';
      return;
    }

    if (h3) h3.style.display = '';
    rs.innerHTML = W.rsvp.map(r => `
      <div class="rsvp-card">
        <strong>${r.name}</strong>
        <a href="tel:${r.phone}">${r.phone}</a>
        <a href="https://wa.me/${r.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    `).join('');
  }

  // ---------------------------------------------------------------------------
  // 12. Auto-Sliding Gallery Renderer with Seamless Infinite Loop & Lightbox
  // ---------------------------------------------------------------------------
  function renderGallery() {
    const track = document.getElementById('gal-track');
    const container = document.getElementById('gal-container');
    if (!track) return;

    const photos = W.gallery || [];

    if (photos.length === 0) {
      // Duplicate placeholder frames so they slide left seamlessly
      track.innerHTML = `
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
        <div class="gal-item placeholder"><i></i></div>
      `;
      return;
    }

    // To make infinite sliding perfectly seamless:
    // Create Set 1 + Set 2 (repeat so width is sufficient on all viewports)
    let minPerSet = Math.max(photos.length, 4);
    let set1 = [];
    while (set1.length < minPerSet) {
      set1 = set1.concat(photos.map((p, idx) => ({ ...p, origIdx: idx })));
    }
    // Set 2 is identical to Set 1
    const set2 = set1.map(p => ({ ...p }));
    const allItems = set1.concat(set2);

    // Calculate duration based on items (~4.5s per item for serene, elegant pace)
    const duration = Math.max(22, set1.length * 4.5);
    track.style.animationDuration = `${duration}s`;

    track.innerHTML = allItems.map((p) => `
      <div class="gal-item" data-index="${p.origIdx}">
        <img src="${p.src}" alt="${p.caption || 'Wedding Photo'}" loading="lazy"
             onerror="this.closest('.gal-item').classList.add('gal-err')">
        ${p.caption ? `<span class="gal-cap">${p.caption}</span>` : ''}
      </div>
    `).join('');

    // Pause on hover or touch
    if (container) {
      container.addEventListener('mouseenter', () => track.classList.add('paused'));
      container.addEventListener('mouseleave', () => track.classList.remove('paused'));
      container.addEventListener('touchstart', () => track.classList.add('paused'), { passive: true });
      container.addEventListener('touchend', () => track.classList.remove('paused'));
    }

    // Lightbox Setup
    let overlay = document.getElementById('lb');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'lb';
      overlay.innerHTML = `
        <button class="lb-close" aria-label="Close">✕</button>
        <button class="lb-prev" aria-label="Previous">‹</button>
        <img id="lb-img" alt="">
        <p id="lb-cap"></p>
        <button class="lb-next" aria-label="Next">›</button>
      `;
      document.body.appendChild(overlay);
    }

    let currentIdx = 0;

    function showLightbox(idx) {
      currentIdx = (idx + photos.length) % photos.length;
      const p = photos[currentIdx];
      document.getElementById('lb-img').src = p.src;
      document.getElementById('lb-cap').textContent = p.caption || '';
      overlay.classList.add('open');
      track.classList.add('paused');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      track.classList.remove('paused');
      document.body.style.overflow = '';
    }

    track.querySelectorAll('.gal-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = item.dataset.index;
        if (idx !== undefined) showLightbox(+idx);
      });
    });

    overlay.querySelector('.lb-close').onclick = closeLightbox;
    overlay.querySelector('.lb-prev').onclick = () => showLightbox(currentIdx - 1);
    overlay.querySelector('.lb-next').onclick = () => showLightbox(currentIdx + 1);
    overlay.onclick = e => { if (e.target === overlay) closeLightbox(); };

    // Swipe support
    let touchStartX = 0;
    overlay.ontouchstart = e => { touchStartX = e.touches[0].clientX; };
    overlay.ontouchend = e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) showLightbox(currentIdx + (dx < 0 ? 1 : -1));
    };

    // Keyboard navigation
    document.onkeydown = e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'ArrowRight') showLightbox(currentIdx + 1);
      if (e.key === 'ArrowLeft')  showLightbox(currentIdx - 1);
      if (e.key === 'Escape')     closeLightbox();
    };
  }

  // ---------------------------------------------------------------------------
  // 13. Share & Copy Link Actions
  // ---------------------------------------------------------------------------
  const shareBtn = document.getElementById('sh');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = location.href;
      const title = `${W.groom.en} & ${W.bride.en} — Shubh Vivah`;
      const text = `You are warmly invited to our wedding on 7–9 December 2026, Prayagraj.`;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (e) {
          // User dismissed or share failed
        }
      } else {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(title + '\n' + text + '\n' + url)}`;
        window.open(waUrl, '_blank');
      }
    });
  }

  const copyBtn = document.getElementById('cp');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => {
        const dict = T[lang] || T.en;
        const orig = copyBtn.textContent;
        copyBtn.textContent = dict.copied || 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = orig;
        }, 2000);
      }).catch(() => {
        // Fallback for clipboard
        const input = document.createElement('input');
        input.value = location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        const dict = T[lang] || T.en;
        const orig = copyBtn.textContent;
        copyBtn.textContent = dict.copied || 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = orig;
        }, 2000);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 13. Scroll Reveal & Timeline Thread Fill
  // ---------------------------------------------------------------------------
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section').forEach(section => {
    revealObs.observe(section);
  });

  const tlEl = document.getElementById('tl');
  window.addEventListener('scroll', () => {
    if (tlEl) {
      const rect = tlEl.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
      tlEl.style.setProperty('--fill', pct);
    }
    updateParticleSection();
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // 14. Bootstrap
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    lang = localStorage.getItem('lang') || 'en';
    setLang(lang);
    renderCountdown();
    renderGallery();

    // Monogram image
    const m1 = document.getElementById('m1');
    if (m1 && W.monogram) {
      m1.src = W.monogram;
    }

    // Ganesha images (Gate, Top Header, Hero, Blessings)
    const ganeshSrc = W.ganesh || 'assets/ganesh.png';
    document.querySelectorAll('.ganesh-photo, .bar-ganesh').forEach(img => {
      img.src = ganeshSrc;
    });

    // Audio source
    if (W.music && audio) {
      audio.src = W.music;
    }
  });

})();
