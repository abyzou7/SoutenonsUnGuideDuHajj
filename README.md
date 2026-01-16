# Soutenons Un Guide Du Hajj

Site web statique moderne et élégant pour une initiative de solidarité légitime et conforme à la charia.

## 🎯 Description

Site web institutionnel et sobre pour soutenir un guide du Hajj dans une épreuve financière légitime. Le site présente l'initiative de solidarité, explique la situation, et permet de contribuer via une cagnotte Cotizup.

## ✨ Caractéristiques

- **Design moderne et élégant** : Interface sobre, institutionnelle et haut de gamme
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Barre de progression dynamique** : Affichage visuel de l'avancement de la collecte
- **Animations fluides** : Transitions CSS et animations au scroll
- **100% statique** : HTML, CSS et JavaScript vanilla (pas de framework)
- **Accessible** : Navigation clavier, contrastes respectés
- **Conforme à la charia** : Références religieuses et légitimité de la collecte

## 📁 Structure du projet

```
SoutenonsUnGuideDuHajj/
├── index.html              # Page d'accueil
├── comprendre.html         # Comprendre l'épreuve
├── charia.html             # Zakat & légitimité religieuse
├── transparence.html       # Transparence & engagements
├── aider.html              # Comment aider
├── suivi.html              # Suivi & avancement
├── faq.html                # Questions fréquentes
├── contact.html             # Contact
├── assets/
│   ├── css/
│   │   └── style.css       # Styles principaux
│   ├── js/
│   │   └── main.js         # JavaScript (menu, animations)
│   └── images/
│       └── logo.png        # Logo du site
└── README.md
```

## 🚀 Déploiement

### GitHub Pages

1. Créer un nouveau repository sur GitHub
2. Pousser le code :
   ```bash
   git remote add origin https://github.com/VOTRE_USERNAME/NOM_DU_REPO.git
   git branch -M main
   git push -u origin main
   ```
3. Activer GitHub Pages dans les paramètres du repository (Settings > Pages)
4. Sélectionner la branche `main` et le dossier `/ (root)`
5. Le site sera accessible à : `https://VOTRE_USERNAME.github.io/NOM_DU_REPO/`

### Netlify

1. Connecter votre repository GitHub à Netlify
2. Configuration automatique détectée
3. Le site sera déployé automatiquement

### Vercel

1. Importer le projet depuis GitHub
2. Configuration automatique
3. Déploiement instantané

## 🔧 Configuration

### Lien Cotizup

Remplacer le placeholder dans les fichiers suivants :
- `index.html` (2 occurrences)
- `aider.html` (1 occurrence)
- `suivi.html` (1 occurrence)

Rechercher : `https://www.cotizup.com/placeholder`
Remplacer par : Votre lien Cotizup réel

### Email de contact

Remplacer le placeholder dans `contact.html` :
- Rechercher : `À remplacer par l'adresse email réelle`
- Remplacer par : Votre adresse email

### Barre de progression

Les montants sont configurables dans `index.html` :
- `data-collected="235000"` : Montant collecté
- `data-total="748000"` : Montant total

## 📝 Technologies utilisées

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox, Animations)
- JavaScript (Vanilla ES6+)
- Google Fonts (Poppins)

## 📄 Licence

Initiative de solidarité conforme à la charia.

## 👤 Contact

Pour toute question concernant cette initiative, consultez la page [Contact](contact.html).
