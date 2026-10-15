/* ==========================================================================
   HACKFORGE ACADEMY - CAPTURE THE FLAG (CTF) ARENA
   Flag Validation, Challenges, Hint Revelations, Dynamic Scoreboard
   ========================================================================== */

class CtfArena {
  constructor() {
    this.challenges = [
      {
        id: 'ctf_recon',
        title: 'Recon Rookie: The Leaky Comment',
        category: 'Web Security / Recon',
        difficulty: 'Easy (★☆☆)',
        points: 100,
        flag: 'FLAG{inspect_element_dev_secret_892}',
        desc: 'Developers frequently leave confidential API tokens or comments in client-side HTML source files. Inspect the DOM elements of this academy or find the developer comment hidden near the footer!',
        hint: 'Use your browser DevTools (right-click -> Inspect) or search page HTML for comments containing "FLAG{".'
      },
      {
        id: 'ctf_sqli',
        title: 'Gatekeeper Bypass: SQL Injection',
        category: 'Database / Web Exploit',
        difficulty: 'Medium (★★☆)',
        points: 150,
        flag: 'FLAG{sqli_taut0l0gy_by_p4ss}',
        desc: 'Execute an authentication bypass in the SQL Injection Interactive Lab using tautological boolean logic to dump the admin table.',
        hint: 'Head over to the SQLi Lab. Inject `\' OR \'1\'=\'1\' --` into the username field and click Authenticate.'
      },
      {
        id: 'ctf_wireshark',
        title: 'Wire Tapper: Insecure Protocol Sniffing',
        category: 'Network Pentesting',
        difficulty: 'Medium (★★☆)',
        points: 150,
        flag: 'FLAG{wireshark_cleartext_ftp_exposed}',
        desc: 'An employee transmitted credentials across the internal subnet using legacy cleartext FTP. Locate the packet and extract the flag in the Packet Sniffer Lab.',
        hint: 'Open the Network Packet Sniffer lab, filter by "FTP", and click packet #5 to inspect the details view.'
      },
      {
        id: 'ctf_caesar',
        title: "The Emperor's Cipher: Cryptanalysis",
        category: 'Classical Cryptography',
        difficulty: 'Easy (★☆☆)',
        points: 100,
        flag: 'FLAG{caesar_rot_c1ph3r_cr4ck3d}',
        desc: 'We intercepted an ancient rot-3 message: `IODJ{fdhvdu_urs_f1sk3u_cr4ck3d}`. Decrypt it to reveal the plaintext flag.',
        hint: 'Go to the Cryptography Studio, paste the ciphertext into the Caesar Cipher tool, and set the shift to -3 (or 23).'
      },
      {
        id: 'ctf_terminal',
        title: 'Terminal Recon: The Hidden Vault',
        category: 'Host Penetration',
        difficulty: 'Hard (★★★)',
        points: 200,
        flag: 'FLAG{recon_terminal_master_404}',
        desc: 'Utilize the Kali Linux terminal to enumerate host 10.10.14.88, discover disallowed paths in `robots.txt`, and retrieve the hidden file.',
        hint: 'Run `curl http://10.10.14.88/robots.txt` in the terminal, then read the revealed path with `cat /admin_vault_backup_2024/flag.txt`.'
      },
      {
        id: 'ctf_hash',
        title: 'Hash Breaker: Offline Dictionary Recovery',
        category: 'Password Cracking',
        difficulty: 'Medium (★★☆)',
        points: 150,
        flag: 'FLAG{password}',
        desc: 'A user account hash was recovered: `5f4dcc3b5aa765d61d8327deb882cf99`. Identify the original password and wrap it in `FLAG{...}` format.',
        hint: 'Run `hashcat -m 0 hash.txt rockyou.txt` in the web terminal, or lookup the MD5 string in the Crypto Vault.'
      }
    ];

    this.init();
  }

  init() {
    this.renderChallenges();
    this.setupScoreboard();
  }

  renderChallenges() {
    const grid = document.getElementById('ctf-challenges-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const solvedList = (window.hackApp && window.hackApp.state.solvedFlags) || [];

    this.challenges.forEach(ch => {
      const isSolved = solvedList.includes(ch.id);
      const card = document.createElement('div');
      card.className = `ctf-card ${isSolved ? 'solved' : ''}`;
      card.id = `ctf-card-${ch.id}`;

      card.innerHTML = `
        <div class="ctf-header-top">
          <span class="ctf-category">${ch.category}</span>
          <span class="ctf-points">+${ch.points} XP</span>
        </div>
        <h4 class="ctf-card-title">${ch.title}</h4>
        <div style="font-size:0.75rem; color:var(--text-dim); margin-bottom:8px; font-family:var(--font-mono);">${ch.difficulty}</div>
        <p class="ctf-card-desc">${ch.desc}</p>

        <button class="btn btn-sm btn-secondary toggle-hint-btn" style="margin-bottom:10px; align-self:flex-start;" data-target="hint-${ch.id}">
          💡 View Intel Hint
        </button>

        <div id="hint-${ch.id}" class="ctf-hint-box">
          ${ch.hint}
        </div>

        <div class="ctf-flag-input-group">
          <input type="text" class="flag-input" id="flag-input-${ch.id}" placeholder="FLAG{...}" ${isSolved ? 'value="' + ch.flag + '" disabled' : ''}>
          <button class="btn btn-sm btn-primary submit-flag-btn" data-id="${ch.id}" ${isSolved ? 'disabled' : ''}>
            ${isSolved ? 'Captured' : 'Submit'}
          </button>
        </div>
      `;

      // Hint toggle
      const hintBtn = card.querySelector('.toggle-hint-btn');
      const hintBox = card.querySelector(`#hint-${ch.id}`);
      hintBtn.addEventListener('click', () => {
        hintBox.classList.toggle('show');
        window.cyberAudio.playKeyClick();
      });

      // Submit Flag button
      const submitBtn = card.querySelector('.submit-flag-btn');
      const input = card.querySelector(`#flag-input-${ch.id}`);
      submitBtn.addEventListener('click', () => {
        this.validateFlag(ch, input.value.trim(), card, submitBtn, input);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.validateFlag(ch, input.value.trim(), card, submitBtn, input);
        }
      });

      grid.appendChild(card);
    });
  }

  validateFlag(ch, submittedVal, card, submitBtn, input) {
    if (!submittedVal) return;

    if (submittedVal.toLowerCase() === ch.flag.toLowerCase()) {
      // Success!
      window.cyberAudio.playSuccessSound();
      if (window.hackApp) {
        window.hackApp.triggerConfetti();
        if (!window.hackApp.state.solvedFlags.includes(ch.id)) {
          window.hackApp.state.solvedFlags.push(ch.id);
          window.hackApp.addXP(ch.points, `Captured Flag: ${ch.title}`);
        }
      }

      card.classList.add('solved');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Captured';
      input.disabled = true;
      input.value = ch.flag;

      this.updateScoreboard();
    } else {
      // Error
      window.cyberAudio.playErrorSound();
      input.style.borderColor = 'var(--neon-red)';
      setTimeout(() => {
        input.style.borderColor = 'var(--border-subtle)';
      }, 1000);
      if (window.hackApp) {
        window.hackApp.showToast('❌ Invalid flag signature. Double check the requirements!', 'info');
      }
    }
  }

  setupScoreboard() {
    this.updateScoreboard();
  }

  updateScoreboard() {
    const list = document.getElementById('ctf-scoreboard-list');
    if (!list) return;

    const studentXp = (window.hackApp && window.hackApp.state.xp) || 0;
    const studentName = (window.hackApp && window.hackApp.state.studentName) || 'You';

    const peers = [
      { name: '0xGhost_Rider', flags: 6, xp: 950 },
      { name: 'CipherSurfer', flags: 5, xp: 750 },
      { name: `${studentName} (You)`, flags: (window.hackApp && window.hackApp.state.solvedFlags.length) || 0, xp: studentXp, isUser: true },
      { name: 'BinaryBandit', flags: 3, xp: 450 },
      { name: 'NullPointer_Ex', flags: 2, xp: 300 },
      { name: 'PacketNinja', flags: 1, xp: 150 }
    ];

    peers.sort((a, b) => b.xp - a.xp);

    list.innerHTML = peers.map((p, idx) => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; margin-bottom:6px; background:${p.isUser ? 'rgba(0, 245, 212, 0.12)' : 'rgba(12, 18, 32, 0.6)'}; border-radius:6px; border:${p.isUser ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)'};">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-family:var(--font-mono); font-weight:bold; color:${idx === 0 ? 'var(--neon-amber)' : 'var(--text-muted)'}; width:20px;">#${idx + 1}</span>
          <span style="font-weight:${p.isUser ? '700' : '500'}; color:${p.isUser ? 'var(--neon-cyan)' : '#f1f5f9'};">${p.name}</span>
        </div>
        <div style="display:flex; gap:16px; font-family:var(--font-mono); font-size:0.85rem;">
          <span style="color:var(--text-muted);">${p.flags} Flags</span>
          <span style="color:var(--neon-green); font-weight:bold;">${p.xp} XP</span>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ctfArena = new CtfArena();
});
