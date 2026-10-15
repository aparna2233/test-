/* ==========================================================================
   HACKFORGE ACADEMY - DEFEND & REMEDIATE CODE WORKBENCH
   Interactive Vulnerability Patch Comparison & Exploit Simulation
   ========================================================================== */

class DefendWorkbench {
  constructor() {
    this.scenarios = [
      {
        id: 'sql_patch',
        title: 'Vulnerability #1: SQL Injection (PHP / PDO)',
        lang: 'PHP / MySQL',
        cwe: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
        vulnerable: `
// ❌ VULNERABLE CODE (Direct String Concatenation)
function authenticateUser($username, $password) {
  global $db;
  
  // High Risk: Attacker can inject quotes and tautologies
  $query = "SELECT * FROM users WHERE username = '" . $username . "' 
            AND password = '" . $password . "'";
            
  $result = $db->query($query);
  return $result->fetch_assoc();
}
        `.trim(),
        patched: `
// ✅ SECURE REMEDIATION (Prepared Statements & Parameter Binding)
function authenticateUser($username, $password) {
  global $pdo;

  // Parameters are separated from SQL execution plan
  $stmt = $pdo->prepare("SELECT id, username, password_hash, role 
                         FROM users WHERE username = :user");
  $stmt->execute([':user' => $username]);
  $user = $stmt->fetch();

  // Securely verify salted hash with constant-time comparison
  if ($user && password_verify($password, $user['password_hash'])) {
    return $user;
  }
  return false;
}
        `.trim(),
        exploitInput: "' OR '1'='1' --",
        vulnOutcome: '🚨 DATABASE BREACH: Authentication bypassed! Entire user table dumped.',
        patchOutcome: '🛡️ SECURE: Query treated input as a literal username string. 0 records returned. Attack neutralized.'
      },
      {
        id: 'xss_patch',
        title: 'Vulnerability #2: Stored Cross-Site Scripting (JavaScript)',
        lang: 'JavaScript / DOM',
        cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
        vulnerable: `
// ❌ VULNERABLE CODE (Direct innerHTML Assignment)
function renderUserBio(bioText, containerElement) {
  // High Risk: HTML tags and <script> execution trigger immediately
  containerElement.innerHTML = "<div class='bio'>" + bioText + "</div>";
}
        `.trim(),
        patched: `
// ✅ SECURE REMEDIATION (Safe textContent / DOM Encoding)
function renderUserBio(bioText, containerElement) {
  const bioDiv = document.createElement('div');
  bioDiv.className = 'bio';

  // Safe: textContent ensures characters are rendered strictly as text
  bioDiv.textContent = bioText;
  
  containerElement.innerHTML = '';
  containerElement.appendChild(bioDiv);
}
        `.trim(),
        exploitInput: '<img src=x onerror="alert(document.cookie)">',
        vulnOutcome: '🚨 XSS TRIGGERED: JavaScript executed in victim browser session. Session cookies compromised.',
        patchOutcome: '🛡️ SECURE: Characters escaped safely into harmless text nodes. No scripts executed.'
      },
      {
        id: 'password_patch',
        title: 'Vulnerability #3: Weak Password Storage (Python)',
        lang: 'Python / Cryptography',
        cwe: 'CWE-916: Use of Password Hash With Insufficient Computational Effort',
        vulnerable: `
# ❌ VULNERABLE CODE (Fast Unsalted MD5 Hash)
import hashlib

def store_password(raw_password):
  # High Risk: MD5 computes in nanoseconds.
  # Easily cracked via precomputed Rainbow Tables or dictionary brute-force.
  return hashlib.md5(raw_password.encode('utf-8')).hexdigest()
        `.trim(),
        patched: `
# ✅ SECURE REMEDIATION (Bcrypt with Work Factor & Random Salt)
import bcrypt

def store_password(raw_password):
  # Generates cryptographically secure salt + adaptive cost factor 12
  salt = bcrypt.gensalt(rounds=12)
  # Memory-hard key derivation function prevents GPU acceleration
  return bcrypt.hashpw(raw_password.encode('utf-8'), salt)
        `.trim(),
        exploitInput: 'Lookup hash: 5f4dcc3b5aa765d61d8327deb882cf99',
        vulnOutcome: '🚨 CRACKED IN 0.002 SECONDS: Rainbow table match found -> "password".',
        patchOutcome: '🛡️ SECURE: Salt renders rainbow tables impossible. Bcrypt cost factor throttles brute force to ~3 attempts/sec.'
      }
    ];

    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.setupScenarioButtons();
    this.renderScenario(0);
  }

  setupScenarioButtons() {
    const selector = document.getElementById('defend-scenario-selector');
    if (!selector) return;

    selector.innerHTML = this.scenarios.map((sc, idx) => `
      <button class="tab-pill ${idx === 0 ? 'active' : ''}" data-sc="${idx}">
        ${sc.title.split(':')[0]}
      </button>
    `).join('');

    const btns = selector.querySelectorAll('.tab-pill');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = parseInt(btn.getAttribute('data-sc'), 10);
        this.renderScenario(idx);
        window.cyberAudio.playKeyClick();
      });
    });
  }

  renderScenario(index) {
    this.currentIndex = index;
    const sc = this.scenarios[index];

    const titleElem = document.getElementById('defend-title');
    const cweElem = document.getElementById('defend-cwe');
    const vulnCodeElem = document.getElementById('defend-vuln-code');
    const patchCodeElem = document.getElementById('defend-patch-code');
    const simInputElem = document.getElementById('defend-sim-input');
    const simVulnBtn = document.getElementById('defend-run-vuln-btn');
    const simPatchBtn = document.getElementById('defend-run-patch-btn');
    const simResultElem = document.getElementById('defend-sim-result');

    if (titleElem) titleElem.textContent = sc.title;
    if (cweElem) cweElem.textContent = `${sc.lang} • ${sc.cwe}`;
    if (vulnCodeElem) vulnCodeElem.textContent = sc.vulnerable;
    if (patchCodeElem) patchCodeElem.textContent = sc.patched;
    if (simInputElem) simInputElem.value = sc.exploitInput;

    if (simResultElem) {
      simResultElem.innerHTML = `<span style="color:var(--text-muted)">Click a button above to run simulated exploit against either codebase.</span>`;
      simResultElem.className = 'exploit-output';
    }

    if (simVulnBtn) {
      simVulnBtn.onclick = () => {
        window.cyberAudio.playErrorSound();
        simResultElem.className = 'exploit-output danger';
        simResultElem.innerHTML = `<strong>Vulnerable Outcome:</strong> ${sc.vulnOutcome}`;
      };
    }

    if (simPatchBtn) {
      simPatchBtn.onclick = () => {
        window.cyberAudio.playSuccessSound();
        simResultElem.className = 'exploit-output success';
        simResultElem.innerHTML = `<strong>Secure Patch Outcome:</strong> ${sc.patchOutcome}`;
        if (window.hackApp) {
          window.hackApp.addXP(25, 'Reviewed and tested secure code patch');
        }
      };
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.defendWorkbench = new DefendWorkbench();
});
