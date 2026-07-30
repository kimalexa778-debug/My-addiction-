/* ============================================================
   NUIT MAGIQUE — script.js
   Aucune bibliothèque externe. Tout est fait main. 🖤
   ============================================================ */

(() => {
  'use strict';

  /* ------------------------------------------------------------
     0. CONFIGURATION
     Change le mot de passe ici si besoin.
  ------------------------------------------------------------ */
  const PASSWORD = 'eclipse';

  const LETTER_TEXT =
`Salut toi... 🌙

Avant de commencer...

🐈 Les chats m'ont demandé de vérifier une dernière chose.

Tu souris ?

Parce que sinon ils refusent que tu continues.

...

Bon.

Ils disent que c'est bon.

Bienvenue dans l'endroit où j'ai caché quelques morceaux de mon cœur.

Tu sais...

Il existe des personnes qui arrivent doucement.

Puis il y a toi.

Tu es arrivé...

Et tu as complètement changé la décoration.

Maintenant il y a des rires partout.

C'est un peu le bazar...

Mais j'aime bien.

Tu as ce talent étrange de rendre mes journées plus légères.

Même quand tu ne fais rien.

C'est presque de la sorcellerie.

Ou alors les chats travaillent secrètement pour toi.

🐈‍⬛

En tout cas...

Merci d'avoir existé dans mon histoire.

Et si un jour tu oublies à quel point tu peux être précieux...

Reviens ici.

Cette lettre te le rappellera.

Maintenant...

Arrête de lire deux secondes.

Respire.

Et souris un peu.

Oui oui...

Je te vois.

🖤
Mon Éclipse`;

  /* ------------------------------------------------------------
     1. UTILITAIRES
  ------------------------------------------------------------ */
  const $  = (sel) => document.querySelector(sel);
  const rand = (min, max) => Math.random() * (max - min) + min;

  function switchScreen(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (from) from.classList.remove('active');
    if (to) to.classList.add('active');
  }

  /* ------------------------------------------------------------
     2. CIEL ÉTOILÉ — canvas animé
  ------------------------------------------------------------ */
  const SkySystem = (() => {
    const canvas = $('#sky-canvas');
    if (!canvas) {
      // Filet de sécurité : si le canvas est introuvable, on ne bloque pas le reste du site
      console.warn('sky-canvas introuvable — le ciel animé est désactivé.');
      return { init(){}, burst(){}, shootMany(){} };
    }
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let stars = [];
    let shootingStars = [];
    let burstParticles = [];
    let t = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildStars();
    }

    function buildStars() {
      const count = Math.floor((W * H) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: rand(0.5, 1.8),
        base: rand(0.35, 1),
        speed: rand(0.6, 2.2),
        phase: rand(0, Math.PI * 2),
        hue: Math.random() < 0.15 ? 'violet' : 'white'
      }));
    }

    function spawnShootingStar() {
      const fromLeft = Math.random() < 0.5;
      shootingStars.push({
        x: fromLeft ? rand(0, W * 0.4) : rand(W * 0.6, W),
        y: rand(0, H * 0.35),
        angle: fromLeft ? rand(0.35, 0.55) : Math.PI - rand(0.35, 0.55),
        speed: rand(9, 14),
        len: rand(80, 140),
        life: 0,
        maxLife: rand(35, 55)
      });
    }

    function spawnBurst(x, y) {
      const n = 10;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + rand(-0.2, 0.2);
        const speed = rand(1, 3.2);
        burstParticles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: rand(30, 50),
          size: rand(1.5, 3.2),
          violet: Math.random() < 0.5
        });
      }
    }

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      // Étoiles scintillantes
      for (const s of stars) {
        const alpha = s.base * (0.55 + 0.45 * Math.sin(t * 0.02 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue === 'violet'
          ? `rgba(196,181,253,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // Étoiles filantes
      shootingStars = shootingStars.filter((sh) => sh.life < sh.maxLife);
      for (const sh of shootingStars) {
        sh.life++;
        const progress = sh.life / sh.maxLife;
        const x = sh.x + Math.cos(sh.angle) * sh.speed * sh.life;
        const y = sh.y + Math.sin(sh.angle) * sh.speed * sh.life;
        const tailX = x - Math.cos(sh.angle) * sh.len;
        const tailY = y - Math.sin(sh.angle) * sh.len;
        const alpha = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;

        const grad = ctx.createLinearGradient(x, y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, 'rgba(196,181,253,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // Particules de clic
      burstParticles = burstParticles.filter((p) => p.life < p.maxLife);
      for (const p of burstParticles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.violet
          ? `rgba(167,139,250,${alpha})`
          : `rgba(245,243,255,${alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    function init() {
      resize();
      window.addEventListener('resize', debounce(resize, 200));
      draw();
      scheduleShootingStar();
    }

    function scheduleShootingStar() {
      spawnShootingStar();
      setTimeout(scheduleShootingStar, rand(4000, 9500));
    }

    function debounce(fn, ms) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
      };
    }

    return {
      init,
      burst: spawnBurst,
      shootMany: (n = 3) => { for (let i = 0; i < n; i++) setTimeout(spawnShootingStar, i * 180); }
    };
  })();

  /* ------------------------------------------------------------
     3. CŒURS FLOTTANTS EN ARRIÈRE-PLAN
  ------------------------------------------------------------ */
  const HeartsSystem = (() => {
    const container = $('#floating-hearts');
    const symbols = ['🤍', '💜', '✨', '🖤'];

    function spawn() {
      const el = document.createElement('span');
      el.className = 'floating-heart';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const size = rand(14, 26);
      el.style.left = rand(2, 96) + 'vw';
      el.style.fontSize = size + 'px';
      el.style.setProperty('--drift', rand(-60, 60) + 'px');
      el.style.animationDuration = rand(9, 16) + 's';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }

    function init() {
      for (let i = 0; i < 6; i++) setTimeout(spawn, i * 900);
      setInterval(spawn, 2600);
    }

    return { init };
  })();

  /* ------------------------------------------------------------
     4. MUSIQUE — boîte à musique synthétisée (Web Audio API)
  ------------------------------------------------------------ */
  const MusicBox = (() => {
    let ctx = null;
    let masterGain = null;
    let playing = false;
    let nextNoteTime = 0;
    let schedulerId = null;
    let noteIndex = 0;

    // Petite mélodie douce façon boîte à musique (notes en Hz)
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 783.99, 987.77, 783.99,
      523.25, 659.25, 783.99, 987.77,
      880.00, 783.99, 659.25, 523.25
    ];

    function ensureContext() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.18;
        masterGain.connect(ctx.destination);
      }
    }

    function playNote(freq, time) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Enveloppe façon "pluck" de boîte à musique
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.5, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);

      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(freq * 2, time);
      shimmerGain.gain.setValueAtTime(0.0001, time);
      shimmerGain.gain.exponentialRampToValueAtTime(0.12, time + 0.01);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);

      osc.connect(gain).connect(masterGain);
      shimmer.connect(shimmerGain).connect(masterGain);

      osc.start(time);
      shimmer.start(time);
      osc.stop(time + 1.2);
      shimmer.stop(time + 0.7);
    }

    function scheduler() {
      while (nextNoteTime < ctx.currentTime + 0.4) {
        playNote(melody[noteIndex % melody.length], nextNoteTime);
        nextNoteTime += 0.48;
        noteIndex++;
      }
      schedulerId = setTimeout(scheduler, 100);
    }

    function toggle() {
      ensureContext();
      if (ctx.state === 'suspended') ctx.resume();

      playing = !playing;
      if (playing) {
        nextNoteTime = ctx.currentTime + 0.1;
        scheduler();
      } else {
        clearTimeout(schedulerId);
      }
      return playing;
    }

    return { toggle };
  })();

  /* ------------------------------------------------------------
     5. ÉCRAN MOT DE PASSE
  ------------------------------------------------------------ */
  function initPasswordScreen() {
    const input = $('#password-input');
    const submitBtn = $('#password-submit');
    const errorEl = $('#password-error');
    const eyeBtn = $('#password-toggle-visibility');

    function tryUnlock() {
      const value = input.value.trim().toLowerCase();
      if (value === PASSWORD) {
        errorEl.textContent = '';
        switchScreen('screen-password', 'screen-envelope');
      } else {
        errorEl.textContent = 'Ce n\'est pas encore ça... essaie encore 🖤';
        input.classList.remove('shake');
        void input.offsetWidth; // relance l'animation
        input.classList.add('shake');
      }
    }

    submitBtn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });
    eyeBtn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      eyeBtn.textContent = isPassword ? '🙈' : '👁';
    });
  }

  /* ------------------------------------------------------------
     6. ÉCRAN ENVELOPPE
  ------------------------------------------------------------ */
  function initEnvelopeScreen() {
    const envelope = $('#envelope');
    const hint = $('#envelope-hint');
    let opened = false;

    envelope.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      hint.style.opacity = '0';
      envelope.classList.add('opened');

      // La lettre sort progressivement, puis on change d'écran
      setTimeout(() => {
        envelope.classList.add('flying');
      }, 900);

      setTimeout(() => {
        switchScreen('screen-envelope', 'screen-cats');
        startCatsScene();
      }, 1900);
    });
  }

  /* ------------------------------------------------------------
     7. ÉCRAN DES CHATS
  ------------------------------------------------------------ */
  let catsSceneStarted = false;

  function startCatsScene() {
    if (catsSceneStarted) return;
    catsSceneStarted = true;

    const catBlack = $('#cat-black');
    const catWhite = $('#cat-white');
    const hint = $('#cats-hint');

    catBlack.classList.add('running');
    catWhite.classList.add('running');

    // Double rAF pour garantir que la transition CSS se déclenche bien
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        catBlack.classList.add('meet');
        catWhite.classList.add('meet');
      });
    });

    catBlack.addEventListener('transitionend', function onMeet(e) {
      if (e.propertyName !== 'left') return;
      catBlack.removeEventListener('transitionend', onMeet);

      catBlack.classList.remove('running');
      catWhite.classList.remove('running');
      catBlack.classList.add('hugging');
      catWhite.classList.add('hugging');
      hint.style.opacity = '0';

      spawnHugFX();

      setTimeout(() => {
        switchScreen('screen-cats', 'screen-letter');
        startLetterScene();
      }, 3200);
    }, { once: true });
  }

  function spawnHugFX() {
    const fx = $('#hug-fx');
    const centerX = 50, centerY = 44; // en % de la scène

    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('span');
      heart.className = 'fx-heart';
      heart.textContent = Math.random() < 0.5 ? '💜' : '🤍';
      heart.style.left = centerX + rand(-8, 8) + '%';
      heart.style.top = centerY + rand(-4, 4) + '%';
      heart.style.setProperty('--hx', rand(-60, 60) + 'px');
      heart.style.setProperty('--hy', rand(-110, -60) + 'px');
      heart.style.setProperty('--hr', rand(-35, 35) + 'deg');
      heart.style.animationDelay = rand(0, 0.5) + 's';
      fx.appendChild(heart);
      setTimeout(() => heart.remove(), 2200);
    }

    for (let i = 0; i < 14; i++) {
      const spark = document.createElement('span');
      spark.className = 'fx-spark';
      spark.style.left = centerX + rand(-10, 10) + '%';
      spark.style.top = centerY + rand(-6, 6) + '%';
      spark.style.setProperty('--sx', rand(-50, 50) + 'px');
      spark.style.setProperty('--sy', rand(-50, 50) + 'px');
      spark.style.animationDelay = rand(0, 0.4) + 's';
      fx.appendChild(spark);
      setTimeout(() => spark.remove(), 1500);
    }
  }

  /* ---- Easter eggs : clic sur les chats ---- */
  const CAT_MESSAGES = [
    'Miaou~ 🐾',
    'Tu nous as trouvés !',
    'Il fait doux par ici ✨',
    'Secret de chat : on t\'aime bien',
    'Ronron approuvé',
    'Psst... continue de sourire'
  ];

  function initCatEasterEggs() {
    const pairs = [
      ['#cat-black', '#bubble-black'],
      ['#cat-white', '#bubble-white']
    ];
    pairs.forEach(([catSel, bubbleSel]) => {
      const cat = $(catSel);
      const bubble = $(bubbleSel);
      cat.addEventListener('click', (e) => {
        e.stopPropagation();
        const msg = CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)];
        bubble.textContent = msg;
        bubble.classList.add('show');
        cat.classList.remove('hugging');
        void cat.offsetWidth;
        cat.classList.add('hugging');
        clearTimeout(cat._bubbleTimer);
        cat._bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1800);
      });
    });
  }

  /* ------------------------------------------------------------
     8. ÉCRAN DE LA LETTRE — effet machine à écrire naturel
  ------------------------------------------------------------ */
  let letterStarted = false;

  function startLetterScene() {
    if (letterStarted) return;
    letterStarted = true;

    const el = $('#letter-text');
    const cursor = $('#tw-cursor');
    const replayBtn = $('#letter-replay');

    typeWriter(LETTER_TEXT, el, () => {
      cursor.classList.add('hidden');
      replayBtn.classList.remove('hidden');
    });

    replayBtn.addEventListener('click', () => {
      replayBtn.classList.add('hidden');
      cursor.classList.remove('hidden');
      el.textContent = '';
      typeWriter(LETTER_TEXT, el, () => {
        cursor.classList.add('hidden');
        replayBtn.classList.remove('hidden');
      });
    });
  }

  function typeWriter(text, el, onDone) {
    let i = 0;

    function step() {
      if (i >= text.length) {
        onDone && onDone();
        return;
      }
      const char = text[i];
      el.textContent += char;
      i++;

      let delay = rand(28, 55);
      if (char === ',') delay = 260;
      else if (char === '.' || char === '…') delay = 480;
      else if (char === '!' || char === '?') delay = 420;
      else if (char === '\n') delay = 380;

      setTimeout(step, delay);
    }
    step();
  }

  /* ------------------------------------------------------------
     9. LUNE — halo réactif + easter egg
  ------------------------------------------------------------ */
  const MOON_MESSAGES = [
    '🌙 tu m\'as trouvée',
    'chuuut... fais un vœu',
    'les étoiles sourient',
    'reste encore un peu par ici',
    '✨ un secret pour toi'
  ];

  function initMoon() {
    const moon = $('#moon');
    const msg = $('#moon-message');

    moon.addEventListener('click', () => {
      moon.classList.remove('clicked');
      void moon.offsetWidth;
      moon.classList.add('clicked');

      msg.textContent = MOON_MESSAGES[Math.floor(Math.random() * MOON_MESSAGES.length)];
      msg.classList.add('show');
      clearTimeout(moon._msgTimer);
      moon._msgTimer = setTimeout(() => msg.classList.remove('show'), 2000);

      SkySystem.shootMany(3);
    });
  }

  /* ------------------------------------------------------------
     10. BOUTON MUSIQUE
  ------------------------------------------------------------ */
  function initMusicButton() {
    const btn = $('#music-toggle');
    btn.addEventListener('click', () => {
      const isPlaying = MusicBox.toggle();
      btn.classList.toggle('playing', isPlaying);
      btn.setAttribute('aria-label', isPlaying ? 'Couper la musique' : 'Activer la musique');
    });
  }

  /* ------------------------------------------------------------
     11. CLIC SUR LE CIEL — particules réactives
  ------------------------------------------------------------ */
  function initSkyClickReaction() {
    const interactiveSelectors = 'button, input, .glass-card, .envelope, .cat, .letter-paper, .music-btn, .moon-wrap';
    document.addEventListener('click', (e) => {
      if (e.target.closest(interactiveSelectors)) return;
      SkySystem.burst(e.clientX, e.clientY);
    });
  }

  /* ------------------------------------------------------------
     12. INITIALISATION GÉNÉRALE
  ------------------------------------------------------------ */
  function safeRun(fn, label) {
    try {
      fn();
    } catch (err) {
      // Une seule fonction en panne ne doit jamais bloquer tout le site
      console.error('Erreur dans ' + label + ' :', err);
    }
  }

  function init() {
    // On affiche l'écran du mot de passe en tout premier,
    // avant même le reste, pour être sûr qu'il soit visible.
    safeRun(() => document.getElementById('screen-password').classList.add('active'), 'écran mot de passe');

    safeRun(() => initPasswordScreen(), 'initPasswordScreen');
    safeRun(() => initEnvelopeScreen(), 'initEnvelopeScreen');
    safeRun(() => initCatEasterEggs(), 'initCatEasterEggs');
    safeRun(() => initMoon(), 'initMoon');
    safeRun(() => initMusicButton(), 'initMusicButton');
    safeRun(() => initSkyClickReaction(), 'initSkyClickReaction');
    safeRun(() => SkySystem.init(), 'SkySystem');
    safeRun(() => HeartsSystem.init(), 'HeartsSystem');
  }

  // Si le script se charge après que le DOM soit déjà prêt (cas rare avec
  // certains hébergeurs / caches), on lance quand même l'initialisation.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
