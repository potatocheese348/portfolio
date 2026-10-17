(function () {
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Always start at Home when the page loads or reloads */
  scrollTo(0, 0);
  addEventListener('pageshow', function (e) { if (e.persisted) scrollTo(0, 0); });
  addEventListener('beforeunload', function () { scrollTo(0, 0); });

  /* ---------- Splash screen ---------- */
  var loader = $('loader'), bar = $('loaderBar'), count = $('loaderCount'), statusEl = $('ldStatus');
  var steps = [[0, 'Starting up'], [25, 'Loading skills'], [50, 'Connecting databases'], [75, 'Building the interface'], [96, 'Ready']];
  var progress = 0;
  var timer = setInterval(function () {
    progress = Math.min(100, progress + Math.ceil(Math.random() * 6));
    bar.style.width = progress + '%';
    count.textContent = progress;
    steps.forEach(function (s) { if (progress >= s[0]) statusEl.textContent = s[1]; });
    if (progress >= 100) { clearInterval(timer); setTimeout(hideLoader, 450); }
  }, 85);
  function hideLoader() {
    loader.classList.add('leaving');
    setTimeout(function () { loader.classList.add('done'); document.body.classList.remove('is-loading'); startHeroEffects(); observeCounters(); }, 350);
    setTimeout(function () { loader.style.display = 'none'; }, 1400);
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = $('themeToggle');
  function syncLabel() {
    themeBtn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncLabel();
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncLabel();
  });

  /* ---------- Theme color picker ---------- */
  var colorBtn = $('colorBtn'), colorMenu = $('colorMenu'), swatches = document.querySelectorAll('.swatch');
  function closeColors() { colorMenu.hidden = true; colorBtn.setAttribute('aria-expanded', 'false'); }
  function applyAccent(name) {
    if (name === 'mono') root.removeAttribute('data-accent'); else root.setAttribute('data-accent', name);
    swatches.forEach(function (b) { var on = b.getAttribute('data-accent') === name; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
  }
  (function () { var saved = 'mono'; try { saved = localStorage.getItem('accent') || 'mono'; } catch (e) {} applyAccent(saved); })();
  colorBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = colorMenu.hidden; colorMenu.hidden = !open; colorBtn.setAttribute('aria-expanded', open);
  });
  swatches.forEach(function (b) {
    b.addEventListener('click', function () {
      var name = b.getAttribute('data-accent');
      applyAccent(name);
      try { localStorage.setItem('accent', name); } catch (e) {}
    });
  });
  document.addEventListener('click', function (e) { if (!colorMenu.contains(e.target)) closeColors(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeColors(); });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('menuToggle'), links = $('navLinks');
  function closeMenu() { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    menuBtn.setAttribute('aria-expanded', links.classList.toggle('open'));
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('click', function (e) { if (!links.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Animated background (nodes, lines and drifting shapes) ---------- */
  (function () {
    var c = $('bg'); if (!c) return;
    var ctx = c.getContext('2d'), w = 0, h = 0, dpr = 1, rgb = '108,140,255';
    var PATHS = ['M16 18l6-6-6-6M8 6l-6 6 6 6','M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3zM3 6v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3','M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01','M5 3l14 7-6 2-2 6z','M13 2L4 14h7l-1 8 9-12h-7z','M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12v10M12 12L3 7','M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2'].map(function (d) { return new Path2D(d); });
    var icons = [], dots = [], shapes = [], mouse = { x: -9999, y: -9999 }, running = true;
    function readColor() { rgb = getComputedStyle(root).getPropertyValue('--node').trim() || rgb; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(80, Math.floor(w * h / 20000));
      dots = []; for (var i = 0; i < n; i++) dots.push({ x: rand(0, w), y: rand(0, h), vx: rand(-.25, .25), vy: rand(-.25, .25), r: rand(1, 2.2) });
      var m = Math.max(5, Math.min(11, Math.floor(w / 140)));
      icons = []; var ni = Math.max(6, Math.min(14, Math.floor(w / 110)));
      for (var q = 0; q < ni; q++) icons.push({ x: rand(0, w), y: rand(0, h), vx: rand(-.22, .22), vy: rand(-.22, .22), s: rand(22, 42), a: rand(-.5, .5), va: rand(-.004, .004), p: PATHS[q % PATHS.length] });
      shapes = []; for (var j = 0; j < m; j++) shapes.push({ x: rand(0, w), y: rand(0, h), vx: rand(-.18, .18), vy: rand(-.18, .18), s: rand(14, 36), a: rand(0, 6.28), va: rand(-.006, .006), k: j % 3 });
    }
    function poly(s, sides) {
      ctx.beginPath();
      for (var i = 0; i < sides; i++) { var a = s.a + i * 6.2832 / sides; ctx[i ? 'lineTo' : 'moveTo'](s.x + Math.cos(a) * s.s, s.y + Math.sin(a) * s.s); }
      ctx.closePath(); ctx.stroke();
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.2;
      shapes.forEach(function (s) {
        s.x += s.vx; s.y += s.vy; s.a += s.va;
        if (s.x < -50) s.x = w + 50; if (s.x > w + 50) s.x = -50; if (s.y < -50) s.y = h + 50; if (s.y > h + 50) s.y = -50;
        ctx.strokeStyle = 'rgba(' + rgb + ',.34)';
        if (s.k === 0) { ctx.beginPath(); ctx.arc(s.x, s.y, s.s * .8, 0, 6.2832); ctx.stroke(); } else poly(s, s.k === 1 ? 4 : 3);
      });
      icons.forEach(function (o) {
        o.x += o.vx; o.y += o.vy; o.a += o.va;
        if (o.x < -60) o.x = w + 60; if (o.x > w + 60) o.x = -60; if (o.y < -60) o.y = h + 60; if (o.y > h + 60) o.y = -60;
        ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.a); ctx.scale(o.s / 24, o.s / 24); ctx.translate(-12, -12);
        ctx.lineWidth = 1.5 * 24 / o.s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(' + rgb + ',.4)'; ctx.stroke(o.p); ctx.restore();
      });
      ctx.lineWidth = 1;
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(' + rgb + ',.65)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var q = dots[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 14400) { ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.22 * (1 - d / 14400)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < 25600) { ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.5 * (1 - md / 25600)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      if (running && !reduce) requestAnimationFrame(frame);
    }
    readColor(); build(); frame();
    new MutationObserver(function () { readColor(); if (reduce) frame(); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-accent'] });
    addEventListener('resize', function () { build(); if (reduce) frame(); });
    addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running && !reduce) requestAnimationFrame(frame); });
  })();

  /* ---------- Count-up numbers (hero stats + skill percentages) ---------- */
  function countUp(el) {
    var target = +el.getAttribute('data-count'), suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var t0 = performance.now(), dur = 1300;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var seen = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target; seen.unobserve(t);
      if (t.classList.contains('meter')) t.classList.add('on'); else countUp(t);
    });
  }, { threshold: 0.4 }) : null;
  function observeCounters() {
    document.querySelectorAll('.meter,[data-count]').forEach(function (el) {
      if (seen) seen.observe(el); else if (el.classList.contains('meter')) el.classList.add('on'); else countUp(el);
    });
  }

  /* ---------- Typing effect ---------- */
  function startHeroEffects() {
    var el = $('typed'); if (!el || reduce) return;
    var roles = ['Information Technology student', 'Web developer', 'Database enthusiast', 'Problem solver'];
    var ri = 0, ci = roles[0].length, del = true;
    (function type() {
      var word = roles[ri];
      ci += del ? -1 : 1;
      el.textContent = word.slice(0, ci);
      var wait = del ? 35 : 70;
      if (!del && ci === word.length) { del = true; wait = 1600; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 300; }
      setTimeout(type, wait);
    })();
  }

  /* ---------- Portrait follows the cursor ---------- */
  var vis = $('heroVisual'), stage = $('stage'), hero = $('home');
  if (vis && stage && !reduce) {
    var layers = stage.querySelectorAll('[data-depth]');
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var loop = function () {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      stage.style.transform = 'perspective(900px) rotateY(' + (cx * 16) + 'deg) rotateX(' + (-cy * 16) + 'deg)';
      layers.forEach(function (l) { var d = +l.getAttribute('data-depth'); l.style.translate = (cx * d) + 'px ' + (cy * d) + 'px'; });
      raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(loop) : 0;
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(loop); };
    hero.addEventListener('pointermove', function (e) {
      var r = vis.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      kick();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }

  /* ---------- Active nav link ---------- */
  var navA = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navA.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { so.observe(s); });
  }

  /* ---------- Scroll progress + back to top ---------- */
  var prog = $('progress'), toTop = $('toTop'), ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    toTop.classList.toggle('show', scrollY > 500);
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  onScroll();

  /* ---------- Project filter ---------- */
  var fbtns = document.querySelectorAll('.filter button'), projs = document.querySelectorAll('.project');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      fbtns.forEach(function (x) { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
      projs.forEach(function (p) { p.hidden = !(f === 'all' || p.getAttribute('data-cat') === f); });
    });
  });

  /* ---------- Contact form: inline validation + live counter ---------- */
  var form = $('contactForm'), status = $('formStatus'), msg = $('message'), counter = $('msgCount');
  var rules = {
    name: function (v) { return v.length < 2 ? 'Enter your name.' : ''; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'; },
    subject: function (v) { return v.length < 3 ? 'Add a short subject.' : ''; },
    message: function (v) { return v.length < 10 ? 'Write at least 10 characters.' : ''; }
  };
  function check(id) {
    var input = $(id), err = rules[id](input.value.trim()), box = input.parentNode, note = box.querySelector('.field-error');
    input.setAttribute('aria-invalid', err ? 'true' : 'false');
    if (err) { if (!note) { note = document.createElement('small'); note.className = 'field-error'; box.appendChild(note); } note.textContent = err; }
    else if (note) note.remove();
    return !err;
  }
  Object.keys(rules).forEach(function (id) {
    $(id).addEventListener('blur', function () { check(id); });
    $(id).addEventListener('input', function () { if ($(id).getAttribute('aria-invalid') === 'true') check(id); });
  });
  msg.addEventListener('input', function () { counter.textContent = msg.value.length + ' / 500'; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    var ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; status.classList.add('error'); form.querySelector('[aria-invalid="true"]').focus(); return; }
    var btn = form.querySelector('button[type="submit"]'), name = $('name').value.trim();
    btn.disabled = true; btn.textContent = 'Sending...'; status.textContent = '';
    setTimeout(function () {
      status.textContent = 'Thanks, ' + name + '! Your message is ready to send.'; status.classList.add('success');
      form.reset(); counter.textContent = '0 / 500'; btn.disabled = false; btn.textContent = 'Send message';
    }, 900);
  });

  /* ---------- Location chip opens the place in Maps ---------- */
  var locLink = $('locLink'), locText = $('locText');
  if (locLink && locText) locLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(locText.textContent.trim());

  $('year').textContent = new Date().getFullYear();
})();
