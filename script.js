// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadTools();
    updateStats();
    
    // Start live updates
    setInterval(updateStats, 5000);
});

// Navigation functionality
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to section
            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            if(window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if(scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Load security tools
function loadTools() {
    const tools = [
        {
            name: "Password Analyzer",
            icon: "key",
            description: "Test password strength and security",
            category: "defensive",
            action: "openPasswordTool"
        },
        {
            name: "Port Scanner",
            icon: "network-wired",
            description: "Simulate network port scanning",
            category: "offensive",
            action: "openPortScanner"
        },
        {
            name: "Hash Generator",
            icon: "hashtag",
            description: "Generate MD5, SHA-256, SHA-512 hashes",
            category: "forensic",
            action: "openHashTool"
        },
        {
            name: "Base64 Encoder",
            icon: "code",
            description: "Encode/decode Base64 data",
            category: "utility",
            action: "openBase64Tool"
        },
        {
            name: "IP Lookup",
            icon: "search-location",
            description: "Get IP address information",
            category: "recon",
            action: "openIPLookup"
        },
        {
            name: "VPN Guide",
            icon: "user-secret",
            description: "Setup personal VPN instructions",
            category: "defensive",
            action: "openVPNGuide"
        }
    ];
    
    const toolsGrid = document.querySelector('.tools-grid');
    
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-icon">
                <i class="fas fa-${tool.icon}"></i>
            </div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <button class="tool-btn" onclick="${tool.action}()">
                OPEN TOOL
            </button>
            <span class="tool-category ${tool.category}">${tool.category.toUpperCase()}</span>
        `;
        toolsGrid.appendChild(toolCard);
    });
    
    // Add CSS for tool categories
    const style = document.createElement('style');
    style.textContent = `
        .tool-card {
            background: var(--card-bg);
            border: 1px solid rgba(0, 255, 65, 0.3);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            position: relative;
            transition: all 0.3s;
        }
        .tool-card:hover {
            border-color: var(--matrix-green);
            transform: translateY(-5px);
        }
        .tool-icon {
            font-size: 2rem;
            color: var(--matrix-green);
            margin-bottom: 1rem;
        }
        .tool-card h3 {
            color: var(--cyber-blue);
            margin-bottom: 0.5rem;
        }
        .tool-card p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            min-height: 40px;
        }
        .tool-btn {
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--matrix-green);
            color: var(--matrix-green);
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-family: inherit;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s;
        }
        .tool-btn:hover {
            background: var(--matrix-green);
            color: var(--dark-bg);
        }
        .tool-category {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
        }
        .tool-category.defensive {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success);
            border: 1px solid var(--success);
        }
        .tool-category.offensive {
            background: rgba(255, 85, 85, 0.2);
            color: var(--danger);
            border: 1px solid var(--danger);
        }
        .tool-category.forensic {
            background: rgba(0, 128, 255, 0.2);
            color: var(--cyber-blue);
            border: 1px solid var(--cyber-blue);
        }
        .tool-category.utility {
            background: rgba(255, 170, 0, 0.2);
            color: var(--warning);
            border: 1px solid var(--warning);
        }
        .tool-category.recon {
            background: rgba(255, 0, 255, 0.2);
            color: #ff00ff;
            border: 1px solid #ff00ff;
        }
    `;
    document.head.appendChild(style);
}

// Update dashboard statistics
function updateStats() {
    // Simulate live updates
    const stats = {
        threatCount: document.getElementById('threatCount'),
        portCount: document.getElementById('portCount'),
        passwordCount: document.getElementById('passwordCount')
    };
    
    // Random small changes
    stats.threatCount.textContent = Math.max(0, 
        parseInt(stats.threatCount.textContent) + Math.floor(Math.random() * 3) - 1
    );
    
    stats.portCount.textContent = Math.max(0, 
        parseInt(stats.portCount.textContent.replace(/,/g, '')) + Math.floor(Math.random() * 10)
    ).toLocaleString();
    
    stats.passwordCount.textContent = Math.max(0, 
        parseInt(stats.passwordCount.textContent.replace(/,/g, '')) + Math.floor(Math.random() * 5)
    ).toLocaleString();
}

// Tool functions
function openPasswordTool() {
    alert('Password Analyzer Tool\n\nFeature: Check password strength\n\n(Full implementation would include:\n- Length check\n- Character variety\n- Common password detection\n- Entropy calculation)');
}

function openPortScanner() {
    alert('Port Scanner Tool\n\nFeature: Simulate network scanning\n\n(Full implementation would include:\n- Target IP/domain input\n- Port range selection\n- Scan type selection\n- Results display)');
}

function openHashTool() {
    alert('Hash Generator Tool\n\nFeature: Create cryptographic hashes\n\n(Full implementation would include:\n- Text input\n- Algorithm selection\n- Hash generation\n- Copy to clipboard)');
}

function openBase64Tool() {
    alert('Base64 Tool\n\nFeature: Encode/decode data\n\n(Full implementation would include:\n- Text input\n- Encode/Decode toggle\n- Live conversion\n- File support)');
}

function openIPLookup() {
    alert('IP Lookup Tool\n\nFeature: Get IP information\n\n(Full implementation would include:\n- IP validation\n- Geolocation data\n- ISP information\n- Threat intelligence)');
}

function openVPNGuide() {
    alert('VPN Setup Guide\n\nFeature: Instructions for secure VPN\n\n(Full implementation would include:\n- WireGuard setup\n- OpenVPN configuration\n- Security best practices\n- Troubleshooting)');
}
