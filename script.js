/* ============================================
   VALENTINE'S DAY — INTERACTIVE SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
    }, 2200);
    document.body.style.overflow = 'hidden';

    // --- Create Falling Petals ---
    function createPetals() {
        const container = document.getElementById('petals-container');
        const petalCount = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');

            const size = Math.random() * 12 + 10;
            const left = Math.random() * 100;
            const duration = Math.random() * 6 + 6;
            const delay = Math.random() * 10;
            const sway = (Math.random() - 0.5) * 200;
            const hue = Math.random() * 20 - 10; // slight color variation

            petal.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size * 1.3}px;
                --fall-duration: ${duration}s;
                --fall-delay: ${delay}s;
                --sway: ${sway}px;
                filter: hue-rotate(${hue}deg) blur(${Math.random() * 0.5}px);
                opacity: 0;
            `;

            container.appendChild(petal);
        }
    }

    // --- Create Golden Dust Particles ---
    function createDustParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = window.innerWidth < 768 ? 20 : 45;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dust-particle');

            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 5 + 4;
            const delay = Math.random() * 8;
            const driftX = (Math.random() - 0.5) * 80;
            const driftY = -(Math.random() * 150 + 50);

            particle.style.cssText = `
                left: ${left}%;
                top: ${top}%;
                --size: ${size}px;
                --float-duration: ${duration}s;
                --float-delay: ${delay}s;
                --drift-x: ${driftX}px;
                --drift-y: ${driftY}px;
            `;

            container.appendChild(particle);
        }
    }

    // --- Scroll Animations ---
    function initScrollAnimations() {
        const galleryFrames = document.querySelectorAll('.gallery-frame');
        const loveLetter = document.getElementById('love-letter');
        const sectionHeaders = document.querySelectorAll('.section-header');

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for gallery frames
                    const delay = entry.target.closest('.gallery-grid')
                        ? Array.from(galleryFrames).indexOf(entry.target) * 150
                        : 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
        }, observerOptions);

        galleryFrames.forEach(frame => observer.observe(frame));
        if (loveLetter) observer.observe(loveLetter);
        sectionHeaders.forEach(header => {
            header.classList.add('reveal');
            observer.observe(header);
        });
    }

    // --- Parallax on Gallery Frames (Mouse Move) ---
    function initParallaxMouse() {
        const gallery = document.getElementById('gallery');
        const frames = gallery.querySelectorAll('.gallery-frame');

        gallery.addEventListener('mousemove', (e) => {
            const rect = gallery.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

            frames.forEach(frame => {
                const parallaxFactor = parseFloat(frame.dataset.parallax) || 0.05;
                const moveX = mouseX * parallaxFactor * 100;
                const moveY = mouseY * parallaxFactor * 100;
                const rotation = frame.style.getPropertyValue('--rotation') || '0deg';

                frame.style.transform = `translateY(0) rotate(var(--rotation, 0deg)) translate(${moveX}px, ${moveY}px)`;
            });
        });

        gallery.addEventListener('mouseleave', () => {
            frames.forEach(frame => {
                frame.style.transform = `translateY(0) rotate(var(--rotation, 0deg))`;
            });
        });
    }

    // --- Fireworks Canvas Animation ---
    function initFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animating = false;

        function resizeCanvas() {
            const section = document.getElementById('finale');
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.008;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.03; // gravity
                this.life -= this.decay;
                this.size *= 0.99;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function createBurst(x, y) {
            const colors = ['#ff6b8a', '#FFD700', '#ff3366', '#FFB6C1', '#F5D78E', '#ff1a4d', '#E8394A'];
            for (let i = 0; i < 60; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            if (particles.length > 0 || animating) {
                requestAnimationFrame(animate);
            }
        }

        // Launch fireworks when finale section comes into view
        const finaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animating) {
                    animating = true;
                    animate();

                    // Create multiple bursts
                    const burstPositions = [
                        { x: canvas.width * 0.3, y: canvas.height * 0.25 },
                        { x: canvas.width * 0.7, y: canvas.height * 0.2 },
                        { x: canvas.width * 0.5, y: canvas.height * 0.15 },
                        { x: canvas.width * 0.2, y: canvas.height * 0.35 },
                        { x: canvas.width * 0.8, y: canvas.height * 0.3 },
                    ];

                    burstPositions.forEach((pos, i) => {
                        setTimeout(() => createBurst(pos.x, pos.y), i * 400);
                    });

                    // Additional random bursts
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            createBurst(
                                Math.random() * canvas.width,
                                Math.random() * canvas.height * 0.5
                            );
                        }, 2500 + i * 600);
                    }

                    // Stop after a while
                    setTimeout(() => {
                        animating = false;
                    }, 6000);
                }
            });
        }, { threshold: 0.3 });

        finaleObserver.observe(document.getElementById('finale'));
    }

    // --- Scroll indicator click ---
    function initScrollIndicator() {
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            indicator.addEventListener('click', () => {
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Hide on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                indicator.style.opacity = '0';
                indicator.style.pointerEvents = 'none';
            } else {
                indicator.style.opacity = '';
                indicator.style.pointerEvents = '';
            }
        }, { passive: true });
    }

    // --- Petal Swirl on Love Letter Hover ---
    function initPetalHoverEffect() {
        const petalText = document.querySelector('.petal-text');
        if (!petalText) return;

        petalText.addEventListener('mouseenter', () => {
            // Create a burst of mini petals around the text
            const rect = petalText.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < 12; i++) {
                const miniPetal = document.createElement('div');
                miniPetal.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 13px;
                    background: radial-gradient(ellipse at 30% 30%, #ff6b8a, #C41E3A);
                    border-radius: 50% 0 50% 50%;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    opacity: 1;
                `;
                document.body.appendChild(miniPetal);

                const angle = (i / 12) * Math.PI * 2;
                const radius = 80 + Math.random() * 60;
                const targetX = centerX + Math.cos(angle) * radius;
                const targetY = centerY + Math.sin(angle) * radius;

                requestAnimationFrame(() => {
                    miniPetal.style.left = targetX + 'px';
                    miniPetal.style.top = targetY + 'px';
                    miniPetal.style.opacity = '0';
                    miniPetal.style.transform = `rotate(${Math.random() * 360}deg) scale(0.3)`;
                });

                setTimeout(() => miniPetal.remove(), 1500);
            }
        });
    }

    // --- Photo Slideshows (auto-rotate) ---
    function initPhotoSlideshows() {
        document.querySelectorAll('.photo-slideshow').forEach(slideshow => {
            const imgs = slideshow.querySelectorAll('.slide-img');
            if (imgs.length <= 1) return;
            let current = 0;
            setInterval(() => {
                imgs[current].classList.remove('active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('active');
            }, 4000);
        });
    }

    // --- VTR Media Rain ---
    // ★★★ รูปและวิดีโอทั้งหมดในโฟลเดอร์ media/ ★★★
    const MEDIA_FILES = [
        '1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.jpg',
        '6.jpg', '7.jpg', '8.mp4', '9.mp4', '10.mp4',
        '11.mp4', '12.mp4', '13.mp4', '15.jpg', '16.mp4',
        '18.mp4', '19.mp4', '20.mp4', '21.mp4', '22.mp4',
        '23.mp4', '24.mp4', '25.mp4', '26.mp4', '27.mp4',
        '28.jpg', '29.mp4', '30.mp4', '31.mp4', '33.mp4',
        '34.jpg', '35.mp4', '36.mp4', '37.mp4', '38.mp4',
        '39.mp4', '40.mp4', '41.mp4', '42.jpg', '42.mp4',
        '43.jpg', '43.mp4', '44.jpg', '44.mp4',
        '45.jpg', '46.jpg', '47.jpg', '48.jpg', '49.jpg',
        '50.jpg', '51.jpg', '52.jpg', '53.jpg', '54.jpg',
        '55.jpg', '56.jpg', '57.jpg', '58.jpg',
    ];

    function initVTRMediaRain() {
        const btn = document.getElementById('surprise-btn');
        const overlay = document.getElementById('vtr-overlay');
        const closeBtn = document.getElementById('vtr-close');
        const rainContainer = document.getElementById('vtr-rain');

        if (!btn || !overlay) return;

        // Scroll-reveal for the surprise content
        const surpriseContent = document.querySelector('.surprise-content');
        if (surpriseContent) {
            surpriseContent.classList.add('reveal');
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.2 });
            obs.observe(surpriseContent);
        }

        function isVideo(filename) {
            return /\.(mp4|webm|mov|avi|ogg)$/i.test(filename);
        }

        function createMediaRain() {
            rainContainer.innerHTML = '';

            if (MEDIA_FILES.length === 0) return;

            // Create many falling items — cycle through media files
            const isMobile = window.innerWidth < 768;
            const totalItems = isMobile ? 15 : 30;
            const sizes = isMobile
                ? [{ w: 160, h: 120 }, { w: 180, h: 140 }, { w: 140, h: 190 }, { w: 170, h: 170 }]
                : [{ w: 220, h: 165 }, { w: 280, h: 210 }, { w: 190, h: 250 }, { w: 240, h: 240 }, { w: 300, h: 225 }, { w: 210, h: 160 }];

            for (let i = 0; i < totalItems; i++) {
                const file = MEDIA_FILES[i % MEDIA_FILES.length];
                const size = sizes[Math.floor(Math.random() * sizes.length)];
                const item = document.createElement('div');
                item.classList.add('vtr-media-item');

                // Random properties
                const left = Math.random() * 85 + 2; // 2% - 87%
                const duration = Math.random() * 12 + 18; // 18-30s (ช้าลง ซึ้งกว่า)
                const delay = Math.random() * 20; // stagger over 20s
                const rotStart = (Math.random() - 0.5) * 16; // -8 to 8 deg
                const rotEnd = (Math.random() - 0.5) * 16;
                const sway = (Math.random() - 0.5) * 100;
                const scale = 0.7 + Math.random() * 0.6; // 0.7 - 1.3

                item.style.cssText = `
                    left: ${left}%;
                    width: ${size.w}px;
                    height: ${size.h}px;
                    --rain-duration: ${duration}s;
                    --rain-delay: ${delay}s;
                    --rain-rot-start: ${rotStart}deg;
                    --rain-rot-end: ${rotEnd}deg;
                    --rain-sway: ${sway}px;
                    --rain-scale: ${scale};
                    z-index: ${Math.floor(Math.random() * 3) + 1};
                `;

                if (isVideo(file)) {
                    const video = document.createElement('video');
                    video.src = 'media/' + file;
                    video.autoplay = true;
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');
                    item.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = 'media/' + file;
                    img.alt = 'Memory';
                    img.loading = 'lazy';
                    item.appendChild(img);
                }

                rainContainer.appendChild(item);
            }
        }

        // Background music
        const bgMusic = new Audio('mp3/1.mp3');
        bgMusic.loop = false;
        bgMusic.volume = 0.5;

        // Auto-close when music ends
        bgMusic.addEventListener('ended', () => {
            closeOverlay();
        });

        function stopAllVideos() {
            const videos = rainContainer.querySelectorAll('video');
            videos.forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }

        btn.addEventListener('click', () => {
            if (MEDIA_FILES.length === 0) {
                alert('กรุณาเพิ่มชื่อไฟล์รูป/วิดีโอในตัวแปร MEDIA_FILES ใน script.js\nแล้ววางไฟล์ในโฟลเดอร์ media/');
                return;
            }
            createMediaRain();
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            bgMusic.currentTime = 0;
            bgMusic.play().catch(() => { });
            startTypewriter();
        });

        // --- Typewriter Effect ---
        const typewriterMessages = [
            'แจ็คอาจไม่ใช่คนโรแมนติกที่ทำอะไรให้ดูสวยงามเหมือนคนอื่น แต่แจ็คสัญญาว่าจะเป็นความสบายใจที่อยู่ข้างเบลล์เสมอแบบนี้ตลอดไป',
            'ไม่หวานเหมือนใคร ไม่เซอร์ไพรส์เหมือนคนอื่น แต่สิ่งที่แจ็คมีให้เบลล์คนเดียวคือ \'ความรัก\' ที่ไม่เคยน้อยลงเลย...',
            'ทุกภาพที่เลื่อนผ่าน... คือความทรงจำที่ไม่มีใครเหมือน\nคู่เราอาจจะธรรมดาในสายตาคนอื่น\nแต่เบลล์คือสิ่งที่วิเศษที่สุดสำหรับแจ็ค 💕',
            'ถึงจะชอบเรียก อีลิง แต่ในสายตาแจ็ค...\nลิงตัวนี้ก็น่ารักที่สุดแล้ว 🐒💕',
            'อาจจะเหนื่อยหน่อยนะช่วงแรก...\nช่วงนี้ก็เหนื่อยเหมือนเดิม 555\nสู้ไปด้วยกัน 💪🩷',
            'ทุกช่วงเวลาที่เลื่อนผ่านมา มันอาจจะไม่ได้สวยงามเหมือนคนอื่น\nเราเริ่มต้นแบบเหนื่อยๆ และแจ็คเองก็ทำให้เบลล์ปวดหัวอยู่บ่อยๆ\nแต่ขอบคุณนะที่เบลล์ยังอยู่ตรงนี้ 🤍',
            'แจ็คอาจเริ่มจากศูนย์ ไม่มีอะไรสวยหรูให้เบลล์เหมือนใครเขา\nช่วงแรกเราอาจจะเหนื่อยและล้มลุกคลุกคลาน\nแต่อยากจะบอกว่าแจ็คพยายามทำทุกสิ่งให้ดีที่สุด 💛',
            'ทุกภาพที่เลื่อนผ่านไป...\nคือหลักฐานว่าเราสู้มาด้วยกันแค่ไหน 🫶',
        ];
        let twTimeout = null;
        let twRunning = false;

        function startTypewriter() {
            const el = document.getElementById('typewriter-text');
            if (!el) return;
            el.textContent = '';
            twRunning = true;
            let msgIdx = 0;

            function typeMessage() {
                if (!twRunning) return;
                const msg = typewriterMessages[msgIdx];
                let charIdx = 0;
                el.innerHTML = '';

                function typeChar() {
                    if (!twRunning) return;
                    if (charIdx < msg.length) {
                        const ch = msg[charIdx];
                        if (ch === '\n') {
                            el.innerHTML += '<br>';
                        } else {
                            el.innerHTML += ch;
                        }
                        charIdx++;
                        twTimeout = setTimeout(typeChar, 90 + Math.random() * 50);
                    } else {
                        // Pause after full message, then erase
                        twTimeout = setTimeout(eraseMessage, 3000);
                    }
                }

                function eraseMessage() {
                    if (!twRunning) return;
                    const txt = el.textContent;
                    if (txt.length > 0) {
                        // Remove last char (handle multi-byte Thai)
                        const arr = [...txt];
                        arr.pop();
                        el.innerHTML = arr.join('').replace(/\n/g, '<br>');
                        twTimeout = setTimeout(eraseMessage, 20);
                    } else {
                        // Next message
                        msgIdx = (msgIdx + 1) % typewriterMessages.length;
                        twTimeout = setTimeout(typeMessage, 500);
                    }
                }

                twTimeout = setTimeout(typeChar, 800);
            }

            // Start after a short delay so the overlay fades in first
            twTimeout = setTimeout(typeMessage, 2000);
        }

        function stopTypewriter() {
            twRunning = false;
            if (twTimeout) clearTimeout(twTimeout);
            const el = document.getElementById('typewriter-text');
            if (el) el.textContent = '';
        }

        function closeOverlay() {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            stopAllVideos();
            stopTypewriter();
            // Fade out music
            let vol = bgMusic.volume;
            const fadeOut = setInterval(() => {
                vol -= 0.05;
                if (vol <= 0) {
                    clearInterval(fadeOut);
                    bgMusic.pause();
                    bgMusic.volume = 0.5;
                } else {
                    bgMusic.volume = vol;
                }
            }, 50);
            setTimeout(() => {
                rainContainer.innerHTML = '';
            }, 800);
        }

        closeBtn.addEventListener('click', closeOverlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeOverlay();
            }
        });
    }

    // --- Init all animations ---
    function initAnimations() {
        createPetals();
        createDustParticles();
        initScrollAnimations();
        initParallaxMouse();
        initFireworks();
        initScrollIndicator();
        initPetalHoverEffect();
        initPhotoSlideshows();
        initVTRMediaRain();
    }
});
