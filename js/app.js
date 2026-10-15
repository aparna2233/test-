/* ==========================================================================
   HACKFORGE ACADEMY - MAIN APPLICATION CONTROLLER
   State Management, Progress Persistence, UI Transitions, Confetti & Canvas
   ========================================================================== */

class HackAcademyApp {
  constructor() {
    this.storageKey = 'hackforge_student_state_v1';
    this.state = this.loadState();
    
    this.levelThresholds = [
      { name: 'Cadet Trainee', minXP: 0, maxXP: 200, badge: 'LVL 1' },
      { name: 'Apprentice Scout', minXP: 200, maxXP: 500, badge: 'LVL 2' },
      { name: 'Cyber Specialist', minXP: 500, maxXP: 850, badge: 'LVL 3' },
      { name: 'Penetration Tester', minXP: 850, maxXP: 1300, badge: 'LVL 4' },
      { name: 'Elite Cyber Sentinel', minXP: 1300, maxXP: 2000, badge: 'LVL 5' }
    ];

    this.init();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }

    return {
      studentName: 'Alex Mercer',
      xp: 0,
      signedOath: false,
      solvedFlags: [],
      completedModules: [],
      passedQuizzes: {}
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  init() {
    this.updateStatsUI();
    this.setupNavigation();
    this.setupEthicalOath();
    this.setupSoundButton();
    this.setupParticlesCanvas();
    this.setupConfettiCanvas();
    this.setupCertificateActions();
  }

  // Add XP and trigger animations / level-up check
  addXP(amount, reason = '') {
    const prevLevel = this.getCurrentLevel();
    this.state.xp += amount;
    this.saveState();
    this.updateStatsUI();

    const newLevel = this.getCurrentLevel();

    if (newLevel.name !== prevLevel.name) {
      window.cyberAudio.playLevelUpSound();
      this.showToast(`🎉 LEVEL UP! You reached ${newLevel.badge}: ${newLevel.name}!`, 'success');
      this.triggerConfetti();
    } else {
      window.cyberAudio.playExecuteSound();
      this.showToast(`+${amount} XP: ${reason}`, 'success');
    }
  }

  getCurrentLevel() {
    for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
      if (this.state.xp >= this.levelThresholds[i].minXP) {
        return this.levelThresholds[i];
      }
    }
    return this.levelThresholds[0];
  }

  updateStatsUI() {
    const level = this.getCurrentLevel();
    
    // Nav bar elements
    const xpLevelBadge = document.getElementById('nav-user-level');
    const xpFill = document.getElementById('nav-xp-fill');
    const xpText = document.getElementById('nav-xp-text');
    const heroFlagCount = document.getElementById('stat-flags-count');
    const heroXpCount = document.getElementById('stat-total-xp');
    const heroRankTitle = document.getElementById('stat-rank-title');
    const certRecipient = document.getElementById('cert-student-name');
    const certXP = document.getElementById('cert-display-xp');
    const certRank = document.getElementById('cert-display-rank');

    if (xpLevelBadge) xpLevelBadge.textContent = level.badge;
    
    // XP progress percentage inside current level bracket
    const currentBracket = level.maxXP - level.minXP;
    const progressInBracket = Math.min(Math.max(this.state.xp - level.minXP, 0), currentBracket);
    const pct = Math.round((progressInBracket / currentBracket) * 100);

    if (xpFill) xpFill.style.width = `${pct}%`;
    if (xpText) xpText.textContent = `${this.state.xp} XP`;
    if (heroXpCount) heroXpCount.textContent = `${this.state.xp}`;
    if (heroRankTitle) heroRankTitle.textContent = level.name;
    if (heroFlagCount) heroFlagCount.textContent = `${this.state.solvedFlags.length}/6`;

    if (certRecipient) certRecipient.textContent = this.state.studentName;
    if (certXP) certXP.textContent = `${this.state.xp} XP`;
    if (certRank) certRank.textContent = `${level.badge} • ${level.name}`;
  }

  // Setup Oath Interaction
  setupEthicalOath() {
    const oathBanner = document.getElementById('oath-banner');
    const signBtn = document.getElementById('sign-oath-btn');
    if (!oathBanner || !signBtn) return;

    if (this.state.signedOath) {
      oathBanner.classList.add('signed');
      signBtn.textContent = 'Ethical Oath Verified ✓';
      signBtn.disabled = true;
      signBtn.classList.replace('btn-primary', 'btn-outline-green');
    }

    signBtn.addEventListener('click', () => {
      if (this.state.signedOath) return;
      this.state.signedOath = true;
      this.saveState();
      oathBanner.classList.add('signed');
      signBtn.textContent = 'Ethical Oath Verified ✓';
      signBtn.disabled = true;
      signBtn.classList.replace('btn-primary', 'btn-outline-green');
      window.cyberAudio.playSuccessSound();
      this.addXP(50, 'Ethical Hacking Oath Pledged');
      this.showToast('⚖️ You took the Ethical Hacker Pledge. Authorized testing only!', 'success');
    });
  }

  // Sound toggle button in navigation
  setupSoundButton() {
    const soundBtn = document.getElementById('sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      const isEnabled = window.cyberAudio.toggleSound();
      soundBtn.classList.toggle('active', isEnabled);
      soundBtn.innerHTML = isEnabled 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      this.showToast(isEnabled ? 'Cyber Audio: ENABLED' : 'Cyber Audio: MUTED');
    });
  }

  // Smooth Section Navigation & Tab switching
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-target');
        if (!targetId) return;
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const targetElem = document.getElementById(targetId);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Sub-tab controllers inside Interactive Labs
    const labTabs = document.querySelectorAll('.lab-tab-pill');
    labTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const labId = tab.getAttribute('data-lab');
        labTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.lab-pane').forEach(pane => {
          pane.style.display = 'none';
        });

        const activePane = document.getElementById(`lab-pane-${labId}`);
        if (activePane) {
          activePane.style.display = 'block';
        }
        window.cyberAudio.playKeyClick();
      });
    });
  }

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '⚡' : '🛡️'}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Certificate customization and print
  setupCertificateActions() {
    const nameInput = document.getElementById('cert-name-input');
    const updateBtn = document.getElementById('update-name-btn');
    const printBtn = document.getElementById('print-cert-btn');
    const certHash = document.getElementById('cert-verification-hash');

    // Generate pseudo-verification SHA-like hash
    if (certHash) {
      certHash.textContent = 'HF-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    if (updateBtn && nameInput) {
      nameInput.value = this.state.studentName;
      updateBtn.addEventListener('click', () => {
        const val = nameInput.value.trim();
        if (val) {
          this.state.studentName = val;
          this.saveState();
          this.updateStatsUI();
          this.showToast(`Certificate recipient updated to ${val}`, 'success');
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Reset progress button
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all course XP and CTF progress back to zero?")) {
          localStorage.removeItem(this.storageKey);
          location.reload();
        }
      });
    }
  }

  // Subtle interactive particle canvas for cyber ambiance
  setupParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 245, 212, ' : 'rgba(139, 92, 246, '
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle particle nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color + '0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(render);
    }
    render();
  }

  // Celebration Confetti
  setupConfettiCanvas() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
  }

  triggerConfetti() {
    if (!this.confettiCanvas) return;
    const ctx = this.confettiCanvas.getContext('2d');
    const width = this.confettiCanvas.width = window.innerWidth;
    const height = this.confettiCanvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#00f5d4', '#10b981', '#38bdf8', '#f59e0b', '#8b5cf6'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      pieces.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // gravity
          p.rotation += p.vr;
          p.life -= 0.015;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    animate();
  }
}

// Global App Instance
document.addEventListener('DOMContentLoaded', () => {
  window.hackApp = new HackAcademyApp();
});
