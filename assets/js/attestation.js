// Initialisation de la signature pad
let signaturePad = null;
let canvas = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le canvas de signature
    canvas = document.getElementById('signaturePad');
    if (canvas) {
        function resizeCanvas() {
            const container = canvas.parentElement;
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            // Définir la taille du canvas
            canvas.width = rect.width * dpr;
            canvas.height = 200 * dpr; // Hauteur fixe de 200px
            
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            
            // Définir la taille d'affichage
            canvas.style.width = rect.width + 'px';
            canvas.style.height = '200px';
            
            // Réinitialiser la signature pad si elle existe déjà
            if (signaturePad) {
                signaturePad.clear();
            }
        }
        
        // Initialiser la taille
        resizeCanvas();
        
        // Créer la signature pad
        signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
            penColor: 'rgb(0, 0, 0)',
            minWidth: 1,
            maxWidth: 3,
        });
        
        // Réajuster lors du redimensionnement
        window.addEventListener('resize', resizeCanvas);
    }

    // Bouton pour effacer la signature
    const clearBtn = document.getElementById('clearSignature');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (signaturePad) {
                signaturePad.clear();
            }
        });
    }

    // Gestion du champ "Autre" pour le mode de paiement
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentMethodOther = document.getElementById('paymentMethodOther');
    
    if (paymentMethodOther) {
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'autre') {
                    paymentMethodOther.style.display = 'block';
                    paymentMethodOther.required = true;
                } else {
                    paymentMethodOther.style.display = 'none';
                    paymentMethodOther.required = false;
                    paymentMethodOther.value = '';
                }
            });
        });
    }

    // Pré-remplir les dates avec la date d'aujourd'hui
    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const refundDateInput = document.getElementById('refundDate');
        const documentDateInput = document.getElementById('documentDate');
        
        if (refundDateInput) {
            refundDateInput.value = today;
        }
        
        if (documentDateInput) {
            documentDateInput.value = today;
        }
    }
    
    // Appeler immédiatement et aussi après un court délai pour être sûr
    setDefaultDates();
    setTimeout(setDefaultDates, 100);

    // Capitaliser automatiquement la première lettre des champs texte
    function capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Appliquer la capitalisation automatique sur tous les champs texte
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.type !== 'email') {
                // Pour les champs avec plusieurs mots, capitaliser chaque mot
                const words = this.value.trim().split(/\s+/);
                const capitalized = words.map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                this.value = capitalized;
            }
        });
    });

    // Gestion du formulaire
    const form = document.getElementById('attestationForm');
    const generateBtn = document.getElementById('generateBtn');

    // Génération du PDF
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                generatePDF();
            }
        });
    }

    // Validation du formulaire
    function validateForm() {
        const beneficiaryName = document.getElementById('beneficiaryName').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const idNumber = document.getElementById('idNumber').value.trim();
        const address = document.getElementById('address').value.trim();
        const amount = document.getElementById('amount').value;
        const refundDate = document.getElementById('refundDate').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        const refundType = document.querySelector('input[name="refundType"]:checked');
        const place = document.getElementById('place').value.trim();
        const documentDate = document.getElementById('documentDate').value;
        const fillerEmail = document.getElementById('fillerEmail').value.trim();
        
        if (!beneficiaryName) {
            alert('Veuillez saisir le nom et prénom du bénéficiaire.');
            return false;
        }
        
        if (!birthDate) {
            alert('Veuillez saisir la date de naissance.');
            return false;
        }
        
        if (!idNumber) {
            alert('Veuillez saisir le numéro de pièce d\'identité.');
            return false;
        }
        
        if (!address) {
            alert('Veuillez saisir l\'adresse complète.');
            return false;
        }
        
        if (!amount || parseFloat(amount) <= 0) {
            alert('Veuillez saisir un montant valide.');
            return false;
        }
        
        if (!refundDate) {
            alert('Veuillez saisir la date du remboursement.');
            return false;
        }
        
        if (!paymentMethod) {
            alert('Veuillez sélectionner un mode de paiement.');
            return false;
        }
        
        if (paymentMethod.value === 'autre' && !paymentMethodOther.value.trim()) {
            alert('Veuillez préciser le mode de paiement "Autre".');
            return false;
        }
        
        if (!refundType) {
            alert('Veuillez sélectionner le type de remboursement (partiel ou total).');
            return false;
        }
        
        if (!place) {
            alert('Veuillez saisir le lieu où l\'attestation est établie.');
            return false;
        }
        
        if (!documentDate) {
            alert('Veuillez saisir la date du document.');
            return false;
        }
        
        if (!fillerEmail) {
            alert('Veuillez saisir votre adresse email.');
            return false;
        }
        
        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fillerEmail)) {
            alert('Veuillez saisir une adresse email valide.');
            return false;
        }
        
        if (!signaturePad || signaturePad.isEmpty()) {
            alert('Veuillez signer le document.');
            return false;
        }
        
        return true;
    }

    // Générer le PDF
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const formData = getFormData();
        const signatureData = signaturePad.toDataURL();
        
        // Marges
        const margin = 20;
        let yPos = margin;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (margin * 2);

        // Fonction pour vérifier si on doit ajouter une nouvelle page
        function checkPageBreak(requiredSpace) {
            if (yPos + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
        }

        // Titre
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('ATTESTATION DE REMBOURSEMENT', pageWidth / 2, yPos, { align: 'center' });
        yPos += 7;

        // Sous-titre
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('(Dans le cadre de la collecte de Zakat destinée aux pèlerins lésés du Hajj)', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        // Section 1: Identité du bénéficiaire
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('1. IDENTITÉ DU BÉNÉFICIAIRE', margin, yPos);
        yPos += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Je soussigné(e) :', margin, yPos);
        yPos += 5;

        doc.text(`• Nom et prénom : ${formData.beneficiaryName}`, margin + 2, yPos);
        yPos += 5;

        doc.text(`• Date de naissance : ${formatDate(formData.birthDate)}`, margin + 2, yPos);
        yPos += 5;

        doc.text(`• Numéro de pièce d'identité : ${formData.idNumber}`, margin + 2, yPos);
        yPos += 5;

        const addressLines = doc.splitTextToSize(`• Adresse / Ville / Pays : ${formData.address}`, contentWidth - 2);
        doc.text(addressLines, margin + 2, yPos);
        yPos += addressLines.length * 4.5 + 8;

        // Section 2: Détails du remboursement
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('2. DÉTAILS DU REMBOURSEMENT', margin, yPos);
        yPos += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Reconnais avoir reçu, à ce jour :', margin, yPos);
        yPos += 5;

        doc.text(`• Montant remboursé : ${formatAmount(formData.amount)}`, margin + 2, yPos);
        yPos += 5;

        doc.text(`• Date du remboursement : ${formatDate(formData.refundDate)}`, margin + 2, yPos);
        yPos += 5;

        doc.text(`• Mode de paiement : ${getPaymentMethodLabel(formData.paymentMethod, formData.paymentMethodOther)}`, margin + 2, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        const contextText = `Ce remboursement s'inscrit dans le cadre de la redistribution de fonds issus de la Zakat, collectés afin d'indemniser les pèlerins lésés dans l'organisation du Hajj.`;
        const contextLines = doc.splitTextToSize(contextText, contentWidth);
        doc.text(contextLines, margin, yPos);
        yPos += contextLines.length * 4.5 + 8;

        // Section 3: Déclaration du bénéficiaire
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('3. DÉCLARATION DU BÉNÉFICIAIRE', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const declarationText = `Je reconnais expressément que le montant mentionné ci-dessus m'a été remis en toute transparence et correspond à un remboursement ${formData.refundType === 'partiel' ? 'partiel' : 'total'} (rayer la mention inutile) des sommes engagées dans le cadre de cette affaire.`;
        const declarationLines = doc.splitTextToSize(declarationText, contentWidth);
        doc.text(declarationLines, margin, yPos);
        yPos += declarationLines.length * 4.5 + 5;

        doc.text('Je déclare que ce versement :', margin, yPos);
        yPos += 5;

        doc.text('• a été effectué volontairement,', margin + 2, yPos);
        yPos += 4.5;

        doc.text('• sans contrainte,', margin + 2, yPos);
        yPos += 4.5;

        doc.text('• et conformément à l\'objectif annoncé de restitution aux pèlerins concernés.', margin + 2, yPos);
        yPos += 8;

        // Section 4: Engagement et décharge
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('4. ENGAGEMENT ET DÉCHARGE', margin, yPos);
        yPos += 6;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const dischargeText = `Par la présente, je confirme que le montant reçu solde tout ou partie de ma créance, selon le cas, et je décharge le responsable de la redistribution de toute contestation relative à la somme effectivement versée à ce jour.`;
        const dischargeLines = doc.splitTextToSize(dischargeText, contentWidth);
        doc.text(dischargeLines, margin, yPos);
        yPos += dischargeLines.length * 4.5 + 8;

        // Section 5: Signatures
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('5. SIGNATURES', margin, yPos);
        yPos += 5;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fait à : ${formData.place}`, margin, yPos);
        yPos += 4.5;

        doc.text(`Le : ${formatDate(formData.documentDate)}`, margin, yPos);
        yPos += 5;

        doc.text('Signature du bénéficiaire :', margin, yPos);
        yPos += 4.5;

        /*doc.setFontSize(9);
        doc.text('Nom + signature', margin, yPos);
        yPos += 4.5;*/

        doc.setFontSize(10);
        doc.text(formData.beneficiaryName, margin + 2, yPos);
        yPos += 6;

        // Ajouter l'image de la signature
        try {
            const signatureWidth = 50;
            const signatureHeight = 15;
            doc.addImage(signatureData, 'PNG', margin, yPos, signatureWidth, signatureHeight);
            yPos += signatureHeight + 5;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la signature:', error);
            doc.setFont('helvetica', 'normal');
            doc.text('[Signature requise]', margin, yPos);
            yPos += 5;
        }

        if (formData.responsibleName) {
            doc.setFontSize(10);
            doc.text('Signature du responsable de la redistribution :', margin, yPos);
            yPos += 4;

            /*doc.setFontSize(9);
            doc.text('Nom + signature', margin, yPos);
            yPos += 4;*/

            doc.setFontSize(10);
            doc.text(formData.responsibleName, margin + 2, yPos);
            yPos += 5;
        }

        // Note de bas de page - placée en bas de la page
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const noteText = 'Cette attestation est établie à des fins de traçabilité, de transparence et de responsabilité morale et financière.';
        const noteLines = doc.splitTextToSize(noteText, contentWidth);
        const noteHeight = noteLines.length * 3.5;
        const noteYPos = pageHeight - margin - noteHeight;
        doc.text(noteLines, margin, noteYPos);

        // Générer un nom de fichier
        const fileName = `Attestation_Remboursement_${formData.beneficiaryName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Télécharger le PDF
        doc.save(fileName);
        
        // Envoyer l'email avec les données et le PDF
        sendEmailWithPDF(formData, doc, fileName);
    }

    // Fonction pour envoyer l'email avec les données du formulaire et le PDF via FormSubmit
    async function sendEmailWithPDF(formData, pdfDoc, fileName) {
        try {
            // Convertir le PDF en Blob
            const pdfBlob = pdfDoc.output('blob');
            
            // Préparer le contenu de l'email avec toutes les données du formulaire
            const emailContent = `
Nouvelle attestation de remboursement reçue

IDENTITÉ DU BÉNÉFICIAIRE:
- Nom et prénom: ${formData.beneficiaryName}
- Date de naissance: ${formatDate(formData.birthDate)}
- Numéro de pièce d'identité: ${formData.idNumber}
- Adresse: ${formData.address}

DÉTAILS DU REMBOURSEMENT:
- Montant remboursé: ${formatAmount(formData.amount)}
- Date du remboursement: ${formatDate(formData.refundDate)}
- Mode de paiement: ${getPaymentMethodLabel(formData.paymentMethod, formData.paymentMethodOther)}
- Type de remboursement: ${formData.refundType === 'partiel' ? 'Partiel' : 'Total'}

LIEU ET DATE:
- Fait à: ${formData.place}
- Date du document: ${formatDate(formData.documentDate)}

${formData.responsibleName ? `RESPONSABLE:\n- Nom: ${formData.responsibleName}\n` : ''}

CONTACT:
- Email de la personne qui a rempli: ${formData.fillerEmail}

---
Le PDF de l'attestation est disponible en téléchargement par la personne qui a rempli le formulaire.
Ce message a été envoyé automatiquement depuis le formulaire d'attestation.
            `.trim();
            
            // Créer un FormData pour envoyer les données
            const formDataToSend = new FormData();
            formDataToSend.append('_captcha', 'false');
            formDataToSend.append('_subject', `Nouvelle attestation de remboursement - ${formData.beneficiaryName}`);
            formDataToSend.append('_template', 'table');
            formDataToSend.append('email', formData.fillerEmail);
            formDataToSend.append('name', `Formulaire d'attestation - ${formData.beneficiaryName}`);
            formDataToSend.append('message', emailContent);
            
            // Ajouter le PDF en pièce jointe
            formDataToSend.append('attachment', pdfBlob, fileName);
            
            // Envoyer via fetch vers FormSubmit (API standard)
            const response = await fetch('https://formsubmit.co/soutenonsunguidehajj@gmail.com', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // FormSubmit renvoie généralement une réponse JSON même en cas de succès
            let result;
            try {
                const text = await response.text();
                result = text ? JSON.parse(text) : { success: true };
            } catch (e) {
                // Si ce n'est pas du JSON, considérer comme succès si le statut est OK
                result = { success: response.ok };
            }
            
            if (response.ok || result.success) {
                // Message de confirmation
                alert('Attestation générée avec succès !\n\nLe fichier PDF a été téléchargé et les informations ont été envoyées par email à soutenonsunguidehajj@gmail.com.\n\nNote: Si vous ne recevez pas l\'email, vérifiez votre dossier spam ou attendez quelques minutes.');
            } else {
                // Si l'envoi échoue, essayer avec la méthode standard
                console.warn('Envoi AJAX échoué, tentative avec méthode standard...', result);
                sendEmailStandard(formData, emailContent);
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            // Essayer avec la méthode standard en cas d'erreur
            try {
                const emailContent = `
Nouvelle attestation de remboursement reçue

IDENTITÉ DU BÉNÉFICIAIRE:
- Nom et prénom: ${formData.beneficiaryName}
- Date de naissance: ${formatDate(formData.birthDate)}
- Numéro de pièce d'identité: ${formData.idNumber}
- Adresse: ${formData.address}

DÉTAILS DU REMBOURSEMENT:
- Montant remboursé: ${formatAmount(formData.amount)}
- Date du remboursement: ${formatDate(formData.refundDate)}
- Mode de paiement: ${getPaymentMethodLabel(formData.paymentMethod, formData.paymentMethodOther)}
- Type de remboursement: ${formData.refundType === 'partiel' ? 'Partiel' : 'Total'}

LIEU ET DATE:
- Fait à: ${formData.place}
- Date du document: ${formatDate(formData.documentDate)}

${formData.responsibleName ? `RESPONSABLE:\n- Nom: ${formData.responsibleName}\n` : ''}

CONTACT:
- Email de la personne qui a rempli: ${formData.fillerEmail}

---
Le PDF de l'attestation est disponible en téléchargement par la personne qui a rempli le formulaire.
Ce message a été envoyé automatiquement depuis le formulaire d'attestation.
                `.trim();
                sendEmailStandard(formData, emailContent);
            } catch (fallbackError) {
                console.error('Erreur lors de l\'envoi de secours:', fallbackError);
                alert('Attestation générée avec succès ! Le fichier PDF a été téléchargé.\n\nNote: L\'envoi par email a rencontré une erreur. Le PDF est disponible dans vos téléchargements.');
            }
        }
    }
    
    // Fonction de secours pour envoyer l'email avec la méthode standard (iframe)
    function sendEmailStandard(formData, emailContent) {
        const emailForm = document.getElementById('emailForm');
        
        // Nettoyer les anciens champs dynamiques
        const existingFields = emailForm.querySelectorAll('[data-dynamic]');
        existingFields.forEach(field => field.remove());
        
        // Ajouter le message
        const messageInput = document.createElement('input');
        messageInput.type = 'hidden';
        messageInput.name = 'message';
        messageInput.value = emailContent;
        messageInput.setAttribute('data-dynamic', 'true');
        emailForm.appendChild(messageInput);
        
        // Ajouter l'email de l'expéditeur
        const fromEmailInput = document.createElement('input');
        fromEmailInput.type = 'hidden';
        fromEmailInput.name = 'email';
        fromEmailInput.value = formData.fillerEmail;
        fromEmailInput.setAttribute('data-dynamic', 'true');
        emailForm.appendChild(fromEmailInput);
        
        // Ajouter le nom de l'expéditeur
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'name';
        nameInput.value = `Formulaire d'attestation - ${formData.beneficiaryName}`;
        nameInput.setAttribute('data-dynamic', 'true');
        emailForm.appendChild(nameInput);
        
        // Mettre à jour le sujet avec le nom du bénéficiaire
        const subjectInput = emailForm.querySelector('input[name="_subject"]');
        if (subjectInput) {
            subjectInput.value = `Nouvelle attestation de remboursement - ${formData.beneficiaryName}`;
        }
        
        // Soumettre le formulaire dans l'iframe caché
        emailForm.submit();
        
        // Attendre un peu pour que l'envoi se fasse, puis afficher le message
        setTimeout(function() {
            alert('Attestation générée avec succès !\n\nLe fichier PDF a été téléchargé et les informations ont été envoyées par email à soutenonsunguidehajj@gmail.com.\n\nNote: Si vous ne recevez pas l\'email, vérifiez votre dossier spam ou attendez quelques minutes.');
        }, 1000);
    }

    // Récupérer les données du formulaire
    function getFormData() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        const refundType = document.querySelector('input[name="refundType"]:checked');
        
        return {
            beneficiaryName: document.getElementById('beneficiaryName').value.trim(),
            birthDate: document.getElementById('birthDate').value,
            idNumber: document.getElementById('idNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            amount: document.getElementById('amount').value,
            refundDate: document.getElementById('refundDate').value,
            paymentMethod: paymentMethod ? paymentMethod.value : '',
            paymentMethodOther: document.getElementById('paymentMethodOther').value.trim(),
            refundType: refundType ? refundType.value : '',
            place: document.getElementById('place').value.trim(),
            documentDate: document.getElementById('documentDate').value,
            responsibleName: document.getElementById('responsibleName').value.trim(),
            fillerEmail: document.getElementById('fillerEmail').value.trim()
        };
    }

    // Obtenir le libellé du mode de paiement
    function getPaymentMethodLabel(method, other) {
        switch(method) {
            case 'virement':
                return 'Virement bancaire';
            case 'especes':
                return 'Espèces';
            case 'autre':
                return other ? `Autre : ${other}` : 'Autre';
            default:
                return '';
        }
    }

    // Formater le montant pour l'affichage dans le PDF
    function formatAmount(amount) {
        const num = parseFloat(amount);
        if (isNaN(num)) return '0,00 €';
        // Formater avec 2 décimales et le symbole €
        const formatted = num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return formatted + ' €';
    }

    // Formater la date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

});
