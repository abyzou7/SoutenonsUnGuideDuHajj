document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-message success';
            successMessage.textContent = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les meilleurs délais.';
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            
            setTimeout(() => {
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 5000);
        }

        contactForm.addEventListener('submit', function() {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
        });
    }
});
