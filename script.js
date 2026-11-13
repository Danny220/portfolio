document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR FUNCTIONALITY ---
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle mobile menu
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = menuBtn.querySelector('svg');
        if (mobileMenu.classList.contains('open')) {
            icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
        } else {
            icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />`;
        }
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuBtn.querySelector('svg').innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />`;
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting on scroll
    const sectionsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === sectionId);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    document.querySelectorAll('section[id]').forEach(section => {
         if (section.id !== 'hero') { // We don't need to observe the hero section for nav links
            sectionsObserver.observe(section);
         }
    });


    // --- PARTICLE CANVAS ANIMATION ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 120) * (canvas.width / 120)
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height / 120) * (canvas.width / 120);
        init();
    });

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#8892b0';
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse collision
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 5;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 5;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 5;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Create particle array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - 0.2;
            let directionY = (Math.random() * .4) - 0.2;
            let color = '#8892b0';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // Connect particles
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();


    // --- TYPING ANIMATION ---
    const typingEffect = (element, text, speed) => {
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
                i++;
                setTimeout(type, speed);
            } else {
                 element.querySelector('.typing-cursor').style.animation = 'blink 1s infinite';
            }
        };
        type();
    };

    const heroName = document.getElementById('hero-name');
    const heroTitle = document.getElementById('hero-title');

    setTimeout(() => typingEffect(heroName, 'Daniele Manna.', 100), 500);
    setTimeout(() => typingEffect(heroTitle, 'I build things for the web.', 75), 2500);


    // --- DYNAMIC CONTENT ---

    // Function to populate the experience timeline
    function populateExperience(experienceData) {
        const tabsContainer = document.getElementById('timeline-tabs');
        const detailsContainer = document.getElementById('timeline-details');

        tabsContainer.innerHTML = '';
        detailsContainer.innerHTML = '';

        experienceData.forEach((job, index) => {
            const tab = document.createElement('button');
            tab.className = `timeline-tab flex-shrink-0 text-left p-3 whitespace-nowrap border-b-2 border-l-0 md:border-b-0 md:border-l-2 md:w-full transition-all duration-300 ${index === 0 ? 'active' : ''}`;
            tab.textContent = job.company;
            tab.style.borderColor = 'var(--lightest-navy)';
            tab.dataset.index = index;
            tabsContainer.appendChild(tab);

            const detail = document.createElement('div');
            detail.className = `timeline-item ${index === 0 ? 'active' : ''}`;
            detail.innerHTML = `
                <div class="details">
                    <h3 class="text-xl font-bold text-gray-200" style="color: var(--lightest-slate);">${job.role} @ <span class="text-cyan-400" style="color: var(--cyan);">${job.company}</span></h3>
                    <p class="text-sm my-2">${job.period}</p>
                    <p>${job.description}</p>
                </div>
            `;
            detailsContainer.appendChild(detail);
        });

        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeline-tab')) {
                const allTabs = tabsContainer.querySelectorAll('.timeline-tab');
                const allDetails = detailsContainer.querySelectorAll('.timeline-item');
                const index = e.target.dataset.index;

                allTabs.forEach(tab => tab.classList.remove('active'));
                allDetails.forEach(item => item.classList.remove('active'));

                e.target.classList.add('active');
                allDetails[index].classList.add('active');
            }
        });
    }

    // Function to populate the skills grid
    function populateSkills(skillsData) {
        const skillsGrid = document.getElementById('skills-grid');
        skillsGrid.innerHTML = '';

        Object.entries(skillsData).forEach(([category, skills]) => {
            skills.forEach(skill => {
                const skillEl = document.createElement('div');
                skillEl.className = 'skill-item bg-gray-800 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg flex items-center'
                skillEl.style.backgroundColor = 'var(--light-navy)';
                skillEl.style.color = 'var(--light-slate)';
                skillEl.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-cyan-400" style="color: var(--cyan);"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ${skill}
                `;
                skillsGrid.appendChild(skillEl);
            });
        });
    }

    // Fetch data and populate the page
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateExperience(data.experience);
            populateSkills(data.skills);
        })
        .catch(error => console.error('Error fetching portfolio data:', error));


    // --- FADE-IN SCROLL ANIMATIONS ---
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.15
    });

    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });
    // Make the first section visible immediately
    if (fadeSections.length > 0) {
        fadeSections[0].classList.add('is-visible');
    }

});
