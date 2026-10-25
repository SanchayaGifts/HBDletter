/**
 * AESTHETIC BIRTHDAY LOVE LETTER WEBSITE - INTERACTIVE CONTROLLER
 * Vanilla JavaScript implementation for the complete romantic experience:
 * - Ambient Canvas Particle System (floating hearts & twinkling stardust)
 * - 3D Envelope Opening & Realistic Paper Unfolding
 * - Staggered Handwritten Letter Reveal with Skip Animation
 * - Continuous Background Music with graceful Web Audio fallback
 * - Final Heart Surprise & Seamless Return
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. STATE MANAGEMENT & DOM ELEMENTS
  // ========================================================
  const state = {
    isOpening: false,
    isUnfolded: false,
    isRevealing: false,
    musicPlaying: false,
    usingWebAudioSynth: false,
    currentScene: 'envelope', // 'envelope' | 'unfolding' | 'letter' | 'surprise'
    animationTimers: []
  };

  // DOM Elements
  const canvas = document.getElementById('ambient-canvas');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicStatusText = document.getElementById('music-status-text');
  const skipBtn = document.getElementById('skip-btn');
  const toastEl = document.getElementById('toast');

  // Scenes
  const envelopeScene = document.getElementById('envelope-scene');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const letterInsert = document.getElementById('letter-insert');
  const waxSeal = document.getElementById('wax-seal');

  const letterScene = document.getElementById('letter-scene');
  const unfoldingStage = document.getElementById('unfolding-stage');
  const stationeryPaper = document.getElementById('stationery-paper');
  const revealItems = document.querySelectorAll('.reveal-item');
  const openSurpriseBtn = document.getElementById('open-surprise-btn');

  // Surprise Modal
  const surpriseModal = document.getElementById('surprise-modal');
  const surpriseBackdrop = document.getElementById('surprise-backdrop');
  const readAgainBtn = document.getElementById('read-again-btn');

  // ========================================================
  // 2. TOAST NOTIFICATION UTILITY
  // ========================================================
  let toastTimeout = null;
  function showToast(message, duration = 3500) {
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
      this.hue = Math.random() > 0.6 ? 345 : 355; // romantic pinks and deep roses
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
        // Draw delicate heart shape
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
        // Draw sparkling stardust particle
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

  function spawnBurstHearts(sourceX, sourceY, count = 18) {
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.x = sourceX + (Math.random() - 0.5) * 80;
      p.y = sourceY + (Math.random() - 0.5) * 40;
      p.speedY = 1.2 + Math.random() * 2.2;
      p.speedX = (Math.random() - 0.5) * 2.5;
      p.opacity = 0.85;
      p.isHeart = true;
      particles.push(p);
      if (particles.length > maxParticles + 30) {
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
  // 4. ROMANTIC MUSIC CONTROLLER (AUDIO + WEB AUDIO FALLBACK)
  // ========================================================
  let audioCtx = null;
  let synthInterval = null;

  // Synthesize romantic acoustic music-box chimes if MP3 is missing
  function startRomanticSynth() {
    if (state.usingWebAudioSynth) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      state.usingWebAudioSynth = true;

      // Romantic chord notes (F# minor, D major, A major, E major chord arpeggios)
      const romanticScale = [
        261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99
      ];

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

      // Gentle recurring romantic arpeggios
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
      showToast('Playing gentle romantic melody 🎵');
    } catch (err) {
      console.warn('Web Audio Synth failed:', err);
    }
  }

  function stopRomanticSynth() {
    state.usingWebAudioSynth = false;
    if (synthInterval) clearInterval(synthInterval);
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

  function updateMusicUI(isPlaying) {
    state.musicPlaying = isPlaying;
    if (isPlaying) {
      musicBtn.classList.add('playing');
      musicStatusText.textContent = 'Music On';
    } else {
      musicBtn.classList.remove('playing');
      musicStatusText.textContent = 'Music Off';
    }
  }

  async function playMusic() {
    if (state.musicPlaying) return;

    if (bgMusic) {
      bgMusic.volume = 0.55;
      try {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          await playPromise;
          updateMusicUI(true);
        }
      } catch (err) {
        console.info('Audio element playback prevented or file missing:', err.message);
        // Fallback to pleasant synthesized romantic chime music
        updateMusicUI(true);
        startRomanticSynth();
      }
    } else {
      updateMusicUI(true);
      startRomanticSynth();
    }
  }

  function pauseMusic() {
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
    }
    stopRomanticSynth();
    updateMusicUI(false);
  }

  function toggleMusic() {
    if (state.musicPlaying) {
      pauseMusic();
      showToast('Music paused ⏸️');
    } else {
      playMusic();
      showToast('Music playing 🎵');
    }
  }

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  // Handle missing audio gracefully without breaking website
  if (bgMusic) {
    bgMusic.addEventListener('error', () => {
      console.info('Note: love-song.mp3 could not be loaded directly. Switching to romantic ambient music system.');
      if (state.musicPlaying) {
        startRomanticSynth();
      }
    });
  }

  // ========================================================
  // 5. ENVELOPE OPENING & LETTER EMERGENCE ANIMATION
  // ========================================================
  function openEnvelope() {
    if (state.isOpening) return;
    state.isOpening = true;
    state.currentScene = 'unfolding';

    // 1. Start music immediately on tap
    playMusic();

    // 2. Burst decorative hearts from envelope position
    const rect = envelopeWrapper.getBoundingClientRect();
    spawnBurstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);

    // 3. Show skip button for user convenience
    skipBtn.classList.remove('hidden');

    // 4. Phase 1: Open the flap backward smoothly in 3D
    envelope.classList.add('opening', 'flap-open');

    // 5. Phase 2: ONLY after flap has fully opened (750ms), slide the letter upward out of pocket
    const tLetter = setTimeout(() => {
      envelope.classList.add('letter-out');
    }, 750);
    state.animationTimers.push(tLetter);

    // 6. Phase 3: Transition to full stationery paper unfolding once letter has emerged
    const tTransition = setTimeout(() => {
      envelopeScene.style.opacity = '0';
      envelopeScene.style.transform = 'scale(0.92) translateY(30px)';

      const tUnfold = setTimeout(() => {
        envelopeScene.classList.add('hidden');
        letterScene.classList.remove('hidden');
        startLetterUnfolding();
      }, 600);
      state.animationTimers.push(tUnfold);
    }, 2100);
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
  // 6. 3D LETTER UNFOLDING SIMULATION & TEXT REVEAL
  // ========================================================
  function startLetterUnfolding() {
    // Show 3D folding paper simulation
    unfoldingStage.classList.add('active');

    const t1 = setTimeout(() => {
      unfoldingStage.classList.add('unfolded');

      // Unfold complete: Reveal actual stationary sheet
      const t2 = setTimeout(() => {
        unfoldingStage.style.opacity = '0';
        stationeryPaper.classList.add('visible');

        const t3 = setTimeout(() => {
          unfoldingStage.classList.remove('active');
          state.isUnfolded = true;
          revealLetterContent();
        }, 500);
        state.animationTimers.push(t3);
      }, 900);
      state.animationTimers.push(t2);
    }, 100);

    state.animationTimers.push(t1);
  }

  function revealLetterContent() {
    state.isRevealing = true;
    let delay = 350;

    revealItems.forEach((item, index) => {
      // Stagger each item gently
      const timer = setTimeout(() => {
        item.classList.add('revealed');

        // When the last item (teaser) is reached
        if (index === revealItems.length - 1) {
          state.isRevealing = false;
          // Hide skip button once completely revealed
          skipBtn.classList.add('hidden');
        }
      }, delay);

      state.animationTimers.push(timer);
      delay += 520; // Natural, romantic cadence
    });
  }

  // ========================================================
  // 7. SKIP ANIMATION FEATURE
  // ========================================================
  function skipAnimation() {
    // Clear all pending transition timeouts
    state.animationTimers.forEach(t => clearTimeout(t));
    state.animationTimers = [];

    // Immediately hide envelope and unfolding stage
    envelopeScene.classList.add('hidden');
    unfoldingStage.classList.remove('active');
    unfoldingStage.style.opacity = '0';

    // Show letter scene and stationery sheet
    letterScene.classList.remove('hidden');
    letterScene.style.opacity = '1';
    stationeryPaper.classList.add('visible');

    // Instantly reveal all text paragraphs and items
    revealItems.forEach(item => {
      item.classList.add('revealed');
    });

    state.isOpening = true;
    state.isUnfolded = true;
    state.isRevealing = false;
    skipBtn.classList.add('hidden');

    showToast('Letter unfolded ♡');
  }

  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    skipAnimation();
  });

  // ========================================================
  // 8. FINAL HEART SURPRISE MODAL ❤️
  // ========================================================
  function openSurpriseModal() {
    state.currentScene = 'surprise';
    surpriseModal.classList.remove('hidden');

    // Trigger backdrop and heart animation
    requestAnimationFrame(() => {
      surpriseModal.classList.add('active');
    });

    // Burst stardust and hearts
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

  openSurpriseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSurpriseModal();
  });

  readAgainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSurpriseModal();
    // Smoothly scroll to letter top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  surpriseBackdrop.addEventListener('click', closeSurpriseModal);

  // Keyboard accessibility (Escape key closes surprise modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.currentScene === 'surprise') {
      closeSurpriseModal();
    }
  });
});
