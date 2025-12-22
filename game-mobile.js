// ===== GOTHALIENBOY MOBILE GAME ENGINE =====

class MobileGame {
    constructor() {
        this.state = {
            player: {
                resonance: 0.3,
                discoveries: [],
                currentMission: 'initialize',
                missionProgress: 0,
                puzzlesSolved: 0,
                frequenciesFound: 0,
                playTime: 0
            },
            game: {
                currentScreen: 'home',
                scannerActive: false,
                notifications: [],
                lastSave: null,
                vibrationEnabled: true,
                soundEnabled: true
            },
            data: {
                anomalies: [],
                dreamEntries: [],
                decodedFrequencies: [],
                unlockedApps: ['home', 'terminal', 'scanner', 'dreams', 'menu']
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('[MOBILE] Initializing GothAlienBoy Mobile...');
        
        // Load saved game
        this.loadGame();
        
        // Initialize systems
        this.initClock();
        this.initNavigation();
        this.initTerminal();
        this.initScanner();
        this.initTouch();
        this.initSwipe();
        this.initAudio();
        
        // Start game loop
        this.startGameLoop();
        
        // Show welcome
        this.showNotification('System initialized', 'success');
        
        // Start first mission
        this.startMission('initialize');
    }
    
    // ===== SAVE/LOAD SYSTEM =====
    saveGame() {
        try {
            this.state.game.lastSave = Date.now();
            localStorage.setItem('goth_mobile_save', JSON.stringify(this.state));
            this.showNotification('Game saved', 'success');
            this.vibrate(50);
        } catch (e) {
            console.error('[SAVE] Failed:', e);
            this.showNotification('Save failed', 'warning');
        }
    }
    
    loadGame() {
        try {
            const saved = localStorage.getItem('goth_mobile_save');
            if (saved) {
                const loaded = JSON.parse(saved);
                this.state = { ...this.state, ...loaded };
                console.log('[LOAD] Game loaded');
                this.updateUI();
            }
        } catch (e) {
            console.error('[LOAD] Failed:', e);
        }
    }
    
    // ===== CLOCK SYSTEM =====
    initClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const batteryEl = document.getElementById('batteryLevel');
            if (batteryEl) {
                // Simulate battery drain (for game atmosphere)
                const battery = Math.max(10, 100 - Math.floor((Date.now() % 3600000) / 36000));
                batteryEl.textContent = battery + '%';
            }
            
            const timeEl = document.getElementById('mobileTime');
            if (timeEl) timeEl.textContent = timeStr;
        };
        
        updateClock();
        setInterval(updateClock, 60000); // Update every minute
    }
    
    // ===== NAVIGATION SYSTEM =====
    initNavigation() {
        // Bottom nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const app = btn.dataset.app;
                this.showScreen(app);
                this.setActiveNavButton(app);
                this.vibrate(30);
            });
        });
        
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen('home');
                this.setActiveNavButton('home');
                this.vibrate(20);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                this.vibrate(40);
            });
        });
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.mobile-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.game.currentScreen = screenId;
            
            // Screen-specific initialization
            switch(screenId) {
                case 'terminal':
                    this.initTerminalInput();
                    break;
                case 'scanner':
                    this.updateScannerUI();
                    break;
                case 'dreams':
                    this.updateDreamLog();
                    break;
            }
        }
    }
    
    setActiveNavButton(app) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.app === app) {
                btn.classList.add('active');
            }
        });
    }
    
    // ===== TERMINAL SYSTEM =====
    initTerminal() {
        this.terminalHistory = [];
        this.commandIndex = -1;
    }
    
    initTerminalInput() {
        const input = document.getElementById('mobileCommandInput');
        if (!input) return;
        
        input.focus();
        
        // Auto-focus on terminal screen
        const observer = new MutationObserver(() => {
            if (this.state.game.currentScreen === 'terminal') {
                input.focus();
            }
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
    
    executeMobileCommand() {
        const input = document.getElementById('mobileCommandInput');
        const command = input.value.trim();
        
        if (!command) return;
        
        // Add to history
        this.terminalHistory.push(command);
        this.commandIndex = this.terminalHistory.length;
        
        // Process command
        this.processCommand(command);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        const output = document.getElementById('terminalOutputMobile');
        if (output) {
            output.scrollTop = output.scrollHeight;
        }
        
        this.vibrate(20);
    }
    
    processCommand(command) {
        const output = document.getElementById('terminalOutputMobile');
        if (!output) return;
        
        // Add command to output
        output.innerHTML += `
            <div class="terminal-line">
                <span class="prompt-mobile">goth@cube:~$</span>
                <span class="command-mobile">${command}</span>
            </div>
        `;
        
        // Process command
        const response = this.getCommandResponse(command);
        
        // Add response
        if (response) {
            output.innerHTML += `<div class="terminal-response">${response}</div>`;
        }
        
        // Add new prompt
        output.innerHTML += `
            <div class="terminal-line">
                <span class="prompt-mobile">goth@cube:~$</span>
                <span class="cursor">█</span>
            </div>
        `;
    }
    
    getCommandResponse(command) {
        const cmd = command.toLowerCase();
        
        const responses = {
            'help': `Available commands:<br>
• scan [target] - Scan for frequencies<br>
• decode - Open frequency decoder<br>
• status - Show system status<br>
• clear - Clear terminal<br>
• resonance - Check resonance level<br>
• mission - Show current mission<br>
• save - Save game progress<br>
• reset - Reset game (warning!)`,
            
            'status': `=== SYSTEM STATUS ===<br>
Resonance: ${this.state.player.resonance.toFixed(1)}%<br>
Mission: ${this.state.player.currentMission}<br>
Progress: ${this.state.player.missionProgress}%<br>
Puzzles: ${this.state.player.puzzlesSolved} solved<br>
Frequencies: ${this.state.player.frequenciesFound} found<br>
Play Time: ${this.state.player.playTime}m`,
            
            'scan': `Starting scan...<br>
Scanning WiFi: Found 3 hidden frequencies<br>
Scanning Bluetooth: Found 1 anomaly<br>
Scanning Ambient: Detected Cube resonance<br><br>
Use 'decode' to analyze frequencies.`,
            
            'decode': `Opening frequency decoder...<br>
Anomaly detected: 433.92MHz<br>
Signal strength: 78%<br>
Type: DATA_STREAM<br><br>
Switching to decoder interface.`,
            
            'resonance': `Current resonance: ${this.state.player.resonance.toFixed(1)}%<br>
Resonance increases as you:<br>
• Solve puzzles (+1-5%)<br>
• Discover frequencies (+0.5-2%)<br>
• Complete missions (+10%)<br><br>
Higher resonance unlocks new abilities.`,
            
            'mission': `Current mission: ${this.state.player.currentMission}<br>
Progress: ${this.state.player.missionProgress}%<br><br>
Objectives:<br>
1. Initialize system (✓)<br>
2. Scan for frequencies<br>
3. Decode first anomaly<br>
4. Establish resonance link`,
            
            'clear': ``, // Empty response - cleared by UI
            
            'save': `Saving game...<br>
Game state saved successfully.`,
            
            'reset': `WARNING: This will reset all progress.<br>
Type 'reset confirm' to proceed.`
        };
        
        if (cmd === 'clear') {
            document.getElementById('terminalOutputMobile').innerHTML = '';
            return '';
        }
        
        if (cmd === 'reset confirm') {
            this.resetGame();
            return 'Game reset. Starting fresh...';
        }
        
        if (cmd.startsWith('scan ')) {
            const target = cmd.split(' ')[1];
            return this.scanTarget(target);
        }
        
        return responses[cmd] || `Unknown command: ${cmd}<br>Type 'help' for available commands.`;
    }
    
    scanTarget(target) {
        const targets = {
            'wifi': 'Found 3 hidden frequencies in WiFi spectrum',
            'bluetooth': 'Detected anomalous pairing requests',
            'cellular': 'Intercepted encrypted data stream',
            'ambient': 'Cube resonance detected at 7.83Hz',
            'local': 'Scanning local network... Found 2 anomalies'
        };
        
        const response = targets[target.toLowerCase()] || 
            `Unknown target: ${target}<br>Try: wifi, bluetooth, cellular, ambient, local`;
        
        // Add discovery
        if (targets[target.toLowerCase()]) {
            this.addDiscovery(`Scanned ${target} network`);
            this.state.player.frequenciesFound++;
            this.updateUI();
        }
        
        return response;
    }
    
    insertCommand(cmd) {
        const input = document.getElementById('mobileCommandInput');
        if (input) {
            input.value = cmd;
            input.focus();
            this.vibrate(10);
        }
    }
    
    // ===== SCANNER SYSTEM =====
    initScanner() {
        this.scannerInterval = null;
        this.detectedAnomalies = [];
        this.currentFrequency = 0;
        this.scanStrength = 0;
    }
    
    toggleScanner() {
        const toggleBtn = document.getElementById('scanToggle');
        
        if (this.scannerInterval) {
            this.stopScanner();
            toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
            toggleBtn.style.background = 'rgba(0, 255, 65, 0.1)';
        } else {
            this.startScanner();
            toggleBtn.innerHTML = '<i class="fas fa-stop"></i>';
            toggleBtn.style.background = 'rgba(255, 85, 85, 0.1)';
        }
        
        this.vibrate(40);
    }
    
    startScanner() {
        if (this.scannerInterval) return;
        
        this.scannerInterval = setInterval(() => {
            // Update frequency display
            this.currentFrequency = 20 + Math.random() * 3000;
            this.scanStrength = 30 + Math.random() * 70;
            
            // Update UI
            document.getElementById('currentFrequency').textContent = 
                this.currentFrequency.toFixed(2) + ' MHz';
            document.getElementById('frequencyStrength').textContent = 
                this.scanStrength.toFixed(1) + '%';
            
            // Visualize
            this.updateFrequencyDisplay();
            
            // Random anomaly detection
            if (Math.random() > 0.8) {
                this.detectAnomaly();
            }
            
        }, 500);
        
        this.showNotification('Scanner activated', 'info');
    }
    
    stopScanner() {
        if (this.scannerInterval) {
            clearInterval(this.scannerInterval);
            this.scannerInterval = null;
            this.showNotification('Scanner deactivated', 'info');
        }
    }
    
    detectAnomaly() {
        const anomalies = [
            { freq: '433.92 MHz', type: 'DATA_STREAM', desc: 'Encrypted social media feed' },
            { freq: '2.437 GHz', type: 'CONTROL_SIGNAL', desc: 'Cube proximity beacon' },
            { freq: '114.7 MHz', type: 'BIO_FEEDBACK', desc: 'Collective anxiety pattern' },
            { freq: '7.83 Hz', type: 'EARTH_RESONANCE', desc: 'Amplified Schumann resonance' }
        ];
        
        const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        
        if (!this.detectedAnomalies.some(a => a.freq === anomaly.freq)) {
            this.detectedAnomalies.push(anomaly);
            this.updateAnomaliesList();
            
            this.state.player.frequenciesFound++;
            this.addDiscovery(`Detected anomaly: ${anomaly.freq}`);
            
            this.showNotification(`Anomaly detected: ${anomaly.freq}`, 'warning');
            this.vibrate(100);
            
            // Unlock puzzle on first anomaly
            if (this.detectedAnomalies.length === 1) {
                setTimeout(() => {
                    this.showNotification('Frequency decoder unlocked!', 'success');
                    this.state.data.unlockedApps.push('puzzle-1');
                }, 1000);
            }
        }
    }
    
    updateFrequencyDisplay() {
        const display = document.getElementById('frequencyDisplay');
        if (!display) return;
        
        // Create frequency bar
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${Math.random() * 95}%;
            width: 3px;
            height: ${this.scanStrength}%;
            background: ${this.scanStrength > 80 ? '#ff5555' : 
                         this.scanStrength > 60 ? '#ffaa00' : '#00ff41'};
            opacity: 0.7;
        `;
        
        display.appendChild(bar);
        
        // Keep only 50 bars
        if (display.children.length > 50) {
            display.removeChild(display.firstChild);
        }
    }
    
    updateAnomaliesList() {
        const list = document.getElementById('anomaliesList');
        if (!list) return;
        
        const count = document.getElementById('anomalyCountMobile');
        if (count) count.textContent = this.detectedAnomalies.length;
        
        if (this.detectedAnomalies.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No anomalies detected yet</p>
                    <small>Start scanning to find hidden frequencies</small>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.detectedAnomalies.map((anomaly, index) => `
            <div class="discovery-item ${index === this.detectedAnomalies.length - 1 ? 'new' : ''}">
                <i class="fas fa-exclamation-triangle"></i>
                <div style="flex: 1;">
                    <strong>${anomaly.freq}</strong>
                    <div style="font-size: 12px; opacity: 0.8;">${anomaly.type}</div>
                </div>
                <button class="decode-btn-mobile" onclick="mobileGame.decodeAnomaly('${anomaly.freq}')"
                        style="padding: 8px 12px; background: rgba(157, 0, 255, 0.1); 
                               border: 1px solid #9d00ff; border-radius: 6px; color: #9d00ff;">
                    <i class="fas fa-code"></i>
                </button>
            </div>
        `).join('');
    }
    
    decodeAnomaly(freq) {
        this.showNotification(`Decoding ${freq}...`, 'info');
        this.showScreen('puzzle-1');
        this.vibrate(50);
    }
    
    // ===== PUZZLE SYSTEM =====
    initPuzzle1() {
        const symbols = ['◈', '⚫', '⬢', '⧖', '⧗', '⌬'];
        const reference = ['◈', '⚫', '⬢', '⧖', '⧗', '⌬'].sort(() => Math.random() - 0.5).slice(0, 4);
        
        // Set reference pattern
        const refEl = document.getElementById('referencePattern');
        refEl.innerHTML = reference.map(sym => `
            <div style="font-size: 32px; margin: 0 10px; color: #00ff41;">${sym}</div>
        `).join('');
        
        // Create symbol pool (shuffled)
        const poolEl = document.getElementById('symbolPool');
        poolEl.innerHTML = [...symbols, ...symbols]
            .sort(() => Math.random() - 0.5)
            .map(sym => `
                <div class="symbol" draggable="true" data-symbol="${sym}">
                    ${sym}
                </div>
            `).join('');
        
        // Create target slots
        const targetEl = document.getElementById('targetGrid');
        targetEl.innerHTML = Array(6).fill().map((_, i) => `
            <div class="target-slot" data-slot="${i}"></div>
        `).join('');
        
        // Setup drag and drop for touch
        this.initTouchDragDrop();
    }
    
    initTouchDragDrop() {
        let draggedSymbol = null;
        
        document.querySelectorAll('.symbol').forEach(symbol => {
            symbol.addEventListener('touchstart', (e) => {
                e.preventDefault();
                draggedSymbol = symbol;
                symbol.classList.add('dragging');
                this.vibrate(20);
            });
            
            symbol.addEventListener('touchend', () => {
                symbol.classList.remove('dragging');
                draggedSymbol = null;
            });
        });
        
        document.querySelectorAll('.target-slot').forEach(slot => {
            slot.addEventListener('touchmove', (e) => e.preventDefault());
            
            slot.addEventListener('touchend', (e) => {
                if (draggedSymbol && !slot.children.length) {
                    const clone = draggedSymbol.cloneNode(true);
                    clone.classList.remove('dragging');
                    clone.style.position = 'static';
                    clone.style.margin = '0';
                    slot.appendChild(clone);
                    slot.classList.add('filled');
                    
                    this.checkPuzzleSolution();
                    this.vibrate(30);
                }
            });
        });
    }
    
    checkPuzzleSolution() {
        const slots = document.querySelectorAll('.target-slot');
        const filled = Array.from(slots).filter(s => s.children.length > 0);
        
        const progress = (filled.length / slots.length) * 100;
        document.getElementById('puzzleProgress').textContent = 
            Math.round(progress) + '%';
        
        if (filled.length === slots.length) {
            this.completePuzzle();
        }
    }
    
    completePuzzle() {
        setTimeout(() => {
            this.showNotification('Frequency decoded successfully!', 'success');
            this.state.player.puzzlesSolved++;
            this.state.player.resonance += 5;
            this.state.player.missionProgress = 50;
            
            this.updateUI();
            this.saveGame();
            this.vibrate([100, 50, 100]);
            
            setTimeout(() => {
                this.showScreen('home');
                this.showNotification('New mission: Establish resonance link', 'mission');
            }, 2000);
        }, 500);
    }
    
    giveHint() {
        this.showNotification('Match the pattern in the reference area', 'info');
        this.vibrate(30);
    }
    
    resetPuzzle() {
        document.querySelectorAll('.target-slot').forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('filled');
        });
        document.getElementById('puzzleProgress').textContent = '0%';
        this.vibrate(40);
    }
    
    submitPuzzle() {
        this.checkPuzzleSolution();
        this.vibrate(50);
    }
    
    // ===== DREAM LOG SYSTEM =====
    updateDreamLog() {
        const entries = [
            {
                date: 'Last Night',
                lucidity: 92,
                content: 'The Cube was closer this time. I could see symbols rotating on its surface. They looked like ancient mathematics mixed with quantum notation.',
                tags: ['Cube', 'Symbols', 'Recurring']
            },
            {
                date: '3 Days Ago',
                lucidity: 45,
                content: 'Floating through data streams. Everything was numbers and light. A voice whispered frequencies.',
                tags: ['Data', 'Voice', 'Floating']
            }
        ];
        
        this.state.data.dreamEntries = entries;
        
        const container = document.getElementById('dreamEntries');
        if (container) {
            container.innerHTML = entries.map(entry => `
                <div class="dream-entry">
                    <div class="dream-header">
                        <span class="dream-date">${entry.date}</span>
                        <span class="dream-lucidity ${entry.lucidity > 80 ? 'high' : 'medium'}">
                            ${entry.lucidity}% Lucid
                        </span>
                    </div>
                    <p class="dream-content">${entry.content}</p>
                    <div class="dream-tags">
                        ${entry.tags.map(tag => `
                            <span class="dream-tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }
    
    newDreamEntry() {
        this.showNotification('Dream logging unlocked at resonance 25%', 'info');
        this.vibrate(40);
    }
    
    // ===== MISSION SYSTEM =====
    startMission(missionId) {
        const missions = {
            'initialize': {
                title: 'System Initialization',
                description: 'Activate all systems and establish your connection',
                progress: 25
            },
            'first_scan': {
                title: 'First Frequency Scan',
                description: 'Use the scanner to find hidden frequencies',
                progress: 0
            },
            'decode_anomaly': {
                title: 'Decode Anomaly',
                description: 'Solve the frequency puzzle to understand the signal',
                progress: 0
            }
        };
        
        const mission = missions[missionId];
        if (mission) {
            this.state.player.currentMission = mission.title;
            this.state.player.missionProgress = mission.progress;
            
            document.getElementById('currentMissionText').textContent = mission.description;
            this.updateMissionProgress();
            
            this.showNotification(`New mission: ${mission.title}`, 'mission');
        }
    }
    
    updateMissionProgress() {
        const progressBar = document.getElementById('missionProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = this.state.player.missionProgress + '%';
        }
        if (progressText) {
            progressText.textContent = this.state.player.missionProgress + '%';
        }
    }
    
    completeMission() {
        this.state.player.resonance += 10;
        this.state.player.missionProgress = 100;
        this.updateMissionProgress();
        
        this.showNotification('Mission complete! Resonance increased.', 'success');
        this.vibrate([100, 50, 100]);
        
        // Start next mission after delay
        setTimeout(() => {
            this.startMission('first_scan');
        }, 2000);
    }
    
    // ===== TOUCH & SWIPE CONTROLS =====
    initTouch() {
        // Add touch feedback to all buttons
        document.querySelectorAll('button, .touchable').forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.opacity = '0.8';
            });
            
            el.addEventListener('touchend', () => {
                el.style.opacity = '1';
            });
        });
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    initSwipe() {
        let startX, startY;
        const threshold = 50; // Minimum swipe distance
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.handleSwipe('left');
                } else {
                    this.handleSwipe('right');
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    handleSwipe(direction) {
        const screens = ['home', 'terminal', 'scanner', 'dreams', 'menu'];
        const currentIndex = screens.indexOf(this.state.game.currentScreen);
        
        if (direction === 'left' && currentIndex < screens.length - 1) {
            this.showScreen(screens[currentIndex + 1]);
            this.setActiveNavButton(screens[currentIndex + 1]);
        } else if (direction === 'right' && currentIndex > 0) {
            this.showScreen(screens[currentIndex - 1]);
            this.setActiveNavButton(screens[currentIndex - 1]);
        }
        
        this.vibrate(30);
    }
    
    // ===== AUDIO & VIBRATION =====
    initAudio() {
        this.audioContext = null;
        this.sounds = {};
        
        // Check vibration support
        this.state.game.vibrationEnabled = 'vibrate' in navigator;
        
        // Check audio context
        if (window.AudioContext || window.webkitAudioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    vibrate(pattern) {
        if (!this.state.game.vibrationEnabled) return;
        
        if (navigator.vibrate) {
            if (Array.isArray(pattern)) {
                navigator.vibrate(pattern);
            } else {
                navigator.vibrate(pattern);
            }
        }
    }
    
    playSound(type) {
        if (!this.state.game.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'click':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 50);
                break;
            case 'success':
                oscillator.frequency.value = 1200;
                gainNode.gain.value = 0.1;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 200);
                break;
            case 'scan':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.05;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 100);
                break;
        }
    }
    
    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
        const notification = document.getElementById('mobileNotification');
        const text = document.getElementById('notificationText');
        const icon = notification.querySelector('i');
        
        if (!notification || !text) return;
        
        // Set icon based on type
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                icon.style.color = '#00ff41';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-triangle';
                icon.style.color = '#ffaa00';
                break;
            case 'error':
                icon.className = 'fas fa-times-circle';
                icon.style.color = '#ff5555';
                break;
            case 'mission':
                icon.className = 'fas fa-bullseye';
                icon.style.color = '#9d00ff';
                break;
            default:
                icon.className = 'fas fa-info-circle';
                icon.style.color = '#00ffff';
        }
        
        text.textContent = message;
        notification.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
        // Add to history
        this.state.game.notifications.unshift({
            message,
            type,
            timestamp: Date.now()
        });
        
        this.vibrate(40);
    }
    
    hideNotification() {
        const notification = document.getElementById('mobileNotification');
        if (notification) {
            notification.classList.remove('show');
        }
    }
    
    // ===== DISCOVERY SYSTEM =====
    addDiscovery(discovery) {
        this.state.player.discoveries.unshift({
            text: discovery,
            timestamp: Date.now()
        });
        
        this.updateDiscoveriesList();
    }
    
    updateDiscoveriesList() {
        const list = document.getElementById('discoveriesList');
        if (!list) return;
        
        const discoveries = this.state.player.discoveries.slice(0, 5); // Show last 5
        
        list.innerHTML = discoveries.map((disc, index) => `
            <div class="discovery-item ${index === 0 ? 'new' : ''}">
                <i class="fas fa-compass"></i>
                <span>${disc.text}</span>
                <small>${this.formatTimeAgo(disc.timestamp)}</small>
            </div>
        `).join('');
    }
    
    formatTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        return Math.floor(seconds / 86400) + 'd ago';
    }
    
    // ===== UI UPDATES =====
    updateUI() {
        // Update resonance display
        document.querySelectorAll('#mobileResonance, #termResonance, #menuResonance').forEach(el => {
            el.textContent = this.state.player.resonance.toFixed(1) + '%';
        });
        
        // Update stats
        document.getElementById('puzzlesSolved').textContent = this.state.player.puzzlesSolved;
        document.getElementById('frequenciesFound').textContent = this.state.player.frequenciesFound;
        document.getElementById('playTime').textContent = this.state.player.playTime + 'm';
        
        // Update mission progress
        this.updateMissionProgress();
        
        // Update discoveries
        this.updateDiscoveriesList();
    }
    
    // ===== GAME LOOP =====
    startGameLoop() {
        setInterval(() => {
            // Update play time
            this.state.player.playTime++;
            
            // Slowly increase resonance (passive growth)
            if (Math.random() > 0.9) {
                this.state.player.resonance += 0.01;
                this.updateUI();
            }
            
            // Random events
            if (Math.random() > 0.995) {
                this.randomEvent();
            }
            
            // Auto-save every 5 minutes
            if (this.state.player.playTime % 5 === 0) {
                this.saveGame();
            }
            
        }, 60000); // Update every minute
    }
    
    randomEvent() {
        const events = [
            () => {
                this.showNotification('Cube resonance spike detected', 'warning');
                this.vibrate([100, 50, 100]);
            },
            () => {
                this.showNotification('New frequency pattern emerging', 'info');
                this.addDiscovery('Detected new frequency pattern');
            },
            () => {
                this.showNotification('Dream intensity increasing', 'mission');
                this.state.player.resonance += 0.5;
                this.updateUI();
            }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        randomEvent();
    }
    
    // ===== QUICK ACTIONS =====
    startQuickScan() {
        this.showScreen('scanner');
        this.setActiveNavButton('scanner');
        
        if (!this.scannerInterval) {
            setTimeout(() => {
                this.toggleScanner();
            }, 500);
        }
    }
    
    openDecoder() {
        if (this.detectedAnomalies.length > 0) {
            this.showScreen('puzzle-1');
            this.initPuzzle1();
        } else {
            this.showNotification('Scan for frequencies first', 'warning');
        }
    }
    
    openDreamLog() {
        this.showScreen('dreams');
        this.setActiveNavButton('dreams');
    }
    
    openResonanceMap() {
        this.showNotification('Resonance map unlocked at 15% resonance', 'info');
    }
    
    // ===== UTILITY FUNCTIONS =====
    resetGame() {
        if (confirm('Are you sure? This will erase all progress.')) {
            localStorage.removeItem('goth_mobile_save');
            location.reload();
        }
    }
    
    openApp(app) {
        switch(app) {
            case 'database':
                this.showNotification('Lore database unlocked at 30% resonance', 'info');
                break;
            case 'map':
                this.showNotification('Resonance map unlocked at 15% resonance', 'info');
                break;
            case 'chakras':
                this.showNotification('Chakra system unlocked at 50% resonance', 'info');
                break;
            case 'settings':
                this.showNotification('Settings menu coming soon', 'info');
                break;
            case 'achievements':
                this.showNotification('Achievements unlocked at 10% resonance', 'info');
                break;
            case 'help':
                this.showNotification('Check terminal for commands', 'info');
                break;
        }
        this.vibrate(40);
    }
}

// ===== INITIALIZE GAME =====
let mobileGame;

function initializeMobileGame() {
    mobileGame = new MobileGame();
    
    // Make game accessible globally for HTML onclick handlers
    window.mobileGame = mobileGame;
    
    // Global helper functions
    window.showScreen = (screen) => mobileGame.showScreen(screen);
    window.toggleScanner = () => mobileGame.toggleScanner();
    window.scanTarget = (target) => mobileGame.scanTarget(target);
    window.startQuickScan = () => mobileGame.startQuickScan();
    window.openDecoder = () => mobileGame.openDecoder();
    window.openDreamLog = () => mobileGame.openDreamLog();
    window.openResonanceMap = () => mobileGame.openResonanceMap();
    window.executeMobileCommand = () => mobileGame.executeMobileCommand();
    window.insertCommand = (cmd) => mobileGame.insertCommand(cmd);
    window.saveGame = () => mobileGame.saveGame();
    window.confirmReset = () => {
        if (confirm('Reset all game progress?')) {
            mobileGame.resetGame();
        }
    };
    
    console.log('[MOBILE] GothAlienBoy Mobile initialized');
}

// Start game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileGame);
} else {
    initializeMobileGame();
}
