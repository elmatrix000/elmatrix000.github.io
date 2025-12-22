class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load simple placeholder graphics (we'll replace these later)
        this.load.image('ground', 'https://labs.phaser.io/assets/skies/deepblue.png');
        this.load.image('scroll', 'https://labs.phaser.io/assets/sprites/orb.png');
        this.load.image('sage', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
    }

    create() {
        // Create the ancient grounds background
        this.add.image(400, 300, 'ground').setDisplaySize(800, 600);
        
        // Title
        this.add.text(400, 40, 'THE UNWRITTEN CODEX', {
            fontSize: '32px',
            fill: '#d4af37',
            fontFamily: 'Georgia',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(400, 560, '← Click on glowing scrolls to collect ancient wisdom →', {
            fontSize: '16px',
            fill: '#e6d5b8',
            fontFamily: 'Georgia'
        }).setOrigin(0.5);

        // Define wisdom fragments
        const wisdomFragments = [
            { x: 200, y: 300, title: 'Know Thyself', text: 'True wisdom begins with self-understanding.', source: 'Temple of Apollo at Delphi' },
            { x: 400, y: 200, title: 'Wu Wei', text: 'The highest effectiveness comes from effortless action.', source: 'Daoist Teachings' },
            { x: 600, y: 400, title: 'Memento Mori', text: 'Remember you must die. This clarifies what truly matters.', source: 'Stoic Philosophy' }
        ];

        // Store for later reference
        this.wisdomFragments = wisdomFragments;

        // Create interactive scrolls
        wisdomFragments.forEach((fragment, index) => {
            const scroll = this.add.image(fragment.x, fragment.y, 'scroll')
                .setDisplaySize(60, 80)
                .setTint(0xffd700) // Gold tint
                .setInteractive({ useHandCursor: true })
                .setDataEnabled();
            
            // Store the fragment data in the game object
            scroll.data.set('fragment', fragment);
            
            // Add glow effect
            scroll.preFX?.addGlow(0xffaa00, 2, 0, false, 0.1);
            
            // Add text label
            this.add.text(fragment.x, fragment.y + 70, fragment.title, {
                fontSize: '14px',
                fill: '#ffd700',
                backgroundColor: '#00000088',
                padding: { x: 5, y: 3 }
            }).setOrigin(0.5);
            
            // Click handler for scroll
            scroll.on('pointerdown', () => {
                // Set as active wisdom in global state
                window.gameState.activeWisdom = fragment;
                window.updateCodexUI();
                
                // Visual feedback
                this.tweens.add({
                    targets: scroll,
                    scale: 1.3,
                    duration: 200,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
                
                // Show notification
                const notification = this.add.text(400, 100, `Fragment Found: "${fragment.title}"`, {
                    fontSize: '20px',
                    fill: '#ffffff',
                    backgroundColor: '#000000cc',
                    padding: { x: 15, y: 10 }
                }).setOrigin(0.5);
                
                // Fade out notification
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: notification,
                        alpha: 0,
                        y: 50,
                        duration: 500,
                        onComplete: () => notification.destroy()
                    });
                });
            });
        });

        // Create a sage character
        const sage = this.add.image(700, 100, 'sage')
            .setDisplaySize(80, 100)
            .setTint(0x8b7355);
        
        // Sage text
        this.add.text(700, 170, 'Ancient Sage', {
            fontSize: '14px',
            fill: '#8b7355',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Animate the sage
        this.tweens.add({
            targets: sage,
            y: 90,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        // Update loop - we'll add animations here later
    }
}
