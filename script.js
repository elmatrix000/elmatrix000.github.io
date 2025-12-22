// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initMatrixBackground();
    initNavigation();
    initLiveClock();
    initThreatMap();
    initTerminal();
    loadCVEList();
    simulateLiveData();
    initCommandHistory();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// ===== MATRIX BACKGROUND =====
function initMatrixBackground() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ";
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        
        for(let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(char, x, y);
            
            if(y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// ===== NAVIGATION =====
function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Navigation click handling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            document.querySelectorAll('.terminal-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
}

// ===== LIVE CLOCK =====
function initLiveClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toUTCString().split(' ')[4];
        document.getElementById('liveTime').textContent = `${timeStr} UTC`;
        
        // Add random log entry occasionally
        if(Math.random() > 0.95) {
            addLogEntry(generateRandomLog(), ['info', 'warning', 'success'][Math.floor(Math.random() * 3)]);
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== THREAT MAP =====
function initThreatMap() {
    const threatMap = document.getElementById('threatMap');
    const threatCount = Math.floor(window.innerWidth / 50);
    
    for(let i = 0; i < threatCount; i++) {
        const threat = document.createElement('div');
        threat.className = 'threat-dot';
        threat.style.left = `${Math.random() * 100}%`;
        threat.style.top = `${Math.random() * 100}%`;
        threat.style.animationDelay = `${Math.random() * 5}s`;
        threatMap.appendChild(threat);
    }
}

// ===== TERMINAL SYSTEM =====
function initTerminal() {
    const terminalInput = document.getElementById('terminalCommand');
    terminalInput.focus();
}

function initCommandHistory() {
    const history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
    return history;
}

function addToHistory(command) {
    const history = initCommandHistory();
    history.push({
        command: command,
        timestamp: new Date().toISOString(),
        output: executeCommand(command)
    });
    
    if(history.length > 50) history.shift();
    localStorage.setItem('terminalHistory', JSON.stringify(history));
}

function handleTerminalCommand(event) {
    if(event.key === 'Enter') {
        const command = event.target.value.trim();
        if(command) {
            addToHistory(command);
            event.target.value = '';
            
            // Display command output
            const output = executeCommand(command);
            addLogEntry(`$ ${command}\n${output}`, 'info');
        }
    } else if(event.key === 'ArrowUp') {
        // Navigate command history
        event.preventDefault();
    }
}

function executeCommand(command) {
    const cmd = command.toLowerCase().split(' ')[0];
    const args = command.split(' ').slice(1);
    
    const commands = {
        'help': `
Available Commands:
  help                    - Show this help message
  clear                   - Clear terminal
  scan <target>           - Start port scan
  hash <text>             - Generate MD5 hash
  encrypt <text>          - Encrypt text
  decrypt <text>          - Decrypt text
  status                  - Show system status
  whoami                  - Show current user
  date                    - Show current date/time
  echo <text>             - Echo text back
  ls                      - List files (simulated)
  pwd                     - Print working directory
        `,
        'clear': () => {
            document.getElementById('securityLog').innerHTML = '';
            return 'Log cleared.';
        },
        'scan': (target) => {
            return `Scanning ${target || 'localhost'}...\nPort 22: OPEN (SSH)\nPort 80: OPEN (HTTP)\nPort 443: OPEN (HTTPS)\nScan complete.`;
        },
        'hash': (text) => {
            if(!text) return 'Usage: hash <text>';
            return `MD5: ${btoa(text).substring(0, 32)}\nSHA-256: ${btoa(text + 'salt').substring(0, 64)}`;
        },
        'status': () => {
            return `System Status:\nUptime: 7d 3h 15m\nCPU: ${(Math.random() * 30 + 10).toFixed(1)}%\nRAM: ${(Math.random() * 40 + 20).toFixed(1)}%\nThreats: ${document.getElementById('activeThreats').textContent}`;
        },
        'whoami': () => 'elmatrix000@matrixvogue-cloud',
        'date': () => new Date().toString(),
        'echo': (text) => text || '',
        'ls': () => 'README.md  tools/  config/  logs/  projects/',
        'pwd': () => '/home/elmatrix000/matrixvogue-cloud'
    };
    
    if(commands[cmd]) {
        if(typeof commands[cmd] === 'function') {
            return commands[cmd](args.join(' '));
        }
        return commands[cmd];
    }
    
    return `Command not found: ${cmd}\nType 'help' for available commands.`;
}

// ===== SECURITY FUNCTIONS =====
function refreshDashboard() {
    document.querySelectorAll('.stat-value').forEach(stat => {
        const current = parseInt(stat.textContent) || 0;
        const change = Math.floor(Math.random() * 10) - 3;
        const newValue = Math.max(0, current + change);
        stat.textContent = stat.id === 'secureSystems' || stat.id === 'networkHealth' ? 
            `${newValue}%` : newValue;
    });
    
    addLogEntry('Dashboard refreshed with latest data', 'info');
}

function clearLogs() {
    document.getElementById('securityLog').innerHTML = '';
    addLogEntry('Logs cleared by user', 'warning');
}

function pauseLogs() {
    // Implementation for pausing log updates
    addLogEntry('Live log updates paused', 'warning');
}

function exportLogs() {
    const logs = document.getElementById('securityLog').innerText;
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLogEntry('Logs exported successfully', 'success');
}

function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('securityLog');
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-message">${message}</span>
    `;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Keep only last 100 entries
    if(logContainer.children.length > 100) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

function generateRandomLog() {
    const actions = [
        'Firewall rule applied',
        'Intrusion attempt blocked',
        'Malware signature updated',
        'System vulnerability patched',
        'Unauthorized access attempt',
        'DDoS attack mitigated',
        'Data exfiltration detected',
        'Security policy updated',
        'Backup completed',
        'Network scan initiated'
    ];
    
    const sources = [
        'Internal Network',
        'External IP',
        'VPN Tunnel',
        'DMZ Zone',
        'Cloud Instance'
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    return `${action} from ${source} (${ip})`;
}

// ===== TOOL FUNCTIONS =====
function analyzePasswordAdvanced() {
    const password = document.getElementById('passwordInput').value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthLabel = document.getElementById('strengthLabel');
    const lengthScore = document.getElementById('lengthScore');
    const complexityScore = document.getElementById('complexityScore');
    const entropyScore = document.getElementById('entropyScore');
    
    if(!password) {
        addLogEntry('Password analysis: No input provided', 'warning');
        return;
    }
    
    // Calculate metrics
    const length = password.length;
    let complexity = 0;
    if(/[A-Z]/.test(password)) complexity += 25;
    if(/[a-z]/.test(password)) complexity += 25;
    if(/[0-9]/.test(password)) complexity += 25;
    if(/[^A-Za-z0-9]/.test(password)) complexity += 25;
    
    // Calculate entropy (simplified)
    const charSetSize = (password.match(/[A-Z]/) ? 26 : 0) +
                       (password.match(/[a-z]/) ? 26 : 0) +
                       (password.match(/[0-9]/) ? 10 : 0) +
                       (password.match(/[^A-Za-z0-9]/) ? 32 : 0);
    const entropy = Math.log2(Math.pow(charSetSize || 1, length));
    
    // Calculate overall score
    let score = 0;
    if(length >= 8) score += 20;
    if(length >= 12) score += 20;
    if(length >= 16) score += 20;
    score += (complexity / 100) * 40;
    
    // Update display
    strengthBar.style.width = `${score}%`;
    lengthScore.textContent = length;
    complexityScore.textContent = `${complexity}%`;
    entropyScore.textContent = `${entropy.toFixed(1)} bits`;
    
    // Set strength label and color
    let label, color;
    if(score < 30) {
        label = 'VERY WEAK';
        color = '#ff5555';
    } else if(score < 50) {
        label = 'WEAK';
        color = '#ffaa00';
    } else if(score < 70) {
        label = 'MODERATE';
        color = '#ffff00';
    } else if(score < 85) {
        label = 'STRONG';
        color = '#00ff88';
    } else {
        label = 'VERY STRONG';
        color = '#00ff41';
    }
    
    strengthLabel.textContent = label;
    strengthBar.style.background = color;
    
    addLogEntry(`Password analyzed: ${length} chars, ${label}`, 'info');
}

function generateStrongPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const length = 16;
    
    for(let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    document.getElementById('passwordInput').value = password;
    analyzePasswordAdvanced();
    addLogEntry('Generated strong password', 'success');
}

function analyzeHash() {
    const hash = document.getElementById('hashInput').value.trim();
    const hashType = document.getElementById('hashType').value;
    const hashInfo = document.getElementById('hashInfo');
    
    if(!hash) {
        hashInfo.innerHTML = 'Please enter a hash to analyze';
        return;
    }
    
    const length = hash.length;
    let detectedType = 'Unknown';
    
    // Simple hash type detection
    if(length === 32 && /^[a-f0-9]{32}$/.test(hash)) detectedType = 'MD5';
    else if(length === 40 && /^[a-f0-9]{40}$/.test(hash)) detectedType = 'SHA-1';
    else if(length === 64 && /^[a-f0-9]{64}$/.test(hash)) detectedType = 'SHA-256';
    else if(length === 128 && /^[a-f0-9]{128}$/.test(hash)) detectedType = 'SHA-512';
    else if(length === 32 && /^[a-f0-9]{32}$/i.test(hash)) detectedType = 'NTLM';
    
    hashInfo.innerHTML = `
        Hash type: ${detectedType}<br>
        Length: ${length} characters<br>
        Format: ${/^[a-f0-9]+$/i.test(hash) ? 'Hexadecimal' : 'Base64/Other'}
    `;
    
    addLogEntry(`Hash analyzed: ${detectedType}, ${length} chars`, 'info');
}

function crackHash() {
    const hash = document.getElementById('hashInput').value;
    const hashInfo = document.getElementById('hashInfo');
    
    if(!hash) {
        hashInfo.innerHTML = 'Please enter a hash first';
        return;
    }
    
    hashInfo.innerHTML = 'Starting hash cracking simulation...<br>';
    
    // Simulate cracking process
    const words = ['password', '123456', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'qwerty'];
    let found = false;
    
    words.forEach((word, i) => {
        setTimeout(() => {
            const simulatedHash = btoa(word).substring(0, 32);
            hashInfo.innerHTML += `Trying: ${word}... ${simulatedHash}<br>`;
            
            if(!found && Math.random() > 0.7) {
                hashInfo.innerHTML += `<br><strong>POSSIBLE MATCH: "${word.toUpperCase()}"</strong><br>`;
                found = true;
                addLogEntry(`Hash crack attempt: Possible match found - ${word}`, 'warning');
            }
            
            if(i === words.length - 1 && !found) {
                hashInfo.innerHTML += '<br>No matches found in dictionary';
                addLogEntry('Hash crack attempt: No matches found', 'info');
            }
        }, i * 300);
    });
}

function startAdvancedScan() {
    const target = document.getElementById('scanTarget').value || 'localhost';
    const portStart = parseInt(document.getElementById('portStart').value) || 1;
    const portEnd = parseInt(document.getElementById('portEnd').value) || 1000;
    const scanResults = document.getElementById('scanResults');
    
    scanResults.innerHTML = `Starting advanced scan of ${target}...<br>`;
    
    // Common ports and their services
    const commonPorts = [
        {port: 21, service: 'FTP', status: Math.random() > 0.7},
        {port: 22, service: 'SSH', status: Math.random() > 0.5},
        {port: 23, service: 'Telnet', status: Math.random() > 0.8},
        {port: 25, service: 'SMTP', status: Math.random() > 0.6},
        {port: 53, service: 'DNS', status: Math.random() > 0.4},
        {port: 80, service: 'HTTP', status: Math.random() > 0.3},
        {port: 110, service: 'POP3', status: Math.random() > 0.7},
        {port: 143, service: 'IMAP', status: Math.random() > 0.7},
        {port: 443, service: 'HTTPS', status: Math.random() > 0.3},
        {port: 3306, service: 'MySQL', status: Math.random() > 0.8},
        {port: 3389, service: 'RDP', status: Math.random() > 0.9},
        {port: 5432, service: 'PostgreSQL', status: Math.random() > 0.8},
        {port: 8080, service: 'HTTP-ALT', status: Math.random() > 0.5}
    ];
    
    let openPorts = [];
    let scanProgress = 0;
    const totalPorts = portEnd - portStart + 1;
    
    // Simulate scanning animation
    const scanInterval = setInterval(() => {
        scanProgress += Math.floor(totalPorts / 20);
        if(scanProgress >= totalPorts) {
            clearInterval(scanInterval);
            
            // Show results
            commonPorts.forEach(p => {
                if(p.port >= portStart && p.port <= portEnd && p.status) {
                    openPorts.push(p);
                    scanResults.innerHTML += `[+] ${p.port}/tcp OPEN - ${p.service}<br>`;
                }
            });
            
            scanResults.innerHTML += `<br>Scan complete. Found ${openPorts.length} open ports.<br>`;
            scanResults.innerHTML += `Scan duration: ${(Math.random() * 5 + 2).toFixed(2)} seconds`;
            
            addLogEntry(`Port scan completed: ${target}, ${openPorts.length} open ports`, 
                       openPorts.length > 0 ? 'warning' : 'success');
        } else {
            const percent = Math.min(100, (scanProgress / totalPorts) * 100);
            scanResults.innerHTML = `Scanning ${target}... ${percent.toFixed(1)}%<br>`;
            scanResults.innerHTML += `Ports scanned: ${scanProgress}/${totalPorts}`;
        }
    }, 100);
}

function encryptText() {
    const text = document.getElementById('cryptoInput').value;
    const key = document.getElementById('cryptoKey').value || 'matrixvogue';
    const algorithm = document.getElementById('cryptoAlgorithm').value;
    
    if(!text) {
        addLogEntry('Encryption: No text provided', 'warning');
        return;
    }
    
    let result = '';
    
    switch(algorithm) {
        case 'aes':
            result = btoa(text + '|AES|' + key).substring(0, 128);
            break;
        case 'rsa':
            result = btoa('RSA|' + text + '|' + key).replace(/=/g, '');
            break;
        case 'blowfish':
            result = btoa('BLOWFISH|' + text.split('').reverse().join('') + '|' + key);
            break;
        case 'xor':
            let xorResult = '';
            for(let i = 0; i < text.length; i++) {
                xorResult += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            result = btoa(xorResult);
            break;
    }
    
    document.getElementById('cryptoInput').value = result;
    addLogEntry(`Text encrypted using ${algorithm.toUpperCase()}`, 'success');
}

function decryptText() {
    const text = document.getElementById('cryptoInput').value;
    const key = document.getElementById('cryptoKey').value || 'matrixvogue';
    const algorithm = document.getElementById('cryptoAlgorithm').value;
    
    if(!text) {
        addLogEntry('Decryption: No text provided', 'warning');
        return;
    }
    
    let result = '';
    
    try {
        switch(algorithm) {
            case 'aes':
                const aesDecoded = atob(text).split('|AES|');
                if(aesDecoded[1] === key) result = aesDecoded[0];
                break;
            case 'rsa':
                const rsaDecoded = atob(text + '===').split('|RSA|');
                if(rsaDecoded[2] === key) result = rsaDecoded[1];
                break;
            case 'blowfish':
                const bfDecoded = atob(text).split('|BLOWFISH|');
                if(bfDecoded[2] === key) result = bfDecoded[1].split('').reverse().join('');
                break;
            case 'xor':
                const xorDecoded = atob(text);
                for(let i = 0; i < xorDecoded.length; i++) {
                    result += String.fromCharCode(xorDecoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                }
                break;
        }
    } catch(e) {
        result = 'Decryption failed. Invalid key or ciphertext.';
    }
    
    document.getElementById('cryptoInput').value = result || 'Decryption failed';
    addLogEntry(`Text decrypted using ${algorithm.toUpperCase()}`, 
               result ? 'success' : 'warning');
}

// ===== CVE DATABASE =====
async function loadCVEList() {
    try {
        const response = await fetch('https://cve.circl.lu/api/last');
        const data = await response.json();
        const cveResults = document.getElementById('cveResults');
        
        if(data && data.length > 0) {
            let html = '<div class="cve-list">';
            data.slice(0, 10).forEach(cve => {
                html += `
                    <div class="cve-item">
                        <strong>${cve.id}</strong><br>
                        ${cve.summary.substring(0, 100)}...
                    </div>
                `;
            });
            html += '</div>';
            cveResults.innerHTML = html;
        }
    } catch(error) {
        // Fallback to simulated data
        document.getElementById('cveResults').innerHTML = `
            <div class="cve-list">
                <div class="cve-item"><strong>CVE-2023-1234</strong><br>Critical vulnerability in web framework</div>
                <div class="cve-item"><strong>CVE-2023-5678</strong><br>Remote code execution in database</div>
                <div class="cve-item"><strong>CVE-2023-9012</strong><br>Privilege escalation in OS kernel</div>
            </div>
        `;
    }
}

function searchCVE() {
    const query = document.getElementById('cveSearch').value;
    addLogEntry(`Searching for CVE: ${query}`, 'info');
    
    // Simulated search results
    document.getElementById('cveResults').innerHTML = `
        <div class="cve-search-results">
            <h4>Search Results for "${query}"</h4>
            <div class="cve-item">
                <strong>CVE-2023-${Math.floor(Math.random() * 10000)}</strong><br>
                Vulnerability related to ${query}
            </div>
        </div>
    `;
}

// ===== SIMULATED LIVE DATA =====
function simulateLiveData() {
    setInterval(() => {
        // Update threat count randomly
        const threats = document.getElementById('activeThreats');
        const current = parseInt(threats.textContent) || 0;
        const change = Math.floor(Math.random() * 5) - 2;
        threats.textContent = Math.max(0, current + change);
        
        // Occasionally add random log
        if(Math.random() > 0.9) {
            addLogEntry(generateRandomLog(), ['info', 'warning'][Math.floor(Math.random() * 2)]);
        }
    }, 5000);
}

// ===== QUICK ACTIONS =====
function runPortScan() {
    startAdvancedScan();
    addLogEntry('Quick action: Port scan initiated', 'info');
}

function checkVulnerability() {
    const target = document.getElementById('scanTarget').value || 'localhost';
    addLogEntry(`Vulnerability scan initiated for ${target}`, 'warning');
    
    // Simulated vulnerability scan
    setTimeout(() => {
        const vulnerabilities = ['SQL Injection', 'XSS', 'CSRF', 'Command Injection'];
        const randomVuln = vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
        addLogEntry(`Vulnerability found: ${randomVuln} on ${target}`, 'critical');
    }, 2000);
}

function analyzeTraffic() {
    addLogEntry('Traffic analysis started', 'info');
    
    // Simulated traffic analysis
    setTimeout(() => {
        const analysis = {
            packets: Math.floor(Math.random() * 10000),
            threats: Math.floor(Math.random() * 10),
            bandwidth: (Math.random() * 100).toFixed(1) + ' Mbps'
        };
        
        addLogEntry(`Traffic analysis complete: ${analysis.packets} packets, ${analysis.threats} threats detected`, 
                   analysis.threats > 0 ? 'warning' : 'success');
    }, 3000);
}

function checkFirewall() {
    addLogEntry('Firewall integrity check initiated', 'info');
    
    // Simulated firewall check
    setTimeout(() => {
        const status = Math.random() > 0.1 ? 'All rules active and functioning' : 'Rule conflict detected';
        addLogEntry(`Firewall check: ${status}`, 
                   status.includes('conflict') ? 'warning' : 'success');
    }, 1500);
}

function encryptData() {
    const sampleData = 'Sensitive security data requiring encryption';
    document.getElementById('cryptoInput').value = sampleData;
    encryptText();
    addLogEntry('Quick encryption applied to sample data', 'success');
}

function decryptData() {
    decryptText();
    addLogEntry('Quick decryption attempted', 'info');
}

// Add remaining CSS for new elements
const additionalCSS = `
.threat-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--critical);
    border-radius: 50%;
    animation: pulse 1s infinite;
    opacity: 0.7;
}

.cve-list {
    max-height: 300px;
    overflow-y: auto;
}

.cve-item {
    padding: 0.8rem;
    border-bottom: 1px solid rgba(0, 255, 65, 0.1);
    font-size: 0.9rem;
}

.cve-item:last-child {
    border-bottom: none;
}

.cve-item:hover {
    background: rgba(0, 255, 65, 0.05);
}

.cve-search-results {
    padding: 1rem;
}

.darkweb-feed {
    padding: 1rem;
    font-size: 0.85rem;
    line-height: 1.6;
}

.search-input {
    width: 100%;
    padding: 0.8rem;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--matrix-green);
    color: var(--text-primary);
    border-radius: 4px 0 0 4px;
    font-family: inherit;
}

.search-btn {
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid var(--matrix-green);
    color: var(--matrix-green);
    padding: 0.8rem 1.5rem;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-family: inherit;
}

.search-btn:hover {
    background: var(--matrix-green);
    color: #000;
}

.intel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.intel-card {
    background: var(--card-bg);
    border: 1px solid var(--terminal-border);
    border-radius: 8px;
    padding: 1.5rem;
}

.intel-search {
    display: flex;
    margin: 1rem 0;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
