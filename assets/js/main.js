document.addEventListener('DOMContentLoaded', function() {
    
    
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
                menuToggle.setAttribute('aria-label', 'Fermer le menu');
            } else {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });

        
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });

        
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });
    }

    
    
    
    const header = document.querySelector('header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    
    
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                
            }
        });
    }, observerOptions);

    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            
            if (href === '#' || href === '') {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    
    
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    
    
    
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    if (progressBar && progressPercentage) {
        const collected = parseFloat(progressBar.getAttribute('data-collected')) || 492000;
        const total = parseFloat(progressBar.getAttribute('data-total')) || 748000;
        const percentage = Math.round((collected / total) * 100 * 100) / 100; 

        
        function animateProgress() {
            
            progressBar.style.width = '0%';
            progressPercentage.textContent = '0%';

            
            setTimeout(() => {
                
                progressBar.style.width = percentage + '%';
                
                
                let currentPercent = 0;
                const increment = percentage / 60; 
                const duration = 2000; 
                const stepTime = duration / 60;

                const timer = setInterval(() => {
                    currentPercent += increment;
                    if (currentPercent >= percentage) {
                        currentPercent = percentage;
                        clearInterval(timer);
                    }
                    progressPercentage.textContent = currentPercent.toFixed(2) + '%';
                }, stepTime);
            }, 300);
        }

        
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
            const progressObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateProgress();
                        
                        progressObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });

            progressObserver.observe(progressSection);
        } else {
            
            setTimeout(animateProgress, 500);
        }
    }
});
