/* ==========================================================================
   HACKFORGE ACADEMY - INTERACTIVE WEB TERMINAL (KALI CLI SIMULATOR)
   Full Command Shell with Autocomplete, History, and Realistic Security Tools
   ========================================================================== */

class CyberTerminal {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.fileSystem = {
      'recon_notes.txt': 'Target: 10.10.14.88\nScope: Authorized penetration test on internal lab target.\nGoal: Enumerate web services, find hidden endpoints, and recover sensitive hashes.',
      'targets.cfg': '10.10.14.88  internal-target.hackforge.lan',
      'hash.txt': '5f4dcc3b5aa765d61d8327deb882cf99',
      'flag_clues.md': '# Reconnaissance Hints\n- Check robots.txt using curl\n- Use nmap with service detection (-sV)\n- Crack MD5 hashes with hashcat',
      '/admin_vault_backup_2024/flag.txt': '🎉 Congratulations!\nFLAG{recon_terminal_master_404}\nSubmit this flag in the CTF Arena for +150 XP!'
    };
    this.commandsList = [
      'help', 'nmap', 'curl', 'hashcat', 'ls', 'cat', 'whoami', 
      'id', 'pwd', 'clear', 'ping', 'ifconfig', 'matrix', 'history'
    ];
    this.init();
  }

  init() {
    this.screen = document.getElementById('terminal-screen');
    this.input = document.getElementById('terminal-input');
    this.prompt = document.getElementById('terminal-prompt');
    const clearBtn = document.getElementById('term-btn-clear');
    const resetBtn = document.getElementById('term-btn-reset');
    const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

    if (!this.screen || !this.input) return;

    // Quick command buttons
    quickCmdBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        this.input.value = cmd;
        this.handleCommand(cmd);
        this.input.value = '';
        this.input.focus();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.screen.innerHTML = '';
        this.printWelcome();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.screen.innerHTML = '';
        this.history = [];
        this.historyIndex = -1;
        this.printWelcome();
      });
    }

    // Input event listeners (Enter, Arrow Up/Down, Tab Autocomplete)
    this.input.addEventListener('keydown', (e) => {
      window.cyberAudio.playKeyClick();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        this.input.value = '';
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.handleCommand(cmd);
        } else {
          this.printLine('student@hackforge-box:~$ ', 'prompt');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });

    // Keep focus on terminal when clicking terminal screen
    this.screen.addEventListener('click', () => {
      this.input.focus();
    });

    this.printWelcome();
  }

  printWelcome() {
    this.printLine(`┌──(student㉿hackforge-box)-[~]`, 'system');
    this.printLine(`└─$ HackForge Kali Linux Terminal v2024.3 [AUTHORIZED TESTING ENVIRONMENT]`, 'system');
    this.printLine(`Type 'help' to view available security tools & pentest utilities.\n`, 'system');
  }

  printLine(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `terminal-output-line ${type}`;
    line.textContent = text;
    this.screen.appendChild(line);
    this.screen.scrollTop = this.screen.scrollHeight;
  }

  printHtml(html) {
    const line = document.createElement('div');
    line.className = `terminal-output-line`;
    line.innerHTML = html;
    this.screen.appendChild(line);
    this.screen.scrollTop = this.screen.scrollHeight;
  }

  autocomplete() {
    const current = this.input.value.trim();
    if (!current) return;
    const match = this.commandsList.find(c => c.startsWith(current));
    if (match) {
      this.input.value = match + ' ';
    }
  }

  handleCommand(rawCmd) {
    window.cyberAudio.playExecuteSound();
    this.printLine(`student@hackforge-box:~$ ${rawCmd}`, 'prompt');
    const args = rawCmd.split(' ').filter(Boolean);
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        this.printLine(`
Available Security Commands:
--------------------------------------------------
  nmap [-sV] <ip>       Network exploration & port scanner
  curl [-I] <url>       Transfer data & inspect HTTP responses
  hashcat -m 0 <hash>   Advanced password & hash recovery utility
  ls [-la]              List directory files and permissions
  cat <filename>        Display file contents
  whoami                Print effective student user ID
  id                    Display real and effective UIDs and GIDs
  pwd                   Print current working directory
  ping <ip>             Send ICMP ECHO_REQUEST to network hosts
  ifconfig              Configure & display network interface params
  matrix                Engage visual terminal matrix rain
  clear                 Clear terminal display screen
  history               Display previous command history
--------------------------------------------------
Try: 'nmap 10.10.14.88' or 'ls -la' to start reconnaissance.
        `.trim());
        break;

      case 'whoami':
        this.printLine('student');
        break;

      case 'id':
        this.printLine('uid=1000(student) gid=1000(student) groups=1000(student),27(sudo),1001(security)');
        break;

      case 'pwd':
        this.printLine('/home/student');
        break;

      case 'clear':
        this.screen.innerHTML = '';
        break;

      case 'history':
        this.history.forEach((h, idx) => {
          this.printLine(`  ${idx + 1}  ${h}`);
        });
        break;

      case 'ls':
        if (args.includes('-la') || args.includes('-l')) {
          this.printLine(`total 24
drwxr-xr-x 4 student student 4096 Oct 15 09:20 .
drwxr-xr-x 3 root    root    4096 Oct 15 08:00 ..
-rw-r--r-- 1 student student  142 Oct 15 09:12 recon_notes.txt
-rw-r--r-- 1 student student   48 Oct 15 09:15 targets.cfg
-rw-r--r-- 1 student student   33 Oct 15 09:18 hash.txt
-rw-r--r-- 1 student student  180 Oct 15 09:21 flag_clues.md`);
        } else {
          this.printLine('recon_notes.txt   targets.cfg   hash.txt   flag_clues.md');
        }
        break;

      case 'cat':
        if (args.length < 2) {
          this.printLine('Usage: cat <filename>', 'error');
          return;
        }
        const file = args[1];
        if (this.fileSystem[file]) {
          this.printLine(this.fileSystem[file]);
          if (file.includes('flag.txt') && window.hackApp) {
            if (!window.hackApp.state.solvedFlags.includes('terminal_flag')) {
              window.hackApp.state.solvedFlags.push('terminal_flag');
              window.hackApp.addXP(150, 'Discovered hidden flag via Terminal Reconnaissance');
            }
          }
        } else {
          this.printLine(`cat: ${file}: No such file or directory`, 'error');
        }
        break;

      case 'ping':
        const host = args[1] || '10.10.14.88';
        this.printLine(`PING ${host} (${host}) 56(84) bytes of data.`);
        this.printLine(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.412 ms`);
        this.printLine(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.389 ms`);
        this.printLine(`64 bytes from ${host}: icmp_seq=3 ttl=64 time=0.405 ms`);
        this.printLine(`--- ${host} ping statistics ---`);
        this.printLine(`3 packets transmitted, 3 received, 0% packet loss, time 2003ms`);
        break;

      case 'ifconfig':
        this.printLine(`eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.10.14.15  netmask 255.255.255.0  broadcast 10.10.14.255
        inet6 fe80::a00:27ff:fe4e:66b1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:b1  txqueuelen 1000  (Ethernet)
        RX packets 14502  bytes 1823901 (1.8 MB)
        TX packets 9820   bytes 923180 (923.1 KB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`);
        break;

      case 'nmap':
        const targetIp = args.find(a => a.startsWith('10.') || a.startsWith('192.') || a.includes('.lan')) || '10.10.14.88';
        const isVersionScan = args.includes('-sV') || args.includes('-A');

        this.printLine(`Starting Nmap 7.94 ( https://nmap.org ) at 2024-10-15 09:25 UTC`);
        this.printLine(`Nmap scan report for ${targetIp}`);
        this.printLine(`Host is up (0.00042s latency).`);
        this.printLine(`Not shown: 996 closed tcp ports (reset)`);
        
        if (isVersionScan) {
          this.printLine(`PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.3.4 (Anonymous login permitted)
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu) Server at 10.10.14.88)
3306/tcp open  mysql   MySQL 8.0.32-0ubuntu0.20.04.2
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`);
          this.printLine(`\n💡 Hint: Port 80 HTTP is open. Try using 'curl -I http://${targetIp}' or look for 'robots.txt' to discover hidden paths!`, 'warning');
        } else {
          this.printLine(`PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http
3306/tcp open  mysql
Nmap done: 1 IP address (1 host up) scanned in 0.88 seconds`);
          this.printLine(`💡 Tip: Run 'nmap -sV ${targetIp}' for service version banner grabbing!`, 'system');
        }
        break;

      case 'curl':
        if (args.length < 2) {
          this.printLine('Usage: curl [options] <url>', 'error');
          return;
        }
        const url = args[args.length - 1];
        const isHeaderOnly = args.includes('-I') || args.includes('-i');

        if (url.includes('robots.txt')) {
          this.printLine(`User-agent: *
Disallow: /admin_vault_backup_2024/
Disallow: /internal_api/private_keys/`);
          this.printLine(`\n🎯 Discovered hidden directory! Try inspecting files inside with 'cat /admin_vault_backup_2024/flag.txt'`, 'success');
        } else if (url.includes('/admin_vault_backup_2024/flag.txt')) {
          this.printLine(this.fileSystem['/admin_vault_backup_2024/flag.txt'], 'success');
          if (window.hackApp && !window.hackApp.state.solvedFlags.includes('terminal_flag')) {
            window.hackApp.state.solvedFlags.push('terminal_flag');
            window.hackApp.addXP(150, 'Discovered hidden flag via Terminal Reconnaissance');
          }
        } else if (isHeaderOnly) {
          this.printLine(`HTTP/1.1 200 OK
Date: Tue, 15 Oct 2024 09:26:00 GMT
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: PHP/7.4.3
Content-Type: text/html; charset=UTF-8
Link: </robots.txt>; rel="indexing-policy"`);
        } else {
          this.printLine(`<!DOCTYPE html>
<html>
<head><title>Acme Corp Internal Portal</title></head>
<body>
  <h1>Welcome to Acme Internal Portal</h1>
  <p>Authorized personnel only. All access logged.</p>
  <!-- NOTE: Remember to delete /robots.txt before deployment! -->
</body>
</html>`);
        }
        break;

      case 'hashcat':
        this.printLine(`hashcat (v6.2.6) starting...`);
        this.printLine(`Dictionary cache built: 14344391 words, 139.9MB`);
        this.printLine(`[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit =>`);
        this.printLine(`\n5f4dcc3b5aa765d61d8327deb882cf99:password\n`);
        this.printLine(`Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: 5f4dcc3b5aa765d61d8327deb882cf99
Time.Started.....: Tue Oct 15 09:26:30 2024 (1 sec)
Recovered........: 1/1 (100.00%) Digests`, 'success');
        this.printLine(`\n🔓 CRACKED PASSWORD: 'password'`, 'success');
        break;

      case 'matrix':
        this.runMatrixRain();
        break;

      default:
        window.cyberAudio.playErrorSound();
        this.printLine(`bash: ${cmd}: command not found. Type 'help' for available tools.`, 'error');
        break;
    }
  }

  runMatrixRain() {
    this.printLine(`[INITIALIZING MATRIX STREAM] Press any key or run 'clear' to exit.`, 'system');
    let cycles = 0;
    const interval = setInterval(() => {
      const chars = '0123456789ABCDEF!@#$%^&*()*&^%';
      let str = '';
      for (let i = 0; i < 48; i++) {
        str += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      this.printLine(str, 'system');
      cycles++;
      if (cycles > 15) {
        clearInterval(interval);
      }
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
});
