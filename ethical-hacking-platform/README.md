# HackForge Academy 🛡️ // Ethical Hacking & Cyber Defense Platform

An interactive, browser-based ethical hacking learning academy built for students, cybersecurity beginners, and educators.

---

## 🚀 Quick Start

### Method 1: Local HTTP Server (Recommended)
From the project folder, start a lightweight web server:
```bash
cd /Users/aparna/Desktop/ethical-hacking-platform
python3 -m http.server 8088
```
Then open your browser to: **[http://localhost:8088](http://localhost:8088)**

### Method 2: Direct File Open
You can also directly double-click `index.html` on your Desktop to open it in Chrome, Safari, Firefox, or Edge. No backend setup or database required!

---

## 🎯 What's Inside

### 1. 🛡️ Ethical Hacker's Oath & Mission Command
- Pre-requisite legal guidelines (CFAA, Computer Misuse Act, Rules of Engagement).
- Interactive **"Sign Ethical Oath"** pledge that unlocks student rank and awards **+50 XP**.
- Student Level progression (Cadet Trainee $\rightarrow$ Apprentice Scout $\rightarrow$ Cyber Specialist $\rightarrow$ Penetration Tester $\rightarrow$ Elite Cyber Sentinel).

### 2. 🧪 Interactive Hands-on Labs
- **SQL Injection (SQLi) Laboratory**: Live string concatenation vulnerability viewer with payload quick-fill (`' OR '1'='1' --`, `UNION SELECT`) and a **Prepared Statements Toggle** showing how parameterized queries neutralize attacks.
- **Cross-Site Scripting (XSS) Sandbox**: Reflected and DOM XSS testing arena demonstrating payload execution versus HTML sanitization (`htmlspecialchars` / `DOMPurify`).
- **Cryptography & Hash Cracking Vault**:
  - Caesar cipher encoder/decoder with brute-force shift key solver.
  - Base64, Hexadecimal converter, and MD5 hash generator.
- **Packet Sniffer & Analyzer (Mini-Wireshark)**: Live packet capture simulator dissecting TCP, HTTP, and FTP traffic to inspect cleartext credentials.

### 3. 💻 Kali Linux Web Terminal Emulator
- Interactive Unix/Kali command line with real-time autocompletion, tab support, and history navigation.
- Built-in cybersecurity tools: `nmap`, `curl`, `hashcat`, `ls`, `cat`, `whoami`, `id`, `pwd`, `clear`, `ping`, `ifconfig`, `matrix`.

### 4. 🏁 Capture The Flag (CTF) Arena
- 6 progressive challenges with realistic scenario briefings and hints:
  1. *Recon Rookie* (Source code / DOM inspection)
  2. *Gatekeeper Bypass* (Authentication bypass via SQLi)
  3. *Wire Tapper* (Cleartext network packet interception)
  4. *Emperor's Cipher* (Classic cryptanalysis)
  5. *Terminal Recon* (Linux terminal enumeration)
  6. *Hash Breaker* (Cracking MD5 hashes)
- Instant flag validation, audio fanfares, celebratory confetti particles, and live local scoreboard.

### 5. 📚 Curriculum & Knowledge Quizzes
- Structured theoretical lessons with interactive knowledge checks:
  - **Track 1**: Ethics, Law & Engagement Rules (RoE)
  - **Track 2**: TCP/IP 3-Way Handshake & Network Reconnaissance
  - **Track 3**: OWASP Top 10 Web Security Vulnerabilities
  - **Track 4**: Blue Team Defense & Cryptographic Integrity

### 6. 🛡️ "Defend & Fix" Secure Coding Workbench
- Side-by-side comparison of vulnerable code vs patched secure code.
- Interactive attack simulation comparing broken code against hardened implementations (PHP PDO, JS textContent, salted password hashing).

### 7. 📖 Field Manual & Cheat Sheets
- Quick-reference guides for Nmap flags, essential Linux commands, well-known networking ports, and HTTP status codes.

### 8. 🎓 Student Certificate Generator
- Dynamic completion certificate featuring the student's name, rank, total XP, and cryptographic verification hash.
- Full print and PDF export styling included.

---

## 📁 Project Structure

```
ethical-hacking-platform/
├── index.html                   # Main single-page application
├── README.md                    # Documentation & student guide
├── assets/
│   └── images/
│       └── shield-logo.jpg      # Holographic cyber defense shield emblem
├── css/
│   └── style.css                # Cyber SOC dark theme, glassmorphism & responsive CSS
└── js/
    ├── app.js                   # Application state, XP progression, confetti & canvas
    ├── audio.js                 # Web Audio API sound effect synthesizer
    ├── ctf.js                   # CTF engine, flag validation & leaderboard
    ├── curriculum.js            # Theory modules & interactive knowledge-check quizzes
    ├── defend.js                # Secure coding defense workbench
    ├── labs.js                  # SQLi, XSS, Cryptography & Packet Sniffer simulators
    └── terminal.js              # Interactive Kali CLI terminal emulator
```

---

## ⚖️ Legal & Ethical Notice
This platform is strictly created for educational purposes to help students and developers understand offensive security concepts in order to build stronger defenses. Always obey authorized rules of engagement.
