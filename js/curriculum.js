/* ==========================================================================
   HACKFORGE ACADEMY - CURRICULUM TRACKS & KNOWLEDGE QUIZZES
   Comprehensive Student Lessons & Interactive Self-Assessment
   ========================================================================== */

class CurriculumEngine {
  constructor() {
    this.modules = [
      {
        id: 'mod_foundations',
        title: 'Track 1: Ethics, Law & Engagement Rules',
        tag: 'CORE FOUNDATIONS',
        readTime: '6 min read',
        content: `
          <h3>Module 1: The Hacker Ethos & Legal Frameworks</h3>
          <p>The defining boundary between an ethical hacker (White Hat) and a malicious criminal (Black Hat) is not the tools they carry, but <strong>authorization</strong>, <strong>intent</strong>, and <strong>adherence to the law</strong>.</p>
          
          <div class="callout-box">
            <strong>The Golden Rule of Ethical Hacking:</strong>
            Never target, scan, or exploit any digital system without explicit, prior written authorization from the system owner.
          </div>

          <h4>1. The Hacker Spectrum</h4>
          <ul>
            <li><strong>White Hat (Ethical Pentester):</strong> Works with legal consent to identify security vulnerabilities before adversaries do, producing detailed remediation reports.</li>
            <li><strong>Black Hat (Cyber Criminal):</strong> Breaches systems without permission for personal profit, data theft, extortion, or destruction.</li>
            <li><strong>Grey Hat:</strong> Finds vulnerabilities without authorization, but discloses them to the owner rather than exploiting them maliciously (still legally hazardous under most cyber laws).</li>
          </ul>

          <h4>2. Legal Statutes Every Student Must Know</h4>
          <p>Unauthorized access is a serious crime globally. Prominent international statutes include:</p>
          <ul>
            <li><strong>CFAA (Computer Fraud and Abuse Act - USA):</strong> Prohibits accessing a protected computer without authorization or exceeding authorized access.</li>
            <li><strong>Computer Misuse Act 1990 (UK):</strong> Criminalizes unauthorized access with intent to commit further offenses or impair operation.</li>
            <li><strong>IT Act 2000 (Section 43 & 66 - India):</strong> Mandates penalties and imprisonment for unauthorized hacking, denial of service, and data tampering.</li>
          </ul>

          <h4>3. Rules of Engagement (RoE)</h4>
          <p>Before launching any pentest, professionals execute a contract known as the <em>Rules of Engagement</em> defining:</p>
          <ol>
            <li><strong>Scope:</strong> Specific IP addresses, domains, and cloud buckets permitted for testing (out-of-scope targets are strictly off-limits).</li>
            <li><strong>Timing & Schedule:</strong> Testing hours to prevent production system downtime.</li>
            <li><strong>Prohibited Techniques:</strong> E.g., No Denial-of-Service (DoS), physical facility attacks, or social engineering unless explicitly requested.</li>
          </ol>
        `,
        quiz: {
          question: 'What is the absolute legal prerequisite before beginning a penetration test on a client server?',
          options: [
            'Running an nmap stealth scan to verify the firewall is online',
            'Signed, explicit written authorization and agreed Rules of Engagement (RoE)',
            'Notifying the local police department',
            'Ensuring you use an anonymous VPN proxy'
          ],
          correctIndex: 1,
          explanation: 'Correct! Explicit written authorization defining the scope and rules of engagement is mandatory. Without it, even basic port scanning can violate cyber law.'
        }
      },
      {
        id: 'mod_networking',
        title: 'Track 2: TCP/IP & Network Reconnaissance',
        tag: 'NETWORK SECURITY',
        readTime: '8 min read',
        content: `
          <h3>Module 2: Network Reconnaissance & Port Scanning</h3>
          <p>To defend or assess network infrastructure, ethical hackers must understand how computers establish connections across the TCP/IP stack.</p>

          <h4>1. The TCP Three-Way Handshake</h4>
          <p>Transmission Control Protocol ensures reliable communication via a 3-step sequence:</p>
          <ol>
            <li><strong>SYN (Synchronize):</strong> The client sends a packet with an initial sequence number (ISN).</li>
            <li><strong>SYN-ACK (Synchronize-Acknowledge):</strong> If the destination port is open and listening, the server responds acknowledging the client sequence.</li>
            <li><strong>ACK (Acknowledge):</strong> The client confirms, and the full duplex connection is established.</li>
          </ol>

          <div class="callout-box">
            <strong>How Nmap Stealth SYN Scan (-sS) Works:</strong><br>
            Instead of completing the full 3-way handshake, Nmap sends a SYN. If the server replies SYN-ACK, Nmap knows the port is open and immediately responds with a <strong>RST (Reset)</strong> packet! This prevents an application connection log from triggering.
          </div>

          <h4>2. Essential Well-Known Ports</h4>
          <ul>
            <li><code>Port 21: FTP</code> (File Transfer - vulnerable to cleartext interception unless FTPS/SFTP)</li>
            <li><code>Port 22: SSH</code> (Secure Shell - encrypted remote management)</li>
            <li><code>Port 53: DNS</code> (Domain Name System - port 53 UDP)</li>
            <li><code>Port 80 / 443: HTTP & HTTPS</code> (Web traffic)</li>
            <li><code>Port 3306: MySQL</code> (Relational database)</li>
            <li><code>Port 3389: RDP</code> (Remote Desktop Protocol)</li>
          </ul>
        `,
        quiz: {
          question: 'Why does an Nmap TCP SYN Stealth scan (-sS) send a RST packet after receiving a SYN-ACK from a target port?',
          options: [
            'To crash the remote target service',
            'To tear down the connection before it completes, avoiding full application session logging',
            'To encrypt the payload against packet sniffers',
            'To bypass firewall deep packet inspection'
          ],
          correctIndex: 1,
          explanation: 'Correct! By aborting the connection with a RST before the final ACK, the TCP connection never completes, which frequently evades application-layer connection logs.'
        }
      },
      {
        id: 'mod_owasp',
        title: 'Track 3: OWASP Top 10 Web Vulnerabilities',
        tag: 'WEB APP SECURITY',
        readTime: '10 min read',
        content: `
          <h3>Module 3: OWASP Top 10 Web Security</h3>
          <p>The Open Worldwide Application Security Project (OWASP) maintains a consensus ranking of the most critical security risks facing web applications.</p>

          <h4>1. Injection Vulnerabilities (SQLi & Command Injection)</h4>
          <p>Occurs when untrusted user input is directly concatenated into an interpreter (SQL, OS Shell, LDAP) without parameterization. Attackers can alter database query logic or run arbitrary operating system commands.</p>

          <h4>2. Broken Access Control & IDOR</h4>
          <p><strong>Insecure Direct Object Reference (IDOR)</strong> happens when an application provides direct access to objects based on user-supplied input (e.g. <code>GET /invoices?id=1042</code>). Without proper authorization checks, an attacker simply modifies the ID to <code>1043</code> to view another customer's private invoice.</p>

          <h4>3. Cross-Site Scripting (XSS)</h4>
          <p>XSS flaws allow attackers to inject malicious JavaScript into web pages viewed by other users. Types include:</p>
          <ul>
            <li><strong>Stored XSS:</strong> Malicious script is saved in the database (e.g. comments, profile bio) and served to all future visitors.</li>
            <li><strong>Reflected XSS:</strong> The script comes from the current HTTP request (e.g. search query parameters).</li>
            <li><strong>DOM-based XSS:</strong> The vulnerability exists solely in client-side JavaScript executing untrusted DOM sources.</li>
          </ul>
        `,
        quiz: {
          question: 'What is the most effective industry-standard defense against SQL Injection vulnerabilities?',
          options: [
            'Blacklisting dangerous words like "SELECT" and "UNION"',
            'Using Prepared Statements with Parameterized Queries (PDO, PreparedStatement)',
            'Hashing user inputs with MD5',
            'Hiding the database behind an obscure custom port'
          ],
          correctIndex: 1,
          explanation: 'Correct! Parameterized queries ensure that database engines treat all user input strictly as literal data parameters, never as executable code instructions.'
        }
      },
      {
        id: 'mod_defense',
        title: 'Track 4: Defense-in-Depth & Secure Cryptography',
        tag: 'BLUE TEAM & DEFENSE',
        readTime: '7 min read',
        content: `
          <h3>Module 4: Blue Team Defense & Cryptographic Integrity</h3>
          <p>Ethical hacking is only half of the equation—understanding how to architect resilient defenses is what protects society from malicious threat actors.</p>

          <h4>1. Defense in Depth</h4>
          <p>Security is never a single silver bullet. Defense in depth employs multiple overlapping layers:</p>
          <ul>
            <li><strong>Network Boundary:</strong> Next-Gen Firewalls, Web Application Firewalls (WAF), and DDoS mitigation.</li>
            <li><strong>Host & OS Layer:</strong> Least privilege access, regular patching, endpoint detection and response (EDR).</li>
            <li><strong>Application Layer:</strong> Input validation, output encoding, strong session management (HttpOnly and SameSite cookie flags).</li>
            <li><strong>Data Layer:</strong> Strong encryption in transit (TLS 1.3) and encryption at rest (AES-256).</li>
          </ul>

          <h4>2. Modern Password Hashing Principles</h4>
          <div class="callout-box danger">
            <strong>Never use MD5 or SHA-1 for passwords!</strong><br>
            MD5 and SHA-1 are un-salted and computed too quickly (billions of hashes per second on modern GPUs), rendering them trivial to crack via precomputed Rainbow Tables or dictionary attacks.
          </div>
          <p>Modern applications must use dedicated, memory-hard key derivation functions with cryptographic random salts, such as <strong>Argon2id</strong>, <strong>bcrypt</strong>, or <strong>PBKDF2</strong>.</p>
        `,
        quiz: {
          question: 'Why is adding a cryptographic salt essential when storing hashed passwords in a database?',
          options: [
            'It makes the password hash reversible for customer support recovery',
            'It ensures identical passwords generate completely unique hashes, neutralizing precomputed Rainbow Table attacks',
            'It compresses the password to save database disk space',
            'It automatically verifies the user email address'
          ],
          correctIndex: 1,
          explanation: 'Correct! A cryptographic salt is a unique random string added to the password before hashing. Even if two users share the password "Password123", their salted hashes will be entirely different, defeating rainbow tables.'
        }
      }
    ];

    this.currentModuleIndex = 0;
    this.init();
  }

  init() {
    this.renderModuleList();
    this.displayModule(0);
  }

  renderModuleList() {
    const list = document.getElementById('curriculum-module-list');
    if (!list) return;

    list.innerHTML = '';
    this.modules.forEach((mod, idx) => {
      const item = document.createElement('div');
      item.className = `module-nav-item ${idx === 0 ? 'active' : ''}`;
      item.id = `mod-nav-${idx}`;
      item.innerHTML = `
        <div>
          <div class="module-nav-title">${mod.title}</div>
          <div class="module-nav-sub">${mod.tag} • ${mod.readTime}</div>
        </div>
        <span class="status-indicator" id="mod-status-${idx}">
          ${(window.hackApp && window.hackApp.state.completedModules.includes(mod.id)) ? '✓' : '→'}
        </span>
      `;

      item.addEventListener('click', () => {
        document.querySelectorAll('.module-nav-item').forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        this.displayModule(idx);
        window.cyberAudio.playKeyClick();
      });

      list.appendChild(item);
    });
  }

  displayModule(index) {
    this.currentModuleIndex = index;
    const mod = this.modules[index];
    const contentPanel = document.getElementById('curriculum-article-panel');
    if (!contentPanel) return;

    contentPanel.innerHTML = `
      <article class="lesson-article">
        ${mod.content}

        <div class="quiz-container">
          <div class="quiz-header">
            <h4>🧠 Knowledge Check Quiz</h4>
            <span class="quiz-badge">+50 XP</span>
          </div>
          <div class="quiz-question">${mod.quiz.question}</div>
          <div class="quiz-options" id="quiz-options-container">
            ${mod.quiz.options.map((opt, oIdx) => `
              <button class="quiz-option-btn" data-opt="${oIdx}">${opt}</button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="quiz-feedback-box"></div>
        </div>
      </article>
    `;

    // Attach quiz answer logic
    const optionBtns = contentPanel.querySelectorAll('.quiz-option-btn');
    const feedbackBox = contentPanel.querySelector('#quiz-feedback-box');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.getAttribute('data-opt'), 10);
        optionBtns.forEach(b => b.disabled = true);

        if (chosen === mod.quiz.correctIndex) {
          btn.classList.add('correct');
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(16, 185, 129, 0.15)';
          feedbackBox.style.border = '1px solid var(--neon-green)';
          feedbackBox.style.color = '#34d399';
          feedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${mod.quiz.explanation}`;
          window.cyberAudio.playSuccessSound();

          if (window.hackApp) {
            if (!window.hackApp.state.completedModules.includes(mod.id)) {
              window.hackApp.state.completedModules.push(mod.id);
              window.hackApp.addXP(50, `Completed ${mod.title}`);
              const indicator = document.getElementById(`mod-status-${index}`);
              if (indicator) indicator.textContent = '✓';
            }
          }
        } else {
          btn.classList.add('wrong');
          optionBtns[mod.quiz.correctIndex].classList.add('correct');
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(239, 68, 68, 0.15)';
          feedbackBox.style.border = '1px solid var(--neon-red)';
          feedbackBox.style.color = '#f87171';
          feedbackBox.innerHTML = `<strong>❌ Incorrect.</strong> ${mod.quiz.explanation}`;
          window.cyberAudio.playErrorSound();
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.curriculumEngine = new CurriculumEngine();
});
