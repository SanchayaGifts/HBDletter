/**
 * ============================================================================
 * AESTHETIC BIRTHDAY LOVE LETTER WEBSITE - INTERACTIVE CONTROLLER
 * ============================================================================
 * Features:
 * - Ambient Canvas Particle System (floating hearts & twinkling stardust)
 * - 3D Realistic Romantic Envelope Opening with Smooth Letter Elevation
 * - Character-by-Character Typewriter Effect with Configurable Speed
 * - Seamless Continuous Background Music (with Web Audio Synth Fallback)
 * - Interactive Beating Heart Surprise Modal & Smooth Navigation
 * ============================================================================
 */

// ============================================================================
// 💌 CONFIGURATION: SPEED & AUDIO SETTINGS
// You can easily adjust typing speed and pauses here!
// ============================================================================
const TYPING_CONFIG = {
  // Speed in milliseconds per character
  // Lower number = faster typing | Higher number = slower typing
  // Recommended options:
  //   15 = Very Fast
  //   28 = Natural & Smooth (Default)
  //   45 = Emotional & Gentle Pace
  speed: 28,

  // Pause duration (in ms) between paragraphs
  pauseBetweenParagraphs: 240,

  // Pause duration (in ms) after greeting before birthday title
  pauseAfterGreeting: 200,

  // Pause duration (in ms) after title before first paragraph
  pauseAfterHeading: 280,

  // Pause duration (in ms) between signature lines
  pauseBetweenSignatures: 180,

  // Pause duration (in ms) before final surprise button appears
  pauseBeforeTeaser: 350,

  // Smoothly auto-scroll on mobile devices to follow active typing
  autoScroll: true,

  // Continuous background music volume (0.0 to 1.0)
  musicVolume: 0.55
};

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. STATE MANAGEMENT & DOM ELEMENTS
  // ========================================================
  const state = {
    isOpening: false,
    isLetterActive: false,
    isTyping: false,
    musicPlaying: false,
    usingWebAudioSynth: false,
    currentScene: 'envelope', // 'envelope' | 'letter' | 'surprise'
    animationTimers: [],
    typingTimeoutId: null
  };

  // DOM Elements
  const canvas = document.getElementById('ambient-canvas');
  const bgMusic = document.getElementById('bg-music');
  const skipBtn = document.getElementById('skip-btn');
  const toastEl = document.getElementById('toast');

  // Scenes
  const envelopeScene = document.getElementById('envelope-scene');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');

  const letterScene = document.getElementById('letter-scene');
  const stationeryPaper = document.getElementById('stationery-paper');
  const headingFlourish = document.getElementById('heading-flourish');
  const surpriseTeaser = document.getElementById('surprise-teaser');
  const openSurpriseBtn = document.getElementById('open-surprise-btn');

  // Surprise Modal
  const surpriseModal = document.getElementById('surprise-modal');
  const surpriseBackdrop = document.getElementById('surprise-backdrop');
  const readAgainBtn = document.getElementById('read-again-btn');

  // ========================================================
  // 2. TOAST NOTIFICATION UTILITY
  // ========================================================
  let toastTimeout = null;
  function showToast(message, duration = 3000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // ========================================================
  // 3. AMBIENT CANVAS: FLOATING HEARTS & STARDUST
  // ========================================================
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = window.innerWidth < 600 ? 32 : 55;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.isHeart = Math.random() > 0.45;
      this.size = this.isHeart ? 10 + Math.random() * 14 : 2 + Math.random() * 3.5;
      this.speedY = 0.4 + Math.random() * 0.9;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = 0.2 + Math.random() * 0.55;
      this.rotation = (Math.random() - 0.5) * 0.6;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.hue = Math.random() > 0.6 ? 345 : 355; // romantic rose hues
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.35;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        ctx.fillStyle = `hsl(${this.hue}, 85%, 72%)`;
        ctx.shadowColor = `hsl(${this.hue}, 90%, 65%)`;
        ctx.shadowBlur = 8;
        const s = this.size / 15;
        ctx.beginPath();
        ctx.moveTo(0, s * -3);
        ctx.bezierCurveTo(s * -7, s * -12, s * -15, s * -2, 0, s * 12);
        ctx.bezierCurveTo(s * 15, s * -2, s * 7, s * -12, 0, s * -3);
        ctx.fill();
      } else {
        ctx.fillStyle = Math.random() > 0.3 ? '#FFF4E6' : '#FADADD';
        ctx.shadowColor = '#E75480';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function spawnBurstHearts(sourceX, sourceY, count = 22) {
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.x = sourceX + (Math.random() - 0.5) * 80;
      p.y = sourceY + (Math.random() - 0.5) * 40;
      p.speedY = 1.2 + Math.random() * 2.2;
      p.speedX = (Math.random() - 0.5) * 2.5;
      p.opacity = 0.85;
      p.isHeart = true;
      particles.push(p);
      if (particles.length > maxParticles + 35) {
        particles.shift();
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ========================================================
  // 4. CONTINUOUS BACKGROUND MUSIC SYSTEM
  // ========================================================
  let audioCtx = null;
  let synthInterval = null;

  // Gentle acoustic music-box chimes synthesizer fallback
  function startRomanticSynth() {
    if (state.usingWebAudioSynth) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      state.usingWebAudioSynth = true;
      state.musicPlaying = true;

      function playChimeNote(freq, delay = 0, gainLevel = 0.12) {
        if (!audioCtx || !state.musicPlaying) return;
        const now = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.6);
      }

      const chordProgression = [
        [523.25, 659.25, 783.99],
        [440.00, 523.25, 659.25],
        [392.00, 493.88, 587.33],
        [349.23, 440.00, 523.25]
      ];

      let chordIndex = 0;
      function stepArpeggio() {
        if (!state.musicPlaying) return;
        const chord = chordProgression[chordIndex % chordProgression.length];
        playChimeNote(chord[0] / 2, 0, 0.08);
        playChimeNote(chord[0], 0.2, 0.1);
        playChimeNote(chord[1], 0.6, 0.09);
        playChimeNote(chord[2], 1.0, 0.11);
        playChimeNote(chord[1], 1.4, 0.08);
        chordIndex++;
      }

      stepArpeggio();
      synthInterval = setInterval(stepArpeggio, 2400);
    } catch (err) {
      console.warn('Web Audio Synth initialization error:', err);
    }
  }

  // Attempt playing background audio directly or on user interaction
  async function startBackgroundMusic() {
    if (state.musicPlaying) return;

    if (bgMusic) {
      bgMusic.volume = TYPING_CONFIG.musicVolume;
      try {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          await playPromise;
          state.musicPlaying = true;
          removeAutoplayListeners();
        }
      } catch (err) {
        // Autoplay policy prevented playback before interaction; listeners will catch first touch
      }
    } else {
      startRomanticSynth();
      removeAutoplayListeners();
    }
  }

  function onFirstUserGesture() {
    if (!state.musicPlaying) {
      if (bgMusic) {
        bgMusic.volume = TYPING_CONFIG.musicVolume;
        bgMusic.play().then(() => {
          state.musicPlaying = true;
          removeAutoplayListeners();
        }).catch(() => {
          startRomanticSynth();
          removeAutoplayListeners();
        });
      } else {
        startRomanticSynth();
        removeAutoplayListeners();
      }
    }
  }

  function addAutoplayListeners() {
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, onFirstUserGesture, { passive: true });
    });
  }

  function removeAutoplayListeners() {
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.removeEventListener(evt, onFirstUserGesture);
    });
  }

  // Try playing immediately, and register gesture listener for browsers with strict autoplay policies
  startBackgroundMusic();
  addAutoplayListeners();

  if (bgMusic) {
    bgMusic.addEventListener('error', () => {
      console.info('Audio source unavailable; using romantic ambient chime synthesizer.');
      startRomanticSynth();
    });
  }

  // ========================================================
  // 5. CACHING LETTER TEXT & INITIALIZING TYPEWRITER ITEMS
  // ========================================================
  const typingItems = [];

  function initTypingItems() {
    const greetingEl = document.querySelector('#letter-greeting .greeting-text');
    if (greetingEl) {
      typingItems.push({
        container: document.getElementById('greeting-item'),
        element: greetingEl,
        fullText: greetingEl.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseAfterGreeting
      });
    }

    const headingEl = document.querySelector('#letter-heading');
    if (headingEl) {
      typingItems.push({
        container: document.getElementById('heading-item'),
        element: headingEl,
        fullText: headingEl.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseAfterHeading,
        onComplete: () => {
          if (headingFlourish) headingFlourish.classList.add('visible');
        }
      });
    }

    const pEls = document.querySelectorAll('.letter-paragraphs .letter-p');
    pEls.forEach((p) => {
      typingItems.push({
        container: p,
        element: p,
        fullText: p.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseBetweenParagraphs
      });
    });

    const sign1 = document.querySelector('#sign-1 .letter-closing-highlight');
    if (sign1) {
      typingItems.push({
        container: document.getElementById('sign-1'),
        element: sign1,
        fullText: sign1.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseBetweenSignatures
      });
    }

    const sign2 = document.querySelector('#sign-2 .letter-closing-note');
    if (sign2) {
      typingItems.push({
        container: document.getElementById('sign-2'),
        element: sign2,
        fullText: sign2.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseBetweenSignatures
      });
    }

    const sign3 = document.querySelector('#sign-3 .letter-yours');
    if (sign3) {
      typingItems.push({
        container: document.getElementById('sign-3'),
        element: sign3,
        fullText: sign3.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseBetweenSignatures
      });
    }

    const sign4 = document.querySelector('#sign-4 #sender-signature-name');
    if (sign4) {
      typingItems.push({
        container: document.getElementById('sign-4'),
        element: sign4,
        fullText: sign4.textContent.trim(),
        pauseAfter: TYPING_CONFIG.pauseBeforeTeaser,
        onComplete: () => {
          finishTypingSequence();
        }
      });
    }
  }

  initTypingItems();

  // Typewriter Cursor Element
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  function startTypewriter() {
    state.isTyping = true;
    let currentItemIdx = 0;

    function typeNextItem() {
      if (!state.isTyping) return;

      if (currentItemIdx >= typingItems.length) {
        finishTypingSequence();
        return;
      }

      const item = typingItems[currentItemIdx];
      if (item.container) item.container.classList.add('revealed');

      const chars = Array.from(item.fullText);
      let charIdx = 0;

      // Clear element and attach text node with cursor
      item.element.textContent = '';
      const textNode = document.createTextNode('');
      item.element.appendChild(textNode);
      item.element.appendChild(cursor);

      function typeChar() {
        if (!state.isTyping) return;

        if (charIdx < chars.length) {
          textNode.nodeValue += chars[charIdx];
          charIdx++;

          // Smoothly auto-scroll on mobile devices to follow the active text
          if (TYPING_CONFIG.autoScroll && window.innerWidth <= 768) {
            const cursorRect = cursor.getBoundingClientRect();
            if (cursorRect.bottom > window.innerHeight - 70) {
              window.scrollBy({ top: cursorRect.bottom - (window.innerHeight - 80), behavior: 'smooth' });
            }
          }

          state.typingTimeoutId = setTimeout(typeChar, TYPING_CONFIG.speed);
        } else {
          // Complete current item
          if (item.onComplete) item.onComplete();

          currentItemIdx++;
          state.typingTimeoutId = setTimeout(typeNextItem, item.pauseAfter || 200);
        }
      }

      typeChar();
    }

    typeNextItem();
  }

  function finishTypingSequence() {
    state.isTyping = false;
    if (state.typingTimeoutId) clearTimeout(state.typingTimeoutId);
    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

    if (headingFlourish) headingFlourish.classList.add('visible');
    if (surpriseTeaser) surpriseTeaser.classList.add('revealed');
    if (skipBtn) skipBtn.classList.add('hidden');
  }

  // ========================================================
  // 6. ENVELOPE OPENING & SMOOTH STATIONERY ENTRANCE
  // ========================================================
  function openEnvelope() {
    if (state.isOpening) return;
    state.isOpening = true;
    state.currentScene = 'letter';

    // 1. Ensure background music is playing
    onFirstUserGesture();

    // 2. Burst decorative hearts from envelope position
    const rect = envelopeWrapper.getBoundingClientRect();
    spawnBurstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);

    // 3. Show skip button for user convenience during typing
    if (skipBtn) skipBtn.classList.remove('hidden');

    // 4. Phase 1: Open flap backward smoothly in 3D
    envelope.classList.add('opening', 'flap-open');

    // 5. Phase 2: Letter insert smoothly glides upward out of envelope
    const tLetter = setTimeout(() => {
      envelope.classList.add('letter-out');
      spawnBurstHearts(rect.left + rect.width / 2, rect.top + 30, 16);
    }, 650);
    state.animationTimers.push(tLetter);

    // 6. Phase 3: Transition to full stationery paper with floating elevation entrance
    const tTransition = setTimeout(() => {
      envelopeScene.classList.add('envelope-exit');

      const tShowPaper = setTimeout(() => {
        envelopeScene.classList.add('hidden');
        letterScene.classList.remove('hidden');

        // Trigger gorgeous paper entrance animation
        requestAnimationFrame(() => {
          stationeryPaper.classList.add('visible');
          state.isLetterActive = true;

          const pRect = stationeryPaper.getBoundingClientRect();
          spawnBurstHearts(pRect.left + pRect.width / 2, pRect.top + 80, 24);

          // Phase 4: Start character-by-character typing after paper settles
          const tTyping = setTimeout(() => {
            startTypewriter();
          }, 650);
          state.animationTimers.push(tTyping);
        });
      }, 500);
      state.animationTimers.push(tShowPaper);
    }, 1600);
    state.animationTimers.push(tTransition);
  }

  envelopeWrapper.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  // ========================================================
  // 7. SKIP ANIMATION FEATURE
  // ========================================================
  function skipAnimation() {
    state.isTyping = false;
    state.animationTimers.forEach((t) => clearTimeout(t));
    state.animationTimers = [];
    if (state.typingTimeoutId) clearTimeout(state.typingTimeoutId);

    // Immediately display letter scene and stationery sheet
    envelopeScene.classList.add('hidden');
    letterScene.classList.remove('hidden');
    stationeryPaper.classList.add('visible');

    // Instantly reveal all text and containers
    typingItems.forEach((item) => {
      if (item.container) item.container.classList.add('revealed');
      item.element.textContent = item.fullText;
    });

    finishTypingSequence();
    state.isOpening = true;
    state.isLetterActive = true;
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      skipAnimation();
    });
  }

  // ========================================================
  // 8. FINAL HEART SURPRISE MODAL ❤️
  // ========================================================
  function openSurpriseModal() {
    state.currentScene = 'surprise';
    surpriseModal.classList.remove('hidden');

    requestAnimationFrame(() => {
      surpriseModal.classList.add('active');
    });

    const rect = surpriseModal.getBoundingClientRect();
    spawnBurstHearts(rect.width / 2, rect.height / 2, 35);
  }

  function closeSurpriseModal() {
    surpriseModal.classList.remove('active');
    setTimeout(() => {
      surpriseModal.classList.add('hidden');
      state.currentScene = 'letter';
    }, 600);
  }

  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSurpriseModal();
    });
  }

  if (readAgainBtn) {
    readAgainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSurpriseModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (surpriseBackdrop) {
    surpriseBackdrop.addEventListener('click', closeSurpriseModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.currentScene === 'surprise') {
      closeSurpriseModal();
    }
  });
});
