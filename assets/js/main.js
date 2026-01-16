/**
 * SOUTENONS UN GUIDE DU HAJJ - JavaScript
 * Menu mobile responsive et animations au scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // MENU MOBILE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Changer l'icône du bouton
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
                menuToggle.setAttribute('aria-label', 'Fermer le menu');
            } else {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });

        // Fermer le menu quand on clique en dehors
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

    // ============================================
    // HEADER STICKY AVEC ANIMATION
    // ============================================
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

    // ============================================
    // ANIMATIONS AU SCROLL (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel : arrêter d'observer après l'animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer toutes les sections avec la classe .section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observer les éléments avec la classe .fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Observer les cartes pour une animation en cascade
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Ajouter un délai progressif pour l'animation en cascade
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // ============================================
    // SMOOTH SCROLL POUR LES LIENS ANCRES
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides ou juste "#"
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

    // ============================================
    // ANIMATION DU HERO AU CHARGEMENT
    // ============================================
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

    // ============================================
    // BARRE DE PROGRESSION DE LA COLLECTE
    // ============================================
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    if (progressBar && progressPercentage) {
        const collected = parseFloat(progressBar.getAttribute('data-collected')) || 235000;
        const total = parseFloat(progressBar.getAttribute('data-total')) || 748000;
        const percentage = Math.round((collected / total) * 100 * 100) / 100; // Arrondi à 2 décimales

        // Fonction pour animer la barre de progression
        function animateProgress() {
            // Réinitialiser la largeur à 0
            progressBar.style.width = '0%';
            progressPercentage.textContent = '0%';

            // Attendre un peu pour que l'animation soit visible
            setTimeout(() => {
                // Animer jusqu'au pourcentage exact
                progressBar.style.width = percentage + '%';
                
                // Animer le pourcentage avec un compteur
                let currentPercent = 0;
                const increment = percentage / 60; // 60 frames pour 2 secondes
                const duration = 2000; // 2 secondes
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

        // Observer pour déclencher l'animation quand la section est visible
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
            const progressObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateProgress();
                        // Ne déclencher qu'une fois
                        progressObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });

            progressObserver.observe(progressSection);
        } else {
            // Si pas d'observer, animer directement au chargement
            setTimeout(animateProgress, 500);
        }
    }
});
