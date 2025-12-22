// ===== GAME STATE =====
const GameState = {
    player: {
        name: 'GOTH',
        resonance: 0.3,
        chakras: {
            root: 0,
            sacral: 0,
            solar: 0,
            heart: 0,
            throat: 0,
            thirdEye: 0,
            crown: 0
        },
        discoveries: [],
        connections: [],
        activeFilters: [],
        inventory: []
    },
    
    story: {
        currentAct: 1,
        currentMission: 'boot_sequence',
        completedObjectives: [],
        unlockedApps: ['terminal'],
        unlockedFilters: [],
        cubeProximity: Infinity
    },
    
    system: {
        time: new Date(),
        signalStrength: 0.07,
        encryptionLevel: 'QUANTUM',
        activeWindows: [],
        notifications: []
    },
    
    world: {
        discoveredEntities: [],
        mappedLocations: [],
        decodedFrequencies: [],
        translatedGlyphs: []
    }
};

// ===== CORE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('[SYSTEM] Initializing GothAlienBoy Protocol...');
    
    // Initialize subsystems
    initMatrixBackground();
    initCubeParticles();
    initLiveClock();
    initBootSequence();
    initDesktop();
    initAudioSystem();
    
    // Load saved game
    loadGameState();
    
    // Start ambient systems
    startAmbientSystems();
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
    
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for(let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        
        for(let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// ===== CUBE PARTICLES =====
function initCubeParticles() {
    const container = document.getElementById('cubeParticles');
    const particleCount = 50;
    
    for(let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cube-particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size and color
        const size = 2 + Math.random() * 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const hue = 270 + Math.random() * 60; // Purple to blue
        particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        
        // Random animation
        const duration = 15 + Math.random() * 25;
        const delay = Math.random() * 20;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// ===== LIVE CLOCK =====
function initLiveClock() {
    function updateClock() {
        const now = new Date();
        
        // Format time
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).toUpperCase();
        
        // Update displays
        document.getElementById('liveClock').textContent = timeStr;
        document.getElementById('liveDate').textContent = dateStr;
        document.getElementById('systemTime').querySelector('.time').textContent = 
            timeStr.split(':').slice(0, 2).join(':');
        document.getElementById('systemTime').querySelector('.date').textContent = 
            dateStr.split(' ').slice(1).join(' ');
        
        // Update game state
        GameState.system.time = now;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== BOOT SEQUENCE =====
function initBootSequence() {
    const bootScreen = document.getElementById('bootScreen');
    const bootProgress = document.getElementById('bootProgress');
    const bootProgressText = document.getElementById('bootProgressText');
    const bootLines = [
        { id: 'bootLine1', text: 'Initializing consciousness interface...', duration: 1000 },
        { id: 'bootLine2', text: 'Syncing bio-rhythms...', duration: 1500 },
        { id: 'bootLine3', text: 'Loading perception filters...', duration: 1200 },
        { id: 'bootLine4', text: 'Establishing quantum encryption...', duration: 1800 },
        { id: 'bootLine5', text: 'Connecting to Resonance Network...', duration: 2000 },
        { id: 'bootLine6', text: 'Calibrating Cube proximity sensors...', duration: 1600 },
        { id: 'bootLine7', text: 'Authenticating user: GOTH...', duration: 1400 },
        { id: 'bootLine8', text: 'Loading primary mission protocols...', duration: 2200 }
    ];
    
    let currentLine = 0;
    let totalDuration = bootLines.reduce((sum, line) => sum + line.duration, 0);
    let elapsed = 0;
    
    function updateBootLine() {
        if (currentLine >= bootLines.length) {
            completeBootSequence();
            return;
        }
        
        const line = bootLines[currentLine];
        const lineElement = document.getElementById(line.id);
        
        if (lineElement) {
            // Update status
            const status = lineElement.querySelector('.boot-status');
            status.textContent = 'DONE';
            status.classList.add('success');
            
            // Update progress
            elapsed += line.duration;
            const progress = (elapsed / totalDuration) * 100;
            bootProgress.style.width = `${progress}%`;
            bootProgressText.textContent = `${Math.round(progress)}%`;
            
            // Start next line
            currentLine++;
            if (currentLine < bootLines.length) {
                const nextLine = bootLines[currentLine];
                const nextElement = document.getElementById(nextLine.id);
                if (nextElement) {
                    nextElement.querySelector('.boot-status').textContent = '...';
                }
                setTimeout(updateBootLine, line.duration);
            } else {
                setTimeout(completeBootSequence, 1000);
            }
        }
    }
    
    function completeBootSequence() {
        bootProgress.style.width = '100%';
        bootProgressText.textContent = '100%';
        
        // Fade out boot screen
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                bootScreen.style.display = 'none';
                startGame();
            }, 1000);
        }, 500);
    }
    
    // Start boot sequence
    setTimeout(updateBootLine, 500);
}

// ===== DESKTOP INITIALIZATION =====
function initDesktop() {
    // Desktop icons click handlers
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            openApp(app);
        });
        
        icon.addEventListener('dblclick', function() {
            const app = this.getAttribute('data-app');
            openApp(app, { maximized: true });
        });
    });
    
    // Start button
    document.getElementById('startBtn').addEventListener('click', function() {
        const startMenu = document.getElementById('startMenu');
        startMenu.classList.toggle('active');
    });
    
    // Start menu apps
    document.querySelectorAll('.start-app').forEach(app => {
        app.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            openApp(appName);
            document.getElementById('startMenu').classList.remove('active');
        });
    });
    
    // Power button
    document.getElementById('powerBtn').addEventListener('click', function() {
        if (confirm('Shut down GothAlienBoy Protocol?\n\nAll unsaved progress will be encrypted.')) {
            saveGameState();
            document.body.innerHTML = `
                <div style="
                    background: #000;
                    color: #0f0;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: monospace;
                    font-size: 1.2rem;
                ">
                    <div style="text-align: center;">
                        <div style="margin-bottom: 2rem;">[ SYSTEM SHUTDOWN COMPLETE ]</div>
                        <div>"The Cube still watches..."</div>
                    </div>
                </div>
            `;
        }
    });
    
    // Toolbar buttons
    document.getElementById('perceptionFilterBtn').addEventListener('click', function() {
        openApp('perceptionFilters');
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', function(event) {
        const startMenu = document.getElementById('startMenu');
        const startBtn = document.getElementById('startBtn');
        
        if (!startMenu.contains(event.target) && !startBtn.contains(event.target)) {
            startMenu.classList.remove('active');
        }
    });
}

// ===== APP MANAGEMENT =====
function openApp(appName, options = {}) {
    console.log(`[APP] Opening ${appName}`, options);
    
    const appConfig = {
        terminal: {
            title: 'PRIMARY TERMINAL',
            icon: 'terminal',
            width: 700,
            height: 500,
            content: getTerminalContent()
        },
        freqScanner: {
            title: 'FREQUENCY SCANNER',
            icon: 'wave-square',
            width: 600,
            height: 400,
            content: getFreqScannerContent()
        },
        dreamLog: {
            title: 'DREAM LOG',
            icon: 'moon',
            width: 550,
            height: 450,
            content: getDreamLogContent()
        },
        socialGraph: {
            title: 'SOCIAL GRAPH ANALYZER',
            icon: 'project-diagram',
            width: 800,
            height: 600,
            content: getSocialGraphContent()
        },
        cubeInterface: {
            title: 'CUBE INTERFACE v0.7.3',
            icon: 'cube',
            width: 500,
            height: 400,
            content: getCubeInterfaceContent()
        },
        perceptionFilters: {
            title: 'PERCEPTION FILTERS',
            icon: 'eye',
            width: 400,
            height: 300,
            content: getPerceptionFiltersContent()
        }
    };
    
    const config = appConfig[appName];
    if (!config) {
        console.error(`[APP] Unknown app: ${appName}`);
        return;
    }
    
    // Check if app is unlocked
    if (!GameState.story.unlockedApps.includes(appName) && appName !== 'terminal') {
        showNotification('ACCESS DENIED', `App "${appName}" is locked. Complete missions to unlock.`, 'warning');
        return;
    }
    
    // Create window
    createWindow({
        id: `window_${appName}_${Date.now()}`,
        title: config.title,
        icon: config.icon,
        width: options.width || config.width,
        height: options.height || config.height,
        content: config.content,
        maximized: options.maximized || false
    });
    
    // Add to taskbar
    addToTaskbar(appName, config.title, config.icon);
}

function createWindow(config) {
    const windowContainer = document.getElementById('windowContainer');
    
    // Create window element
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = config.id;
    windowEl.style.width = `${config.width}px`;
    windowEl.style.height = `${config.height}px`;
    windowEl.style.left = `${50 + Math.random() * 100}px`;
    windowEl.style.top = `${50 + Math.random() * 100}px`;
    
    if (config.maximized) {
        windowEl.classList.add('maximized');
        windowEl.style.width = 'calc(100vw - 40px)';
        windowEl.style.height = 'calc(100vh - 140px)';
        windowEl.style.left = '20px';
        windowEl.style.top = '60px';
    }
    
    // Window header
    windowEl.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <i class="fas fa-${config.icon}"></i>
                ${config.title}
            </div>
            <div class="window-controls">
                <button class="win-btn minimize" onclick="minimizeWindow('${config.id}')">
                    <i class="fas fa-window-minimize"></i>
                </button>
                <button class="win-btn maximize" onclick="toggleMaximize('${config.id}')">
                    <i class="fas fa-window-maximize"></i>
                </button>
                <button class="win-btn close" onclick="closeWindow('${config.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="window-body">
            ${config.content}
        </div>
    `;
    
    // Add to container and make active
    windowContainer.appendChild(windowEl);
    makeWindowActive(config.id);
    
    // Make draggable
    makeDraggable(windowEl);
    
    // Add to game state
    GameState.system.activeWindows.push({
        id: config.id,
        app: config.title.toLowerCase().replace(/\s+/g, '_'),
        zIndex: GameState.system.activeWindows.length + 1
    });
    
    return windowEl;
}

function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    header.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        if (e.target.closest('.window-controls')) return;
        
        isDragging = true;
        initialX = e.clientX - element.offsetLeft;
        initialY = e.clientY - element.offsetTop;
        
        makeWindowActive(element.id);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // Boundary check
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight - 50; // Account for taskbar
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
}

function makeWindowActive(windowId) {
    // Update z-index for all windows
    document.querySelectorAll('.window').forEach((win, index) => {
        win.style.zIndex = win.id === windowId ? 1000 : 100 + index;
        win.classList.toggle('active', win.id === windowId);
    });
    
    // Update game state
    const windowIndex = GameState.system.activeWindows.findIndex(w => w.id === windowId);
    if (windowIndex > -1) {
        const [window] = GameState.system.activeWindows.splice(windowIndex, 1);
        GameState.system.activeWindows.push(window);
    }
}

function closeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.style.opacity = '0';
        windowEl.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            windowEl.remove();
            
            // Remove from game state
            GameState.system.activeWindows = GameState.system.activeWindows.filter(w => w.id !== windowId);
            
            // Remove from taskbar
            const taskbarItem = document.querySelector(`.taskbar-app[data-window="${windowId}"]`);
            if (taskbarItem) {
                taskbarItem.remove();
            }
        }, 300);
    }
}

function minimizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.style.display = 'none';
        
        // Just hide, don't remove from taskbar
        // Player can click taskbar icon to restore
    }
}

function toggleMaximize(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        if (windowEl.classList.contains('maximized')) {
            // Restore
            windowEl.classList.remove('maximized');
            windowEl.style.width = '700px';
            windowEl.style.height = '500px';
            windowEl.style.left = '100px';
            windowEl.style.top = '100px';
        } else {
            // Maximize
            windowEl.classList.add('maximized');
            windowEl.style.width = 'calc(100vw - 40px)';
            windowEl.style.height = 'calc(100vh - 140px)';
            windowEl.style.left = '20px';
            windowEl.style.top = '60px';
        }
    }
}

function addToTaskbar(appName, title, icon) {
    const taskbarApps = document.getElementById('taskbarApps');
    const windowId = `window_${appName}_${Date.now()}`;
    
    // Check if already in taskbar
    if (document.querySelector(`.taskbar-app[data-app="${appName}"]`)) return;
    
    const appEl = document.createElement('div');
    appEl.className = 'taskbar-app';
    appEl.setAttribute('data-app', appName);
    appEl.setAttribute('data-window', windowId);
    appEl.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${title.substring(0, 15)}${title.length > 15 ? '...' : ''}</span>
    `;
    
    appEl.addEventListener('click', function() {
        const targetWindow = document.getElementById(windowId);
        if (targetWindow) {
            if (targetWindow.style.display === 'none') {
                targetWindow.style.display = 'block';
                makeWindowActive(windowId);
            } else {
                makeWindowActive(windowId);
            }
        }
    });
    
    taskbarApps.appendChild(appEl);
}

// ===== APP CONTENT GENERATORS =====
function getTerminalContent() {
    return `
        <div class="terminal-app">
            <div class="terminal-output" id="terminalOutput">
                <div class="terminal-line">
                    <span class="prompt">goth@cube:~$</span>
                    <span class="command">system_status --full</span>
                </div>
                <div class="terminal-response">
                    === SYSTEM STATUS ===<br>
                    User: GOTH [CONSCIOUSNESS_HYBRID]<br>
                    Resonance: ${GameState.player.resonance.toFixed(1)}%<br>
                    Cube Proximity: ${GameState.story.cubeProximity === Infinity ? '∞' : GameState.story.cubeProximity.toFixed(2)}<br>
                    Active Filters: ${GameState.player.activeFilters.length}<br>
                    Discovered Entities: ${GameState.world.discoveredEntities.length}<br>
                    <br>
                    === ACTIVE MISSIONS ===<br>
                    1. Complete boot sequence [IN PROGRESS]<br>
                    2. Decode first frequency [LOCKED]<br>
                    3. Establish first connection [LOCKED]<br>
                </div>
                <div class="terminal-line">
                    <span class="prompt">goth@cube:~$</span>
                    <span class="cursor">█</span>
                </div>
            </div>
            <div class="terminal-input">
                <input type="text" id="terminalInput" placeholder="Type 'help' for commands..." autocomplete="off">
                <button onclick="executeTerminalCommand()">EXECUTE</button>
            </div>
            <div class="terminal-help" id="terminalHelp" style="display: none;">
                <strong>Available Commands:</strong><br>
                • help - Show this help<br>
                • clear - Clear terminal<br>
                • status - Show system status<br>
                • scan [target] - Scan for frequencies<br>
                • decode [frequency] - Decode captured frequency<br>
                • connect [entity] - Attempt connection<br>
                • filters - Manage perception filters<br>
                • missions - Show available missions<br>
            </div>
        </div>
        
        <script>
        function executeTerminalCommand() {
            const input = document.getElementById('terminalInput');
            const command = input.value.trim().toLowerCase();
            const output = document.getElementById('terminalOutput');
            
            if (!command) return;
            
            // Add command to output
            output.innerHTML += \`
                <div class="terminal-line">
                    <span class="prompt">goth@cube:~$</span>
                    <span class="command">\${command}</span>
                </div>
            \`;
            
            // Process command
            let response = '';
            const args = command.split(' ');
            
            switch(args[0]) {
                case 'help':
                    document.getElementById('terminalHelp').style.display = 'block';
                    break;
                case 'clear':
                    output.innerHTML = '';
                    break;
                case 'status':
                    response = \`=== REAL-TIME STATUS ===<br>
                    Time: \${new Date().toLocaleTimeString()}<br>
                    Signal: \${(GameState.system.signalStrength * 100).toFixed(1)}%<br>
                    Encryption: \${GameState.system.encryptionLevel}<br>
                    Active Windows: \${GameState.system.activeWindows.length}<br>\`;
                    break;
                case 'scan':
                    if (args[1]) {
                        response = \`Scanning \${args[1]}...<br>
                        [STATUS] Found 3 anomalous frequencies<br>
                        [TIP] Use 'decode [id]' to analyze\`;
                        // Game logic: add frequencies to world state
                    } else {
                        response = 'Usage: scan [target]<br>Example: scan social_media_feed';
                    }
                    break;
                default:
                    response = \`Unknown command: \${args[0]}<br>Type 'help' for available commands.\`;
            }
            
            if (response) {
                output.innerHTML += \`<div class="terminal-response">\${response}</div>\`;
            }
            
            // Add new prompt
            output.innerHTML += \`
                <div class="terminal-line">
                    <span class="prompt">goth@cube:~$</span>
                    <span class="cursor">█</span>
                </div>
            \`;
            
            // Clear input and scroll to bottom
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
        
        // Enter key support
        document.getElementById('terminalInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') executeTerminalCommand();
        });
        </script>
        
        <style>
        .terminal-app {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .terminal-output {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #00ff41;
            border-radius: 4px;
            padding: 1rem;
            overflow-y: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .terminal-line {
            margin-bottom: 0.5rem;
        }
        .prompt {
            color: #00ff41;
        }
        .command {
            color: #ffffff;
        }
        .terminal-response {
            color: #00ffff;
            margin: 0.5rem 0 1rem 1.5rem;
            line-height: 1.4;
        }
        .cursor {
            animation: blink 1s infinite;
            color: #00ff41;
        }
        .terminal-input {
            display: flex;
            gap: 0.5rem;
        }
        .terminal-input input {
            flex: 1;
            padding: 0.8rem;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ff41;
            color: #ffffff;
            font-family: inherit;
            border-radius: 4px;
        }
        .terminal-input button {
            padding: 0.8rem 1.5rem;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            color: #00ff41;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
        }
        .terminal-help {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 30, 0, 0.3);
            border: 1px solid #00ff41;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        </style>
    `;
}

function getFreqScannerContent() {
    return `
        <div class="freq-scanner">
            <div class="scanner-header">
                <h3><i class="fas fa-satellite-dish"></i> ACTIVE FREQUENCY SCAN</h3>
                <div class="scanner-controls">
                    <button class="scan-btn" onclick="startFrequencyScan()">
                        <i class="fas fa-play"></i> START SCAN
                    </button>
                    <button class="scan-btn" onclick="stopFrequencyScan()">
                        <i class="fas fa-stop"></i> STOP
                    </button>
                </div>
            </div>
            
            <div class="scanner-visualization">
                <div class="spectrum-display" id="spectrumDisplay">
                    <!-- Frequency visualization will be drawn here -->
                </div>
                <div class="frequency-readout">
                    <div class="readout-item">
                        <span>Current Freq:</span>
                        <span id="currentFreq">--.-- MHz</span>
                    </div>
                    <div class="readout-item">
                        <span>Signal Strength:</span>
                        <span id="freqStrength">--%</span>
                    </div>
                    <div class="readout-item">
                        <span>Anomalies Detected:</span>
                        <span id="anomalyCount">0</span>
                    </div>
                </div>
            </div>
            
            <div class="detected-frequencies">
                <h4><i class="fas fa-exclamation-triangle"></i> ANOMALOUS FREQUENCIES</h4>
                <div class="freq-list" id="freqList">
                    <div class="no-frequencies">No anomalies detected yet. Start scanning.</div>
                </div>
            </div>
            
            <div class="scanner-log">
                <h4><i class="fas fa-clipboard-list"></i> SCAN LOG</h4>
                <div class="log-entries" id="scanLog">
                    <div class="log-entry">[${new Date().toLocaleTimeString()}] Scanner initialized</div>
                </div>
            </div>
        </div>
        
        <script>
        let scanInterval = null;
        const anomalies = [
            { freq: '433.92 MHz', strength: '78%', type: 'DATA_STREAM', description: 'Encrypted social media sentiment feed' },
            { freq: '2.437 GHz', strength: '92%', type: 'CONTROL_SIGNAL', description: 'Cube proximity beacon' },
            { freq: '114.7 MHz', strength: '65%', type: 'BIO_FEEDBACK', description: 'Collective anxiety frequency' },
            { freq: '7.83 Hz', strength: '99%', type: 'EARTH_RESONANCE', description: 'Schumann resonance - amplified' }
        ];
        
        function startFrequencyScan() {
            if (scanInterval) return;
            
            addLogEntry('Starting full spectrum scan...');
            document.getElementById('anomalyCount').textContent = '0';
            
            let currentIndex = 0;
            scanInterval = setInterval(() => {
                // Update visualization
                const spectrum = document.getElementById('spectrumDisplay');
                const freq = 20 + Math.random() * 3000;
                const strength = 30 + Math.random() * 70;
                
                document.getElementById('currentFreq').textContent = freq.toFixed(2) + ' MHz';
                document.getElementById('freqStrength').textContent = strength.toFixed(1) + '%';
                
                // Randomly detect anomalies
                if (Math.random() > 0.7 && currentIndex < anomalies.length) {
                    const anomaly = anomalies[currentIndex];
                    addAnomaly(anomaly);
                    currentIndex++;
                    
                    document.getElementById('anomalyCount').textContent = currentIndex;
                    addLogEntry(\`Detected anomaly: \${anomaly.freq} (\${anomaly.type})\`);
                    
                    // Unlock decode ability after first anomaly
                    if (currentIndex === 1) {
                        addLogEntry('[SYSTEM] Decode module unlocked. Use Terminal to decode frequencies.', 'system');
                    }
                }
                
                // Visual update
                updateSpectrumVisualization(freq, strength);
                
            }, 500);
            
            addLogEntry('Scan active. Monitoring for anomalous patterns...');
        }
        
        function stopFrequencyScan() {
            if (scanInterval) {
                clearInterval(scanInterval);
                scanInterval = null;
                addLogEntry('Scan stopped.');
            }
        }
        
        function addAnomaly(anomaly) {
            const freqList = document.getElementById('freqList');
            
            if (freqList.querySelector('.no-frequencies')) {
                freqList.innerHTML = '';
            }
            
            const anomalyEl = document.createElement('div');
            anomalyEl.className = 'frequency-item';
            anomalyEl.innerHTML = \`
                <div class="freq-info">
                    <strong>\${anomaly.freq}</strong>
                    <span class="freq-type \${anomaly.type.toLowerCase()}">\${anomaly.type}</span>
                </div>
                <div class="freq-desc">\${anomaly.description}</div>
                <div class="freq-strength">
                    <div class="strength-bar">
                        <div class="strength-fill" style="width: \${anomaly.strength}"></div>
                    </div>
                    <span>\${anomaly.strength}</span>
                </div>
                <button class="decode-btn" onclick="decodeFrequency('\${anomaly.freq}')">
                    <i class="fas fa-code"></i> DECODE
                </button>
            \`;
            
            freqList.appendChild(anomalyEl);
        }
        
        function addLogEntry(message, type = 'info') {
            const log = document.getElementById('scanLog');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.innerHTML = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
        
        function updateSpectrumVisualization(freq, strength) {
            const spectrum = document.getElementById('spectrumDisplay');
            // Simple bar visualization
            const bar = document.createElement('div');
            bar.className = 'spectrum-bar';
            bar.style.height = strength + '%';
            bar.style.width = '2px';
            bar.style.background = strength > 80 ? '#ff5555' : strength > 60 ? '#ffaa00' : '#00ff41';
            bar.style.margin = '0 1px';
            bar.style.display = 'inline-block';
            
            spectrum.appendChild(bar);
            
            // Keep only last 100 bars
            if (spectrum.children.length > 100) {
                spectrum.removeChild(spectrum.firstChild);
            }
        }
        
        function decodeFrequency(freq) {
            addLogEntry(\`Attempting to decode \${freq}...\`, 'warning');
            // This would trigger a puzzle/mini-game in the actual implementation
        }
        </script>
        
        <style>
        .freq-scanner {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .scanner-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 255, 65, 0.3);
        }
        .scanner-controls {
            display: flex;
            gap: 0.5rem;
        }
        .scan-btn {
            padding: 0.5rem 1rem;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            color: #00ff41;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .scanner-visualization {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ff41;
            border-radius: 6px;
            padding: 1rem;
        }
        .spectrum-display {
            height: 100px;
            background: rgba(0, 10, 0, 0.7);
            border: 1px solid #003b00;
            border-radius: 4px;
            margin-bottom: 1rem;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
        }
        .frequency-readout {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        .readout-item {
            background: rgba(0, 20, 0, 0.5);
            padding: 0.8rem;
            border-radius: 4px;
            border: 1px solid rgba(0, 255, 65, 0.2);
        }
        .readout-item span:first-child {
            color: #888;
            font-size: 0.9rem;
            display: block;
            margin-bottom: 0.3rem;
        }
        .readout-item span:last-child {
            color: #00ff41;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
        }
        .detected-frequencies, .scanner-log {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .detected-frequencies h4, .scanner-log h4 {
            margin-bottom: 0.8rem;
            color: #00ff88;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .freq-list, .log-entries {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 255, 65, 0.2);
            border-radius: 4px;
            padding: 1rem;
            overflow-y: auto;
        }
        .frequency-item {
            background: rgba(0, 30, 0, 0.3);
            border: 1px solid rgba(0, 255, 65, 0.3);
            border-radius: 4px;
            padding: 1rem;
            margin-bottom: 0.8rem;
        }
        .freq-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .freq-type {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
        }
        .freq-type.data_stream { background: rgba(0, 128, 255, 0.2); color: #0080ff; }
        .freq-type.control_signal { background: rgba(255, 0, 255, 0.2); color: #ff00ff; }
        .freq-type.bio_feedback { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
        .freq-type.earth_resonance { background: rgba(255, 170, 0, 0.2); color: #ffaa00; }
        .freq-strength {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 0.5rem 0;
        }
        .strength-bar {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        .strength-fill {
            height: 100%;
            background: #00ff41;
            border-radius: 3px;
        }
        .decode-btn {
            width: 100%;
            padding: 0.5rem;
            background: rgba(157, 0, 255, 0.1);
            border: 1px solid #9d00ff;
            color: #9d00ff;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .log-entries {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
        }
        .log-entry {
            padding: 0.3rem 0;
            border-bottom: 1px solid rgba(0, 255, 65, 0.1);
        }
        .log-entry:last-child {
            border-bottom: none;
        }
        .log-entry.system {
            color: #00ffff;
        }
        .log-entry.warning {
            color: #ffaa00;
        }
        .no-frequencies {
            text-align: center;
            color: #888;
            padding: 2rem;
        }
        </style>
    `;
}

// Other app content generators would follow similar patterns...

// ===== GAME SYSTEMS =====
function startGame() {
    console.log('[GAME] Starting GothAlienBoy and the Black Cube...');
    
    // Show welcome notification
    showNotification('SYSTEM ONLINE', 'GothAlienBoy Protocol activated. The Cube awaits.', 'info');
    
    // Start first mission
    startMission('boot_sequence');
    
    // Initialize game loop
    setInterval(gameLoop, 1000);
}

function gameLoop() {
    // Update resonance based on activity
    updateResonance();
    
    // Update Cube proximity
    updateCubeProximity();
    
    // Check for mission completion
    checkMissionProgress();
    
    // Random events
    if (Math.random() > 0.98) {
        triggerRandomEvent();
    }
}

function updateResonance() {
    // Resonance increases with player activity
    let increase = 0.001;
    
    // Bonus for active engagement
    if (GameState.system.activeWindows.length > 0) increase += 0.002;
    if (GameState.player.activeFilters.length > 0) increase += 0.003;
    if (GameState.world.discoveredEntities.length > 0) increase += 0.005;
    
    GameState.player.resonance = Math.min(100, GameState.player.resonance + increase);
    document.getElementById('resLevel').textContent = GameState.player.resonance.toFixed(1) + '%';
}

function updateCubeProximity() {
    // Cube gets closer as resonance increases
    if (GameState.player.resonance > 0) {
        GameState.story.cubeProximity = 1000 / GameState.player.resonance;
        document.getElementById('cubeProximity').textContent = 
            GameState.story.cubeProximity === Infinity ? '∞' : GameState.story.cubeProximity.toFixed(2);
    }
}

function startMission(missionId) {
    const missions = {
        boot_sequence: {
            title: 'Complete Boot Sequence',
            description: 'Initialize all systems and establish your connection to the Resonance Network.',
            objectives: [
                'Open the Terminal app',
                'Run system_status command',
                'Scan for frequencies',
                'Decode your first anomaly'
            ],
            reward: { resonance: 5, unlock: 'freqScanner' }
        }
        // More missions...
    };
    
    const mission = missions[missionId];
    if (mission) {
        GameState.story.currentMission = missionId;
        showNotification('NEW MISSION', mission.title, 'mission');
        
        // Update mission display
        updateMissionDisplay(mission);
    }
}

function checkMissionProgress() {
    // Check current mission objectives
    const currentMission = GameState.story.currentMission;
    
    if (currentMission === 'boot_sequence') {
        const objectives = [
            GameState.system.activeWindows.some(w => w.app.includes('terminal')),
            GameState.player.discoveries.includes('system_status'),
            GameState.world.decodedFrequencies.length > 0
        ];
        
        if (objectives.every(obj => obj)) {
            completeMission('boot_sequence');
        }
    }
}

function completeMission(missionId) {
    const missions = {
        boot_sequence: {
            reward: { resonance: 5, unlock: 'freqScanner' }
        }
    };
    
    const mission = missions[missionId];
    if (mission) {
        // Apply rewards
        GameState.player.resonance += mission.reward.resonance;
        
        if (mission.reward.unlock && !GameState.story.unlockedApps.includes(mission.reward.unlock)) {
            GameState.story.unlockedApps.push(mission.reward.unlock);
            showNotification('APP UNLOCKED', `${mission.reward.unlock} is now available!`, 'success');
        }
        
        // Mark as completed
        GameState.story.completedObjectives.push(missionId);
        GameState.story.currentMission = '';
        
        showNotification('MISSION COMPLETE', 'Check your new capabilities.', 'success');
        
        // Start next mission
        setTimeout(() => startMission('decode_frequencies'), 3000);
    }
}

function triggerRandomEvent() {
    const events = [
        {
            type: 'frequency_spike',
            message: 'Sudden frequency spike detected! Check Frequency Scanner.',
            action: () => {
                openApp('freqScanner');
                showNotification('ANOMALY DETECTED', 'Major frequency spike in progress!', 'warning');
            }
        },
        {
            type: 'cube_message',
            message: 'The Cube is broadcasting... something.',
            action: () => {
                showNotification('CUBE TRANSMISSION', '...you are being observed...', 'cube');
            }
        },
        {
            type: 'new_connection',
            message: 'New entity detected on the Resonance Network.',
            action: () => {
                showNotification('NEW CONNECTION', 'Unknown entity requesting contact.', 'info');
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    showNotification('EVENT', event.message, 'event');
    event.action();
}

function showNotification(title, message, type = 'info') {
    const notification = {
        id: `notif_${Date.now()}`,
        title,
        message,
        type,
        time: new Date(),
        read: false
    };
    
    GameState.system.notifications.unshift(notification);
    
    // Update UI
    updateNotificationDisplay();
    
    // Show toast
    showToastNotification(title, message, type);
}

function showToastNotification(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        background: rgba(5, 10, 15, 0.95);
        border: 1px solid ${type === 'warning' ? '#ffaa00' : type === 'success' ? '#00ff88' : '#00ff41'};
        border-radius: 6px;
        padding: 1rem;
        min-width: 300px;
        max-width: 400px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function updateNotificationDisplay() {
    const notifList = document.getElementById('notifList');
    if (!notifList) return;
    
    notifList.innerHTML = GameState.system.notifications.map(notif => `
        <div class="notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}">
            <div class="notif-title">${notif.title}</div>
            <div class="notif-message">${notif.message}</div>
            <div class="notif-time">${notif.time.toLocaleTimeString()}</div>
        </div>
    `).join('');
}

function updateMissionDisplay(mission) {
    // Update mission status in terminal or dedicated mission tracker
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
        terminalOutput.innerHTML += `
            <div class="terminal-response">
                === NEW MISSION: ${mission.title} ===<br>
                ${mission.description}<br><br>
                Objectives:<br>
                ${mission.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('<br>')}
            </div>
        `;
    }
}

// ===== AUDIO SYSTEM =====
function initAudioSystem() {
    const ambientAudio = document.getElementById('ambientAudio');
    
    // Start ambient audio
    ambientAudio.volume = 0.3;
    ambientAudio.play().catch(e => {
        console.log('Audio playback requires user interaction first');
    });
    
    // Audio controls
    document.addEventListener('click', function() {
        if (ambientAudio.paused) {
            ambientAudio.play().catch(console.error);
        }
    }, { once: true });
}

function startAmbientSystems() {
    // Start background processes
    setInterval(() => {
        // Random system updates
        GameState.system.signalStrength = 0.05 + Math.random() * 0.1;
        document.getElementById('signalStrength').textContent = 
            (GameState.system.signalStrength * 100).toFixed(1) + '%';
    }, 5000);
}

// ===== SAVE/LOAD =====
function saveGameState() {
    try {
        localStorage.setItem('gothalienboy_save', JSON.stringify(GameState));
        console.log('[SAVE] Game state saved');
    } catch (e) {
        console.error('[SAVE] Failed to save game:', e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('gothalienboy_save');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(GameState, loaded);
            console.log('[LOAD] Game state loaded');
        }
    } catch (e) {
        console.error('[LOAD] Failed to load game:', e);
    }
}

// Auto-save every minute
setInterval(saveGameState, 60000);

// Save on page unload
window.addEventListener('beforeunload', saveGameState);

// ===== UTILITY FUNCTIONS =====
function getDreamLogContent() {
    return `Dream Log content would go here...`;
}

function getSocialGraphContent() {
    return `Social Graph content would go here...`;
}

function getCubeInterfaceContent() {
    return `Cube Interface content would go here...`;
}

function getPerceptionFiltersContent() {
    return `Perception Filters content would go here...`;
}

// Initial call to start everything
console.log('[INIT] GothAlienBoy and the Black Cube - System Ready');
