/* ==========================================================================
   HACKFORGE ACADEMY - INTERACTIVE HACKING LABS
   SQLi Simulator, XSS Sandbox, Cryptography Vault & Packet Sniffer
   ========================================================================== */

class HackAcademyLabs {
  constructor() {
    this.isSqliSecure = false;
    this.isXssSanitized = false;
    this.init();
  }

  init() {
    this.setupSqliLab();
    this.setupXssLab();
    this.setupCryptoLab();
    this.setupPacketSnifferLab();
  }

  // ========================================================================
  // 1. SQL INJECTION (SQLi) LAB
  // ========================================================================
  setupSqliLab() {
    const userInput = document.getElementById('sqli-user-input');
    const passInput = document.getElementById('sqli-pass-input');
    const submitBtn = document.getElementById('sqli-submit-btn');
    const queryViewer = document.getElementById('sqli-query-viewer');
    const resultBox = document.getElementById('sqli-result-box');
    const secureToggle = document.getElementById('sqli-secure-toggle');
    const chips = document.querySelectorAll('.sqli-payload-chip');

    if (!userInput || !submitBtn) return;

    // Fast-fill sample exploit payloads
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const payload = chip.getAttribute('data-payload');
        userInput.value = payload;
        passInput.value = 'irrelevant_password';
        this.updateSqliQueryPreview();
        window.cyberAudio.playKeyClick();
      });
    });

    // Real-time SQL Query Construction preview
    const updatePreview = () => this.updateSqliQueryPreview();
    userInput.addEventListener('input', updatePreview);
    passInput.addEventListener('input', updatePreview);

    if (secureToggle) {
      secureToggle.addEventListener('change', (e) => {
        this.isSqliSecure = e.target.checked;
        const banner = document.getElementById('sqli-mode-status');
        if (banner) {
          banner.textContent = this.isSqliSecure ? 'MODE: PREPARED STATEMENTS (SECURE)' : 'MODE: STRING CONCATENATION (VULNERABLE)';
          banner.style.color = this.isSqliSecure ? 'var(--neon-green)' : 'var(--neon-red)';
        }
        this.updateSqliQueryPreview();
        window.cyberAudio.playExecuteSound();
      });
    }

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.executeSqliQuery();
    });

    this.updateSqliQueryPreview();
  }

  updateSqliQueryPreview() {
    const userInput = document.getElementById('sqli-user-input');
    const passInput = document.getElementById('sqli-pass-input');
    const queryViewer = document.getElementById('sqli-query-viewer');
    if (!queryViewer) return;

    const u = userInput ? (userInput.value || 'admin') : 'admin';
    const p = passInput ? (passInput.value || '••••••') : '••••••';

    if (this.isSqliSecure) {
      queryViewer.innerHTML = `
<span class="sql-comment">-- SECURE: Parameterized Query using PDO / Prepared Statements</span>
<span class="sql-keyword">SELECT</span> id, username, role, flag_token 
<span class="sql-keyword">FROM</span> users 
<span class="sql-keyword">WHERE</span> username = <span class="sql-keyword">:user</span> <span class="sql-keyword">AND</span> password = <span class="sql-keyword">:pass</span>;

<span class="sql-comment">-- Bound Parameters:</span>
:user = <span class="sql-userinput">"${this.escapeHtml(u)}"</span> (Treated as pure literal text, NOT executable SQL)
:pass = "${this.escapeHtml(p)}"
      `.trim();
    } else {
      queryViewer.innerHTML = `
<span class="sql-comment">-- VULNERABLE: Direct string concatenation</span>
<span class="sql-keyword">SELECT</span> id, username, role, flag_token 
<span class="sql-keyword">FROM</span> users 
<span class="sql-keyword">WHERE</span> username = '<span class="sql-userinput">${this.escapeHtml(u)}</span>' <span class="sql-keyword">AND</span> password = '${this.escapeHtml(p)}';
      `.trim();
    }
  }

  executeSqliQuery() {
    const u = document.getElementById('sqli-user-input').value.trim();
    const resultBox = document.getElementById('sqli-result-box');
    if (!resultBox) return;

    if (this.isSqliSecure) {
      window.cyberAudio.playErrorSound();
      resultBox.className = 'exploit-output danger';
      resultBox.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">❌ Authentication Failed (401 Unauthorized)</div>
        <div>Parameterized query sanitized input: No user found matching the literal string: "${this.escapeHtml(u)}". Attack thwarted!</div>
      `;
      return;
    }

    // Vulnerable evaluation logic
    const isBypass = u.includes("' OR '1'='1") || u.includes("' or '1'='1") || u.includes("' OR 1=1") || u.includes("' or 1=1");
    const isUnion = u.toUpperCase().includes("UNION SELECT");

    if (isBypass || isUnion) {
      window.cyberAudio.playSuccessSound();
      resultBox.className = 'exploit-output success';
      resultBox.innerHTML = `
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 6px;">
          🎉 SQL INJECTION SUCCESSFUL! Bypassed Authentication!
        </div>
        <p style="margin-bottom: 10px; color: #cbd5e1; font-size: 0.8rem;">
          The boolean condition <code>'1'='1'</code> evaluated to <strong>TRUE</strong> for every row, and comments truncated the password check.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; text-align: left; background: rgba(0,0,0,0.5); border-radius: 4px; overflow: hidden;">
          <tr style="background: #1e293b; color: var(--neon-cyan);">
            <th style="padding: 6px;">ID</th><th>USERNAME</th><th>ROLE</th><th>FLAG TOKEN</th>
          </tr>
          <tr>
            <td style="padding: 6px;">1</td><td>admin</td><td><span style="color:#ef4444">ROOT_SYSADMIN</span></td>
            <td><strong style="color:var(--neon-green)">FLAG{sqli_taut0l0gy_by_p4ss}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px;">2</td><td>sarah_dev</td><td>ENGINEER</td><td>token_88921f</td>
          </tr>
        </table>
      `;

      if (window.hackApp && !window.hackApp.state.solvedFlags.includes('sqli_lab')) {
        window.hackApp.state.solvedFlags.push('sqli_lab');
        window.hackApp.addXP(100, 'SQL Injection Authentication Bypass Exploit');
      }
    } else if (u.toLowerCase() === 'admin') {
      window.cyberAudio.playErrorSound();
      resultBox.className = 'exploit-output danger';
      resultBox.innerHTML = `
        <div>❌ Incorrect password for user 'admin'. Try injecting an SQL payload like <code>' OR '1'='1' --</code></div>
      `;
    } else {
      window.cyberAudio.playErrorSound();
      resultBox.className = 'exploit-output danger';
      resultBox.innerHTML = `
        <div>❌ Invalid credentials. Query returned 0 records. Try an SQL injection payload to manipulate the WHERE clause!</div>
      `;
    }
  }

  // ========================================================================
  // 2. CROSS-SITE SCRIPTING (XSS) PLAYGROUND
  // ========================================================================
  setupXssLab() {
    const postInput = document.getElementById('xss-post-input');
    const postBtn = document.getElementById('xss-post-btn');
    const sanitizeToggle = document.getElementById('xss-sanitize-toggle');
    const commentsList = document.getElementById('xss-comments-list');
    const chips = document.querySelectorAll('.xss-payload-chip');
    const alertModal = document.getElementById('xss-simulated-alert');

    if (!postInput || !postBtn) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        postInput.value = chip.getAttribute('data-payload');
        window.cyberAudio.playKeyClick();
      });
    });

    if (sanitizeToggle) {
      sanitizeToggle.addEventListener('change', (e) => {
        this.isXssSanitized = e.target.checked;
        const banner = document.getElementById('xss-mode-status');
        if (banner) {
          banner.textContent = this.isXssSanitized ? 'DEFENSE: HTML ENTITY ENCODING (ACTIVE)' : 'DEFENSE: DISABLED (RAW DANGEROUS INNERHTML)';
          banner.style.color = this.isXssSanitized ? 'var(--neon-green)' : 'var(--neon-red)';
        }
        window.cyberAudio.playExecuteSound();
      });
    }

    postBtn.addEventListener('click', () => {
      const content = postInput.value.trim();
      if (!content) return;

      const item = document.createElement('div');
      item.style.padding = '8px 12px';
      item.style.marginBottom = '8px';
      item.style.background = '#0a101f';
      item.style.borderRadius = '6px';
      item.style.border = '1px solid var(--border-subtle)';
      item.style.fontSize = '0.85rem';

      const hasScript = content.toLowerCase().includes('<script') || 
                        content.toLowerCase().includes('onerror=') || 
                        content.toLowerCase().includes('onload=') ||
                        content.toLowerCase().includes('javascript:');

      if (this.isXssSanitized) {
        // Safe escaped rendering
        item.innerHTML = `
          <div style="font-size: 0.7rem; color: var(--neon-cyan); margin-bottom: 2px;">Guest #${Math.floor(Math.random()*900 + 100)} (Protected)</div>
          <div style="color: #cbd5e1;">${this.escapeHtml(content)}</div>
        `;
        commentsList.prepend(item);
        window.cyberAudio.playExecuteSound();
        if (window.hackApp) window.hackApp.showToast('Content safely encoded as HTML entities. Execution prevented!', 'info');
      } else {
        // Vulnerable rendering
        if (hasScript) {
          window.cyberAudio.playSuccessSound();
          item.style.borderColor = 'var(--neon-red)';
          item.innerHTML = `
            <div style="font-size: 0.7rem; color: var(--neon-red); margin-bottom: 2px;">⚠️ EXPLOITED POST (Unsanitized XSS Payload)</div>
            <div style="color: #f87171; font-family: var(--font-mono); font-size: 0.78rem;">${this.escapeHtml(content)}</div>
          `;
          commentsList.prepend(item);

          // Trigger simulated in-browser alert modal
          this.triggerMockXssAlert(content);

          if (window.hackApp && !window.hackApp.state.solvedFlags.includes('xss_lab')) {
            window.hackApp.state.solvedFlags.push('xss_lab');
            window.hackApp.addXP(100, 'Stored Cross-Site Scripting (XSS) Exploit');
          }
        } else {
          item.innerHTML = `
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 2px;">Guest #${Math.floor(Math.random()*900 + 100)}</div>
            <div>${this.escapeHtml(content)}</div>
          `;
          commentsList.prepend(item);
          window.cyberAudio.playExecuteSound();
        }
      }
      postInput.value = '';
    });
  }

  triggerMockXssAlert(payload) {
    const modal = document.getElementById('xss-simulated-alert');
    const msg = document.getElementById('xss-alert-msg');
    const flagNotice = document.getElementById('xss-flag-notice');
    if (!modal) return;

    if (msg) msg.textContent = `Vulnerable Browser Execution: "${payload}"`;
    if (flagNotice) flagNotice.innerHTML = `Captured Flag: <strong>FLAG{xss_s3ss10n_st34l3r_d3f34t}</strong>`;
    modal.style.display = 'flex';

    const closeBtn = document.getElementById('close-xss-modal-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = 'none';
      };
    }
  }

  // ========================================================================
  // 3. CRYPTOGRAPHY VAULT (Caesar, Base64, MD5 / SHA-256)
  // ========================================================================
  setupCryptoLab() {
    // Caesar Cipher
    const caesarInput = document.getElementById('caesar-input');
    const caesarShift = document.getElementById('caesar-shift');
    const shiftValDisplay = document.getElementById('caesar-shift-val');
    const caesarOutput = document.getElementById('caesar-output');
    const bruteForceBtn = document.getElementById('caesar-brute-btn');
    const bruteForceTable = document.getElementById('caesar-brute-table');

    const updateCaesar = () => {
      if (!caesarInput || !caesarOutput) return;
      const text = caesarInput.value;
      const shift = parseInt(caesarShift.value, 10);
      if (shiftValDisplay) shiftValDisplay.textContent = shift;
      caesarOutput.value = this.applyCaesar(text, shift);
    };

    if (caesarShift) caesarShift.addEventListener('input', updateCaesar);
    if (caesarInput) caesarInput.addEventListener('input', updateCaesar);

    if (bruteForceBtn && bruteForceTable) {
      bruteForceBtn.addEventListener('click', () => {
        const text = caesarInput.value || 'KHOOR ZRUOG';
        let html = '<table style="width:100%; border-collapse:collapse; font-size:0.75rem;">';
        for (let s = 1; s <= 25; s++) {
          const res = this.applyCaesar(text, -s);
          const isTarget = res.toUpperCase().includes('SECRET') || res.toUpperCase().includes('FLAG') || res.toUpperCase().includes('HELLO') || res.toUpperCase().includes('DEFEND');
          html += `<tr style="${isTarget ? 'background:rgba(0,245,212,0.15); color:var(--neon-cyan); font-weight:bold;' : ''} border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding:4px 8px; width: 60px;">Shift ${s}:</td>
            <td style="padding:4px 8px;">${this.escapeHtml(res)}</td>
          </tr>`;
        }
        html += '</table>';
        bruteForceTable.innerHTML = html;
        bruteForceTable.style.display = 'block';
        window.cyberAudio.playExecuteSound();
      });
    }

    // Base64 & Hex
    const b64Input = document.getElementById('b64-input');
    const b64Output = document.getElementById('b64-output');
    const b64EncodeBtn = document.getElementById('b64-encode-btn');
    const b64DecodeBtn = document.getElementById('b64-decode-btn');

    if (b64EncodeBtn && b64Input && b64Output) {
      b64EncodeBtn.addEventListener('click', () => {
        try {
          b64Output.value = btoa(b64Input.value);
          window.cyberAudio.playExecuteSound();
        } catch (e) {
          b64Output.value = 'Error encoding to Base64';
        }
      });
      b64DecodeBtn.addEventListener('click', () => {
        try {
          b64Output.value = atob(b64Input.value.trim());
          window.cyberAudio.playExecuteSound();
        } catch (e) {
          b64Output.value = 'Invalid Base64 string';
          window.cyberAudio.playErrorSound();
        }
      });
    }

    // Hash Generator
    const hashInput = document.getElementById('hash-calc-input');
    const md5Display = document.getElementById('hash-md5-display');
    const sha256Display = document.getElementById('hash-sha256-display');

    if (hashInput) {
      hashInput.addEventListener('input', () => {
        const val = hashInput.value;
        if (md5Display) md5Display.textContent = this.simpleMockMD5(val);
        if (sha256Display) sha256Display.textContent = this.simpleMockSHA256(val);
      });
    }
  }

  applyCaesar(str, shift) {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const code = c.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const base = isUpper ? 65 : 97;
      let shifted = (code - base + shift) % 26;
      if (shifted < 0) shifted += 26;
      return String.fromCharCode(base + shifted);
    });
  }

  simpleMockMD5(s) {
    if (!s) return 'd41d8cd98f00b204e9800998ecf8427e';
    // Known common hashes for training
    if (s === 'password') return '5f4dcc3b5aa765d61d8327deb882cf99';
    if (s === 'admin') return '21232f297a57a5a743894a0e4a801fc3';
    if (s === 'secret') return '5ebe2294ecd0e0f08eab7690d2a6ee69';
    
    // Algorithmic mock hash for arbitrary input
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0') + 'a7f92b4890c1e87d'.substring(0, 24);
  }

  simpleMockSHA256(s) {
    if (!s) return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    if (s === 'password') return '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
    return 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d';
  }

  // ========================================================================
  // 4. NETWORK PACKET SNIFFER LAB (MINI WIRESHARK)
  // ========================================================================
  setupPacketSnifferLab() {
    const tableBody = document.getElementById('packet-tbody');
    const filterBtns = document.querySelectorAll('.packet-filter-btn');
    const detailBox = document.getElementById('packet-detail-content');

    if (!tableBody) return;

    const packets = [
      { id: 1, time: '0.000', src: '192.168.1.45', dst: '1.1.1.1', proto: 'DNS', len: '74', info: 'Standard query 0x1a2b A internal-staff-portal.local', hex: '00 1a 2b 01 00 00 01 00 00 00 00 00 0e 69 6e 74', details: 'DNS Standard Query\nFlags: 0x0100 Recursive query\nQueries: internal-staff-portal.local: type A, class IN' },
      { id: 2, time: '0.018', src: '1.1.1.1', dst: '192.168.1.45', proto: 'DNS', len: '90', info: 'Standard query response A 10.10.14.88', hex: '00 1a 2b 81 80 00 01 00 01 00 00 00 0e 69 6e 74', details: 'DNS Standard Response\nAnswers: internal-staff-portal.local: type A, class IN, addr 10.10.14.88' },
      { id: 3, time: '0.142', src: '192.168.1.45', dst: '10.10.14.88', proto: 'HTTP', len: '320', info: 'GET /login.html HTTP/1.1 (User-Agent: Mozilla/5.0)', hex: '47 45 54 20 2f 6c 6f 67 69 6e 2e 68 74 6d 6c 20', details: 'Hypertext Transfer Protocol (UNENCRYPTED)\nHost: 10.10.14.88\nConnection: keep-alive\nAccept: text/html,application/xhtml+xml' },
      { id: 4, time: '0.450', src: '192.168.1.45', dst: '10.10.14.88', proto: 'FTP', len: '85', info: 'Request: USER cyber_admin', hex: '55 53 45 52 20 63 79 62 65 72 5f 61 64 6d 69 6e', details: 'File Transfer Protocol (FTP - INSECURE CLEARTEXT AUTHENTICATION)\nCommand: USER cyber_admin\nWarning: Credentials transmitted without TLS encryption!' },
      { id: 5, time: '0.510', src: '192.168.1.45', dst: '10.10.14.88', proto: 'FTP', len: '94', info: 'Request: PASS SummerSecret2024! (CLEARTEXT PASSWORD LEAKED)', hex: '50 41 53 53 20 53 75 6d 6d 65 72 53 65 63 72 65', details: 'File Transfer Protocol (FTP CLEARTEXT PASSWORD)\nCommand: PASS SummerSecret2024!\n⚠️ CRITICAL VULNERABILITY: Plaintext password captured in transit! Anyone on this network can intercept this password.\nAssociated CTF Flag: FLAG{wireshark_cleartext_ftp_exposed}' },
      { id: 6, time: '0.880', src: '192.168.1.45', dst: '142.250.190.46', proto: 'HTTPS', len: '512', info: 'TLSv1.3 Application Data [Encrypted Payload]', hex: '17 03 03 01 e0 c4 9a b7 1e 4f 88 20 1b d9 2e 77', details: 'Transport Layer Security (TLS 1.3)\nData: [Encrypted Payload: Cannot read plaintext data - protected against eavesdropping]' }
    ];

    const renderTable = (filter = 'ALL') => {
      tableBody.innerHTML = '';
      packets.forEach(pkt => {
        if (filter !== 'ALL' && pkt.proto !== filter) return;

        const row = document.createElement('tr');
        row.className = `packet-row ${pkt.proto === 'FTP' ? 'unencrypted' : ''}`;
        row.innerHTML = `
          <td>${pkt.id}</td>
          <td>${pkt.time}</td>
          <td>${pkt.src}</td>
          <td>${pkt.dst}</td>
          <td><span style="color:${pkt.proto === 'HTTPS' ? 'var(--neon-green)' : pkt.proto === 'FTP' ? 'var(--neon-red)' : 'var(--neon-cyan)'}">${pkt.proto}</span></td>
          <td>${pkt.len}</td>
          <td>${pkt.info}</td>
        `;

        row.addEventListener('click', () => {
          document.querySelectorAll('.packet-row').forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
          window.cyberAudio.playKeyClick();

          if (detailBox) {
            detailBox.innerHTML = `
              <div style="color:var(--neon-cyan); margin-bottom: 6px; font-weight:bold;">
                Frame #${pkt.id} • Protocol: ${pkt.proto} • Length: ${pkt.len} bytes
              </div>
              <pre style="color:#e2e8f0; margin-bottom: 8px;">${pkt.details}</pre>
              <div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">
                Hex Dump:\n${pkt.hex}
              </div>
            `;
          }
        });

        tableBody.appendChild(row);
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTable(btn.getAttribute('data-filter'));
        window.cyberAudio.playKeyClick();
      });
    });

    renderTable('ALL');
  }

  escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.hackLabs = new HackAcademyLabs();
});
